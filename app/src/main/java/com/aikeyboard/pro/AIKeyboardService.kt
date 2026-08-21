package com.aikeyboard.pro

import android.inputmethodservice.InputMethodService
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.HorizontalScrollView
import android.widget.LinearLayout
import android.widget.TextView
import androidx.core.content.ContextCompat

class AIKeyboardService : InputMethodService() {

    private lateinit var keyboardView: View
    private lateinit var keysContainer: LinearLayout
    private lateinit var suggestionsContainer: LinearLayout
    private lateinit var aiFeaturesContainer: LinearLayout
    private val suggestionEngine = SuggestionEngine()
    private var currentText = StringBuilder()
    private var isShift = false
    private var isSymbols = false

    private val lettersRows = listOf(
        listOf("q","w","e","r","t","y","u","i","o","p"),
        listOf("a","s","d","f","g","h","j","k","l"),
        listOf("z","x","c","v","b","n","m")
    )

    private val symbolsRows = listOf(
        listOf("1","2","3","4","5","6","7","8","9","0"),
        listOf("@","#","$","_","&","-","+","(",")","/"),
        listOf("*","\"","'",":",";","!","?")
    )

    override fun onCreateInputView(): View {
        keyboardView = LayoutInflater.from(this).inflate(R.layout.keyboard_layout, null)
        keysContainer = keyboardView.findViewById(R.id.keys_container)
        suggestionsContainer = keyboardView.findViewById(R.id.suggestions_container)
        aiFeaturesContainer = keyboardView.findViewById(R.id.ai_features_container)

        setupAIFeatures()
        buildKeyboard()
        updateSuggestions()

        return keyboardView
    }

    private fun setupAIFeatures() {
        val features = listOf("✓ Grammar" to { toggleGrammar() }, "🎭 Tone" to { toggleTone() },
            "😊 Emoji" to { toggleEmoji() }, "🌐 Translate" to { translateText() },
            "✨ Enhance" to { enhanceText() })

        features.forEach { (label, action) ->
            val btn = Button(this).apply {
                text = label
                textSize = 11f
                setBackgroundResource(R.drawable.suggestion_chip_bg)
                setTextColor(ContextCompat.getColor(context, R.color.suggestion_text))
                layoutParams = LinearLayout.LayoutParams(
                    ViewGroup.LayoutParams.WRAP_CONTENT,
                    ViewGroup.LayoutParams.MATCH_PARENT
                ).apply { marginEnd = 8 }
                setOnClickListener { action() }
            }
            aiFeaturesContainer.addView(btn)
        }
    }

    private fun buildKeyboard() {
        keysContainer.removeAllViews()
        val rows = if (isSymbols) symbolsRows else lettersRows

        rows.forEachIndexed { index, row ->
            val rowLayout = LinearLayout(this).apply {
                orientation = LinearLayout.HORIZONTAL
                layoutParams = LinearLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.WRAP_CONTENT
                ).apply {
                    setMargins(0, 4, 0, 4)
                }
                weightSum = row.size.toFloat()
            }

            // Add shift for row 2
            if (index == 2) {
                val shiftBtn = createKey("⇧", isSpecial = true, weight = 1.5f) {
                    toggleShift()
                }
                rowLayout.addView(shiftBtn)
            }

            row.forEach { key ->
                val display = if (isShift && !isSymbols) key.uppercase() else key
                val btn = createKey(display, weight = 1f) {
                    onKeyPress(key)
                }
                rowLayout.addView(btn)
            }

            // Add backspace for row 2
            if (index == 2) {
                val bsBtn = createKey("⌫", isSpecial = true, weight = 1.5f) {
                    backspace()
                }
                rowLayout.addView(bsBtn)
            }

            keysContainer.addView(rowLayout)
        }

        // Bottom row
        val bottomRow = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            layoutParams = LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            ).apply { setMargins(0, 4, 0, 0) }
        }

        bottomRow.addView(createKey("123", isSpecial = true, weight = 1.5f) { toggleSymbols() })
        bottomRow.addView(createKey("😊", isAI = true, weight = 1f) { insertEmoji() })
        bottomRow.addView(createKey("space", isSpecial = true, weight = 4f) { insertSpace() })
        bottomRow.addView(createKey("✨", isAI = true, weight = 1f) { enhanceText() })
        bottomRow.addView(createKey("return", isAI = true, weight = 2f) { sendReturn() })

        keysContainer.addView(bottomRow)
    }

    private fun createKey(label: String, isSpecial: Boolean = false, isAI: Boolean = false, weight: Float = 1f, action: () -> Unit): Button {
        return Button(this).apply {
            text = label
            textSize = if (label.length > 1) 12f else 18f
            isAllCaps = false

            val bg = when {
                isAI -> R.drawable.key_selector_ai
                isSpecial -> R.drawable.key_selector_special
                else -> R.drawable.key_selector
            }
            val tc = if (isAI) R.color.key_text_light else R.color.key_text

            setBackgroundResource(bg)
            setTextColor(ContextCompat.getColor(context, tc))

            layoutParams = LinearLayout.LayoutParams(0, 140).apply {
                this.weight = weight
                marginEnd = 4
            }

            setOnClickListener {
                action()
                animateKey(this)
            }
        }
    }

    private fun animateKey(view: View) {
        view.animate().scaleX(0.9f).scaleY(0.9f).setDuration(50).withEndAction {
            view.animate().scaleX(1f).scaleY(1f).setDuration(50).start()
        }.start()
    }

    private fun onKeyPress(key: String) {
        val char = if (isShift && !isSymbols) key.uppercase() else key
        currentInputConnection?.commitText(char, 1)
        currentText.append(char)
        updateSuggestions()
    }

    private fun backspace() {
        currentInputConnection?.deleteSurroundingText(1, 0)
        if (currentText.isNotEmpty()) currentText.deleteCharAt(currentText.length - 1)
        updateSuggestions()
    }

    private fun insertSpace() {
        currentInputConnection?.commitText(" ", 1)
        currentText.append(" ")
        updateSuggestions()
    }

    private fun sendReturn() {
        currentInputConnection?.commitText("\n", 1)
        currentText.clear()
        updateSuggestions()
    }

    private fun toggleShift() {
        isShift = !isShift
        buildKeyboard()
    }

    private fun toggleSymbols() {
        isSymbols = !isSymbols
        buildKeyboard()
    }

    private fun updateSuggestions() {
        suggestionsContainer.removeAllViews()
        val suggestions = suggestionEngine.getSuggestions(currentText.toString())

        suggestions.forEach { word ->
            val chip = TextView(this).apply {
                text = word
                textSize = 15f
                setBackgroundResource(R.drawable.suggestion_chip_bg)
                setTextColor(ContextCompat.getColor(context, R.color.suggestion_text))
                setPadding(24, 12, 24, 12)
                layoutParams = LinearLayout.LayoutParams(
                    ViewGroup.LayoutParams.WRAP_CONTENT,
                    ViewGroup.LayoutParams.WRAP_CONTENT
                ).apply { marginEnd = 12 }

                setOnClickListener {
                    insertSuggestion(word)
                }
            }
            suggestionsContainer.addView(chip)
        }
    }

    private fun insertSuggestion(word: String) {
        val text = currentText.toString()
        val lastSpace = text.lastIndexOf(" ")
        val toDelete = if (lastSpace == -1) text.length else text.length - lastSpace - 1

        repeat(toDelete) { currentInputConnection?.deleteSurroundingText(1, 0) }
        currentInputConnection?.commitText("$word ", 1)

        currentText.clear()
        if (lastSpace != -1) currentText.append(text.substring(0, lastSpace + 1))
        currentText.append("$word ")

        updateSuggestions()
    }

    private fun toggleGrammar() {
        val corrected = suggestionEngine.correctGrammar(currentText.toString())
        if (corrected != currentText.toString()) {
            currentInputConnection?.deleteSurroundingText(currentText.length, 0)
            currentInputConnection?.commitText(corrected, 1)
            currentText.clear()
            currentText.append(corrected)
            updateSuggestions()
        }
    }

    private fun toggleTone() {
        val enhanced = currentText.toString()
            .replace(".", "!")
            .replace("good", "amazing")
            .replace("bad", "unfortunate")
        currentInputConnection?.deleteSurroundingText(currentText.length, 0)
        currentInputConnection?.commitText(enhanced, 1)
        currentText.clear()
        currentText.append(enhanced)
    }

    private fun toggleEmoji() {
        val emojis = listOf("😀", "😂", "❤️", "👍", "🔥", "✨", "🎉", "💯")
        val emoji = emojis.random()
        currentInputConnection?.commitText(emoji, 1)
        currentText.append(emoji)
    }

    private fun insertEmoji() {
        toggleEmoji()
    }

    private fun translateText() {
        val translations = mapOf(
            "hello" to "مرحبا / bonjour / hola",
            "thanks" to "شكرا / merci / gracias",
            "goodbye" to "مع السلامة / au revoir / adiós"
        )
        val lower = currentText.toString().lowercase().trim()
        translations[lower]?.let { translation ->
            currentInputConnection?.commitText(" [$translation]", 1)
        }
    }

    private fun enhanceText() {
        val enhanced = suggestionEngine.enhanceWithAI(currentText.toString())
        currentInputConnection?.deleteSurroundingText(currentText.length, 0)
        currentInputConnection?.commitText(enhanced, 1)
        currentText.clear()
        currentText.append(enhanced)
        updateSuggestions()
    }
}

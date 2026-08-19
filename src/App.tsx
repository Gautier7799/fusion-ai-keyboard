import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Trash2, 
  Copy, 
  Check, 
  Layers, 
  Wand2,
  Globe, 
  Delete, 
  CornerDownLeft, 
  ArrowUp, 
  Smile,
  X,
  Palette,
  CheckCheck,
  Feather,
  Languages,
  BookOpen
} from 'lucide-react';

// --- Types & Data ---
type KeyboardTheme = 'ios-glass' | 'material-you' | 'hybrid-blur' | 'oled-pure' | 'tokyo-night';
type KeySoundType = 'ios-tick' | 'pixel-pop' | 'mechanical' | 'bubble' | 'silent';
type KeyboardLayout = 'arabic' | 'english' | 'symbols' | 'emojis';
type TextTransformAction = 'tashkeel' | 'rephrase-formal' | 'rephrase-friendly' | 'fix-grammar' | 'summarize' | 'translate-en' | 'poetry' | 'emoji-decorate';

interface AISuggestion {
  original: string;
  enhanced: string;
  tone?: string;
}

const ARABIC_LAYOUT = {
  row1: ['ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح', 'ج', 'د'],
  row2: ['ش', 'س', 'ي', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ك', 'ط'],
  row3: ['ئ', 'ء', 'ؤ', 'ر', 'لا', 'ى', 'ة', 'و', 'ز', 'ظ', 'ذ'],
};

const ARABIC_SHIFT_LAYOUT = {
  row1: ['َ', 'ً', 'ُ', 'ٌ', 'ِ', 'ٍ', 'ْ', 'ّ', 'إ', 'أ', 'آ', 'ـ'],
  row2: ['«', '»', '،', '؛', '؟', '!', '٪', ':', '؛', '"', "'"],
  row3: ['(', ')', '[', ']', '{', '}', '+', '=', '*', '/', '\\'],
};

const ENGLISH_LOWER_LAYOUT = {
  row1: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  row2: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  row3: ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
};

const ENGLISH_UPPER_LAYOUT = {
  row1: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  row2: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  row3: ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
};

const NUMBER_ROW = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const ARABIC_NUMBER_ROW = ['١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩', '٠'];

const SYMBOLS_PAGE_1 = {
  row1: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  row2: ['-', '/', ':', ';', '(', ')', '$', '&', '@', '"'],
  row3: ['.', ',', '?', '!', "'", '#', '%', '*', '+', '='],
};

const QUICK_EMOJIS = ['😊', '❤️', '🔥', '👍', '🙏', '✨', '🌹', '💡', '🚀', '😍', '👏', '🎉', '💯', '👌', '⭐', '🤝'];

const DIACRITICS_LIST = [
  { label: 'فتحة', char: 'َ' },
  { label: 'تنوين فتح', char: 'ً' },
  { label: 'ضمة', char: 'ُ' },
  { label: 'تنوين ضم', char: 'ٌ' },
  { label: 'كسرة', char: 'ِ' },
  { label: 'تنوين كسر', char: 'ٍ' },
  { label: 'سكون', char: 'ْ' },
  { label: 'شدّة', char: 'ّ' },
  { label: 'تطويل', char: 'ـ' },
];

const SAMPLE_TEXTS = [
  "السلام عليكم ورحمة الله وبركاته، اهلا وسهلا بك.",
  "هذا النص يحتاج الى تشكيل وتدقيق لغوي سريع.",
  "Meeting today at 4:00 PM regarding the project.",
  "شكرا جزيلا على المجهود الرائع والتصميم المبتكر.",
];

// --- Audio Helper ---
function playAudioTick(soundType: KeySoundType = 'ios-tick') {
  if (soundType === 'silent') return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;
    
    if (soundType === 'ios-tick') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.025);
    } else {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.035);
    }
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.03);
  } catch (e) {}
}

export function App() {
  const [text, setText] = useState<string>('مرحباً بك في لوحة المفاتيح الهجينة المتطورة! اضغط على أي زر لتجربة الكتابة أو استخدم أدوات الذكاء الاصطناعي للتشكيل والتدقيق.');
  
  // Settings State
  const [theme, setTheme] = useState<KeyboardTheme>('hybrid-blur');
  const [accentColor, setAccentColor] = useState<string>('#F59E0B');
  const [soundType, setSoundType] = useState<KeySoundType>('ios-tick');
  const [layout, setLayout] = useState<KeyboardLayout>('arabic');
  const [isShift, setIsShift] = useState<boolean>(false);
  const [keyBorderRadius, setKeyBorderRadius] = useState<number>(10);
  const [showNumberRow, setShowNumberRow] = useState<boolean>(true);

  // Predictions & History
  const [predictions, setPredictions] = useState<string[]>(['ورحمة الله', 'بإذن الله', 'تحياتي']);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [activeAiAction, setActiveAiAction] = useState<string | null>(null);
  const [aiHistory, setAiHistory] = useState<AISuggestion[]>([]);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!text.trim()) {
      setPredictions(['السلام عليكم', 'شكراً جزيلاً', 'صباح الخير']);
      return;
    }
    const lastWord = text.trim().split(/\s+/).pop() || '';
    if (lastWord.includes('السلام')) setPredictions(['عليكم', 'ورحمة الله', 'وبركاته']);
    else if (lastWord.includes('شكرا')) setPredictions(['جزيلا', 'لك', 'على اهتمامك']);
    else if (lastWord.includes('صباح')) setPredictions(['الخير', 'النور', 'الورد']);
    else setPredictions(['بإذن الله', 'ورحمة الله', 'تحياتي']);
  }, [text]);

  const handleKeyPress = (char: string) => {
    playAudioTick(soundType);
    setText((prev) => prev + char);
  };

  const handleBackspace = () => {
    playAudioTick(soundType);
    setText((prev) => prev.slice(0, -1));
  };

  const handleSpace = () => {
    playAudioTick(soundType);
    setText((prev) => prev + ' ');
  };

  const handleEnter = () => {
    playAudioTick(soundType);
    setText((prev) => prev + '\n');
  };

  const handleAiTransform = (action: TextTransformAction) => {
    if (!text.trim()) return;
    setIsLoadingAi(true);
    setActiveAiAction(action);

    setTimeout(() => {
      let enhanced = text;
      if (action === 'tashkeel') {
        enhanced = text
          .replace(/السلام عليكم/g, 'السَّلَامُ عَلَيْكُمْ')
          .replace(/ورحمة الله/g, 'وَرَحْمَةُ اللهِ')
          .replace(/شكرا/g, 'شُكْرًا')
          .replace(/مرحبا/g, 'مَرْحَبًا')
          .replace(/اليوم/g, 'اليَوْمَ');
      } else if (action === 'rephrase-formal') {
        enhanced = `نحيطكم علماً بالتالي: ${text}. وتفضلوا بقبول فائق الاحترام.`;
      } else if (action === 'rephrase-friendly') {
        enhanced = `أهلاً يا غالي! 😊 ${text} ✨ أتمنى لك يوماً سعيداً 🌸`;
      } else if (action === 'emoji-decorate') {
        enhanced = `✨ ${text} 🚀📱💡`;
      } else if (action === 'translate-en') {
        enhanced = "Hello! Processed through the Hybrid Fusion AI Keyboard.";
      }

      setAiHistory((prev) => [
        { original: text, enhanced, tone: action },
        ...prev.slice(0, 8),
      ]);
      setText(enhanced);
      setIsLoadingAi(false);
      setActiveAiAction(null);
    }, 500);
  };

  const handleCopyText = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isGlass = theme === 'ios-glass' || theme === 'hybrid-blur';

  const keyBaseClass = `relative flex items-center justify-center font-medium transition-all duration-100 select-none cursor-pointer active:scale-92 ${
    isGlass 
      ? 'bg-white/15 hover:bg-white/25 text-white backdrop-blur-md border border-white/10' 
      : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-100 border border-neutral-700/50'
  }`;

  const specialKeyClass = `relative flex items-center justify-center font-semibold transition-all duration-100 select-none cursor-pointer active:scale-92 ${
    isGlass 
      ? 'bg-neutral-900/50 hover:bg-neutral-900/70 text-neutral-300 backdrop-blur-md border border-white/10' 
      : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-700/40'
  }`;

  const keyRadiusStyle = { borderRadius: `${keyBorderRadius}px` };

  return (
    <div id="fusion-keyboard-app-root" className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between font-sans" dir="rtl">
      
      {/* 🌟 Header App Bar */}
      <header className="w-full border-b border-white/10 px-4 py-3 bg-neutral-900/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-purple-600 to-cyan-400 p-[1.5px] shadow-lg">
            <div className="w-full h-full bg-neutral-900 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              <span>Fusion AI Keyboard</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">iOS + Pixel</span>
            </h1>
            <p className="text-xs text-neutral-400">تجانس تصميم iOS وألوان Material You مع ذكاء Gemini</p>
          </div>
        </div>

        <button
          onClick={() => setIsThemeModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 border border-white/10"
        >
          <Layers className="w-4 h-4 text-amber-400" />
          <span>تخصيص الثيم</span>
        </button>
      </header>

      {/* 📱 Main Editor Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col gap-4">
        <div className="w-full bg-neutral-900/90 border border-white/10 rounded-2xl p-4 shadow-xl flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <span>عدد الحروف: <strong className="text-amber-400 font-mono">{text.length}</strong></span>
              <span>•</span>
              <span>عدد الكلمات: <strong className="text-cyan-400 font-mono">{text.trim() ? text.trim().split(/\s+/).length : 0}</strong></span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopyText}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 text-xs border border-white/10"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
              </button>
              <button
                onClick={() => setText('')}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 border border-white/10"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <textarea
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="اكتب هنا باستخدام لوحة المفاتيح التفاعلية بالأسفل..."
            className="w-full bg-transparent text-lg sm:text-xl text-white placeholder-neutral-500 focus:outline-none resize-none leading-relaxed"
          />

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-white/5">
            <span className="text-[11px] text-neutral-500 shrink-0 font-medium">جمل للتجربة:</span>
            {SAMPLE_TEXTS.map((sample, i) => (
              <button
                key={i}
                onClick={() => setText(sample)}
                className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-[11px] text-neutral-300 truncate max-w-[200px] border border-white/5"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>

        {/* AI Transformation Recent History */}
        {aiHistory.length > 0 && (
          <div className="w-full bg-neutral-900/60 border border-white/5 rounded-xl p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span className="flex items-center gap-1 font-semibold text-amber-300">
                <Wand2 className="w-3.5 h-3.5" />
                سجل تحسينات الذكاء الاصطناعي
              </span>
              <button onClick={() => setAiHistory([])} className="text-[10px] text-neutral-500">مسح</button>
            </div>
            <div className="flex flex-col gap-2 max-h-32 overflow-y-auto">
              {aiHistory.map((item, index) => (
                <div key={index} className="p-2 bg-black/40 rounded-lg border border-white/5 flex flex-col gap-1 text-xs">
                  <div className="text-emerald-300 font-medium">{item.enhanced}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ⌨️ Fixed Bottom Keyboard */}
      <footer className="w-full max-w-4xl mx-auto border-t border-white/10 shadow-2xl rounded-t-3xl overflow-hidden sticky bottom-0 z-40 bg-neutral-950">
        
        {/* Smart Toolbar */}
        <div className={`w-full flex flex-col border-b border-white/10 ${isGlass ? 'bg-neutral-900/60 backdrop-blur-xl' : 'bg-neutral-900'}`}>
          <div className="flex items-center justify-between px-2 py-1.5 gap-1.5 overflow-x-auto no-scrollbar border-b border-white/5">
            <div className="flex items-center gap-1.5 flex-1 overflow-x-auto no-scrollbar py-0.5">
              {isLoadingAi ? (
                <div className="flex items-center gap-2 px-3 py-1 text-xs text-amber-300 animate-pulse">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>جاري المعالجة بالذكاء الاصطناعي...</span>
                </div>
              ) : (
                predictions.map((pred, idx) => (
                  <button
                    key={idx}
                    onClick={() => setText((prev) => prev.trimEnd() ? `${prev.trimEnd()} ${pred} ` : `${pred} `)}
                    className="px-3 py-1 text-xs font-medium bg-white/10 hover:bg-white/20 active:scale-95 text-neutral-100 rounded-full border border-white/10 whitespace-nowrap"
                  >
                    "{pred}"
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-1.5 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1 px-2 py-1 bg-amber-500/20 border border-amber-500/30 rounded-lg text-[11px] font-bold text-amber-300 shrink-0">
              <Wand2 className="w-3.5 h-3.5 animate-bounce" />
              <span>Gemini AI</span>
            </div>

            {[
              { id: 'tashkeel', label: 'تشكيل تام', icon: Sparkles },
              { id: 'rephrase-formal', label: 'صياغة رسمية', icon: Feather },
              { id: 'rephrase-friendly', label: 'صياغة ودودة', icon: Smile },
              { id: 'translate-en', label: 'ترجمة إنجليزية', icon: Languages },
              { id: 'emoji-decorate', label: 'تزيين ذكي', icon: Smile },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => handleAiTransform(action.id as TextTransformAction)}
                  disabled={isLoadingAi || !text.trim()}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap border transition-all ${
                    activeAiAction === action.id && isLoadingAi
                      ? 'bg-amber-500 text-black border-amber-400'
                      : text.trim()
                      ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-white/10'
                      : 'bg-neutral-800/30 text-neutral-500 border-transparent opacity-60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Virtual Keyboard */}
        <div className={`w-full select-none pb-2 pt-1 ${isGlass ? 'bg-black/40 backdrop-blur-2xl' : 'bg-neutral-950'}`}>
          {/* Quick Diacritics row */}
          {layout === 'arabic' && (
            <div className="flex items-center justify-between px-2 py-1 gap-1 overflow-x-auto no-scrollbar border-b border-white/5 bg-white/5">
              {DIACRITICS_LIST.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleKeyPress(item.char)}
                  className="px-2.5 py-1 text-sm bg-white/10 hover:bg-amber-500/20 hover:text-amber-300 text-neutral-200 rounded-md border border-white/5"
                >
                  {item.char}
                </button>
              ))}
            </div>
          )}

          {/* Number Row */}
          {showNumberRow && layout !== 'symbols' && layout !== 'emojis' && (
            <div className="flex justify-center gap-1.5 px-2 py-1">
              {(layout === 'arabic' ? ARABIC_NUMBER_ROW : NUMBER_ROW).map((num, i) => (
                <button key={i} style={keyRadiusStyle} onClick={() => handleKeyPress(num)} className={`${keyBaseClass} flex-1 h-8 text-sm font-mono opacity-80`}>
                  {num}
                </button>
              ))}
            </div>
          )}

          {/* Keys Layout */}
          {layout === 'arabic' && (
            <div className="flex flex-col gap-2 p-1.5" dir="rtl">
              <div className="flex justify-center gap-1.5">
                {(isShift ? ARABIC_SHIFT_LAYOUT : ARABIC_LAYOUT).row1.map((char, i) => (
                  <button key={i} style={keyRadiusStyle} onClick={() => handleKeyPress(char)} className={`${keyBaseClass} flex-1 h-11 text-lg`}>{char}</button>
                ))}
              </div>
              <div className="flex justify-center gap-1.5 px-2">
                {(isShift ? ARABIC_SHIFT_LAYOUT : ARABIC_LAYOUT).row2.map((char, i) => (
                  <button key={i} style={keyRadiusStyle} onClick={() => handleKeyPress(char)} className={`${keyBaseClass} flex-1 h-11 text-lg`}>{char}</button>
                ))}
              </div>
              <div className="flex justify-center gap-1.5">
                <button style={keyRadiusStyle} onClick={() => setIsShift(!isShift)} className={`${specialKeyClass} w-11 h-11 shrink-0 ${isShift ? 'bg-amber-500/30 text-amber-300' : ''}`}>
                  <ArrowUp className={`w-5 h-5 ${isShift ? 'text-amber-400' : ''}`} />
                </button>
                {(isShift ? ARABIC_SHIFT_LAYOUT : ARABIC_LAYOUT).row3.map((char, i) => (
                  <button key={i} style={keyRadiusStyle} onClick={() => handleKeyPress(char)} className={`${keyBaseClass} flex-1 h-11 text-lg`}>{char}</button>
                ))}
                <button style={keyRadiusStyle} onClick={handleBackspace} className={`${specialKeyClass} w-11 h-11 shrink-0 text-red-300`}>
                  <Delete className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {layout === 'english' && (
            <div className="flex flex-col gap-2 p-1.5" dir="ltr">
              <div className="flex justify-center gap-1.5">
                {(isShift ? ENGLISH_UPPER_LAYOUT : ENGLISH_LOWER_LAYOUT).row1.map((char, i) => (
                  <button key={i} style={keyRadiusStyle} onClick={() => handleKeyPress(char)} className={`${keyBaseClass} flex-1 h-11 text-lg`}>{char}</button>
                ))}
              </div>
              <div className="flex justify-center gap-1.5 px-3">
                {(isShift ? ENGLISH_UPPER_LAYOUT : ENGLISH_LOWER_LAYOUT).row2.map((char, i) => (
                  <button key={i} style={keyRadiusStyle} onClick={() => handleKeyPress(char)} className={`${keyBaseClass} flex-1 h-11 text-lg`}>{char}</button>
                ))}
              </div>
              <div className="flex justify-center gap-1.5">
                <button style={keyRadiusStyle} onClick={() => setIsShift(!isShift)} className={`${specialKeyClass} w-12 h-11 shrink-0 ${isShift ? 'bg-amber-500/30 text-amber-300' : ''}`}>
                  <ArrowUp className={`w-5 h-5 ${isShift ? 'text-amber-400' : ''}`} />
                </button>
                {(isShift ? ENGLISH_UPPER_LAYOUT : ENGLISH_LOWER_LAYOUT).row3.map((char, i) => (
                  <button key={i} style={keyRadiusStyle} onClick={() => handleKeyPress(char)} className={`${keyBaseClass} flex-1 h-11 text-lg`}>{char}</button>
                ))}
                <button style={keyRadiusStyle} onClick={handleBackspace} className={`${specialKeyClass} w-12 h-11 shrink-0 text-red-300`}>
                  <Delete className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {layout === 'symbols' && (
            <div className="flex flex-col gap-2 p-1.5">
              <div className="flex justify-center gap-1.5">
                {SYMBOLS_PAGE_1.row1.map((char, i) => (
                  <button key={i} style={keyRadiusStyle} onClick={() => handleKeyPress(char)} className={`${keyBaseClass} flex-1 h-11 text-base font-mono`}>{char}</button>
                ))}
              </div>
              <div className="flex justify-center gap-1.5">
                {SYMBOLS_PAGE_1.row2.map((char, i) => (
                  <button key={i} style={keyRadiusStyle} onClick={() => handleKeyPress(char)} className={`${keyBaseClass} flex-1 h-11 text-base

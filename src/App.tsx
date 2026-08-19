import React, { useState, useEffect } from 'react';
import { 
  KeyboardSettings, 
  KeyboardLayout, 
  TextTransformAction, 
  AISuggestion 
} from './types/keyboard';
import { SmartToolbar } from './components/SmartToolbar';
import { VirtualKeyboard } from './components/VirtualKeyboard';
import { ThemeCustomizerModal } from './components/ThemeCustomizerModal';
import { 
  Sparkles, 
  Trash2, 
  Copy, 
  Check, 
  Layers, 
  Wand2 
} from 'lucide-react';
import { SAMPLE_TEXTS_FOR_TESTING } from './data/keyboardLayouts';

export function App() {
  const [text, setText] = useState<string>('مرحباً بك في لوحة المفاتيح الهجينة المتطورة! اضغط على أي زر لتجربة الكتابة أو استخدم أدوات Gemini AI للتشكيل والتدقيق.');
  
  const [settings, setSettings] = useState<KeyboardSettings>({
    theme: 'hybrid-blur',
    accentColor: '#F59E0B',
    hapticFeedback: true,
    soundEnabled: true,
    soundType: 'ios-tick',
    soundVolume: 0.6,
    autoTashkeel: false,
    showNumberRow: true,
    showPredictions: true,
    glassBlurOpacity: 70,
    keyElevation: 2,
    keyBorderRadius: 10,
    layout: 'arabic',
    isCapsLock: false,
    isShift: false,
  });

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

  const handleKeyPress = (char: string) => setText((prev) => prev + char);
  const handleBackspace = () => setText((prev) => prev.slice(0, -1));
  const handleSpace = () => setText((prev) => prev + ' ');
  const handleEnter = () => setText((prev) => prev + '\n');
  const handleToggleShift = () => setSettings((prev) => ({ ...prev, isShift: !prev.isShift }));
  const handleLayoutChange = (layout: KeyboardLayout) => setSettings((prev) => ({ ...prev, layout, isShift: false }));
  const handleQuickTashkeel = (char: string) => setText((prev) => prev + char);
  const handleSelectPrediction = (word: string) => {
    setText((prev) => {
      const trimmed = prev.trimEnd();
      return trimmed ? `${trimmed} ${word} ` : `${word} `;
    });
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
      }

      setAiHistory((prev) => [
        { original: text, enhanced, tone: action },
        ...prev.slice(0, 10),
      ]);
      setText(enhanced);
      setIsLoadingAi(false);
      setActiveAiAction(null);
    }, 600);
  };

  const handleCopyText = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isGlassTheme = settings.theme === 'ios-glass' || settings.theme === 'hybrid-blur';

  return (
    <div id="fusion-keyboard-app-root" className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between font-sans" dir="rtl">
      <header id="app-header" className="w-full border-b border-white/10 px-4 py-3 bg-neutral-900/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-30">
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
          id="nav-customize-theme-btn"
          onClick={() => setIsThemeModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 border border-white/10"
        >
          <Layers className="w-4 h-4 text-amber-400" />
          <span>تخصيص الثيم</span>
        </button>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col gap-4">
        <div id="text-editor-container" className="w-full bg-neutral-900/90 border border-white/10 rounded-2xl p-4 shadow-xl flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <span>عدد الحروف: <strong className="text-amber-400 font-mono">{text.length}</strong></span>
              <span>•</span>
              <span>عدد الكلمات: <strong className="text-cyan-400 font-mono">{text.trim() ? text.trim().split(/\s+/).length : 0}</strong></span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                id="copy-text-btn"
                onClick={handleCopyText}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 text-xs border border-white/10"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
              </button>
              <button
                id="clear-text-btn"
                onClick={() => setText('')}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 border border-white/10"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <textarea
            id="main-keyboard-input"
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="اكتب هنا باستخدام لوحة المفاتيح التفاعلية بالأسفل..."
            className="w-full bg-transparent text-lg sm:text-xl font-cairo text-white placeholder-neutral-500 focus:outline-none resize-none leading-relaxed"
          />

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-white/5">
            <span className="text-[11px] text-neutral-500 shrink-0 font-medium">جمل للتجربة:</span>
            {SAMPLE_TEXTS_FOR_TESTING.map((sample, i) => (
              <button
                key={i}
                id={`sample-text-pill-${i}`}
                onClick={() => setText(sample)}
                className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-[11px] text-neutral-300 truncate max-w-[200px] border border-white/5"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>

        {aiHistory.length > 0 && (
          <div className="w-full bg-neutral-900/60 border border-white/5 rounded-xl p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span className="flex items-center gap-1 font-semibold text-amber-300">
                <Wand2 className="w-3.5 h-3.5" />
                سجل تحسينات Gemini AI
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

      <footer id="app-bottom-keyboard-dock" className="w-full max-w-4xl mx-auto border-t border-white/10 shadow-2xl rounded-t-3xl overflow-hidden sticky bottom-0 z-40 bg-neutral-950">
        <SmartToolbar
          currentText={text}
          onTransform={handleAiTransform}
          predictions={predictions}
          onSelectPrediction={handleSelectPrediction}
          isLoadingAi={isLoadingAi}
          activeAiAction={activeAiAction}
          onOpenThemeModal={() => setIsThemeModalOpen(true)}
          accentColor={settings.accentColor}
          isGlass={isGlassTheme}
        />
        <VirtualKeyboard
          settings={settings}
          onKeyPress={handleKeyPress}
          onBackspace={handleBackspace}
          onEnter={handleEnter}
          onSpace={handleSpace}
          onLayoutChange={handleLayoutChange}
          onToggleShift={handleToggleShift}
          onQuickTashkeel={handleQuickTashkeel}
        />
      </footer>

      <ThemeCustomizerModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        settings={settings}
        onUpdateSettings={(newVals) => setSettings((prev) => ({ ...prev, ...newVals }))}
      />
    </div>
  );
}
export default App;

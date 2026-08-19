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
  Feather, 
  Languages 
} from 'lucide-react';

const ARABIC_KEYS = [
  ['ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح', 'ج', 'د'],
  ['ش', 'س', 'ي', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ك', 'ط'],
  ['ئ', 'ء', 'ؤ', 'ر', 'لا', 'ى', 'ة', 'و', 'ز', 'ظ', 'ذ']
];

const ENGLISH_KEYS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm']
];

const NUMBER_ROW = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const QUICK_EMOJIS = ['😊', '❤️', '🔥', '👍', '🙏', '✨', '🌹', '💡', '🚀', '😍', '👏', '🎉', '💯'];
const TASHKEEL_LIST = ['َ', 'ً', 'ُ', 'ٌ', 'ِ', 'ٍ', 'ْ', 'ّ', 'ـ'];

export function App() {
  const [text, setText] = useState('مرحباً بك في لوحة المفاتيح الهجينة المتطورة! اضغط على أي زر لتجربة الكتابة.');
  const [theme, setTheme] = useState<'hybrid' | 'glass' | 'oled'>('hybrid');
  const [accent, setAccent] = useState('#F59E0B');
  const [lang, setLang] = useState<'arabic' | 'english' | 'emojis'>('arabic');
  const [isShift, setIsShift] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [predictions, setPredictions] = useState(['ورحمة الله', 'بإذن الله', 'تحياتي']);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const word = text.trim().split(/\s+/).pop() || '';
    if (word.includes('السلام')) setPredictions(['عليكم', 'ورحمة الله', 'وبركاته']);
    else if (word.includes('شكرا')) setPredictions(['جزيلا', 'لك', 'جداً']);
    else if (word.includes('صباح')) setPredictions(['الخير', 'النور', 'الورد']);
    else setPredictions(['بإذن الله', 'ورحمة الله', 'تحياتي']);
  }, [text]);

  const playClick = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1000, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.025);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.025);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch (e) {}
  };

  const handleKey = (ch: string) => {
    playClick();
    setText((prev) => prev + ch);
  };

  const handleBackspace = () => {
    playClick();
    setText((prev) => prev.slice(0, -1));
  };

  const handleAiAction = (type: string) => {
    if (!text.trim()) return;
    setAiLoading(true);
    setTimeout(() => {
      let res = text;
      if (type === 'tashkeel') {
        res = text.replace(/السلام عليكم/g, 'السَّلَامُ عَلَيْكُمْ').replace(/شكرا/g, 'شُكْرًا').replace(/مرحبا/g, 'مَرْحَبًا');
      } else if (type === 'formal') {
        res = `نحيط سيادتكم علماً بأنه: ${text}. وتفضلوا بقبول فائق الاحترام.`;
      } else if (type === 'friendly') {
        res = `أهلاً يا غالي! 😊 ${text} ✨ أتمنى لك يوماً سعيداً 🌸`;
      } else if (type === 'emoji') {
        res = `✨ ${text} 🚀📱💡`;
      }
      setText(res);
      setAiLoading(false);
    }, 400);
  };

  const isGlass = theme === 'glass' || theme === 'hybrid';
  const keyClass = `flex-1 h-11 flex items-center justify-center font-semibold rounded-lg select-none active:scale-95 transition-all text-base ${
    isGlass 
      ? 'bg-white/15 hover:bg-white/25 text-white backdrop-blur-md border border-white/10' 
      : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-100 border border-neutral-700'
  }`;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between" dir="rtl">
      {/* Header */}
      <header className="w-full border-b border-white/10 px-4 py-3 bg-neutral-900/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Fusion AI Keyboard</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">iOS+Pixel</span>
            </h1>
            <p className="text-[11px] text-neutral-400">تجانس تصميم iOS وألوان Material You</p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold border border-white/10"
        >
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          <span>الثيم</span>
        </button>
      </header>

      {/* Text Area */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 flex flex-col gap-3">
        <div className="w-full bg-neutral-900/90 border border-white/10 rounded-2xl p-4 shadow-xl flex flex-col gap-2">
          <div className="flex items-center justify-between border-b border-white/5 pb-2 text-xs text-neutral-400">
            <span>الحروف: <strong className="text-amber-400">{text.length}</strong></span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
                className="flex items-center gap-1 px-2 py-1 rounded bg-white/5 text-neutral-200 hover:bg-white/10"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'تم' : 'نسخ'}</span>
              </button>
              <button onClick={() => setText('')} className="p-1 rounded bg-white/5 hover:bg-red-500/20 text-neutral-400 hover:text-red-400">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <textarea
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="اكتب هنا باستخدام لوحة المفاتيح بالأسفل..."
            className="w-full bg-transparent text-lg text-white placeholder-neutral-500 focus:outline-none resize-none"
          />
        </div>
      </main>

      {/* Keyboard Dock */}
      <footer className="w-full max-w-3xl mx-auto border-t border-white/10 bg-neutral-950 sticky bottom-0 z-40">
        {/* Predictions & AI Bar */}
        <div className={`p-2 flex flex-col gap-1.5 border-b border-white/10 ${isGlass ? 'bg-neutral-900/60 backdrop-blur-xl' : 'bg-neutral-900'}`}>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {predictions.map((p, i) => (
              <button
                key={i}
                onClick={() => setText((prev) => prev.trimEnd() ? `${prev.trimEnd()} ${p} ` : `${p} `)}
                className="px-2.5 py-0.5 text-xs bg-white/10 rounded-full text-neutral-200 border border-white/10 whitespace-nowrap"
              >
                "{p}"
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
            <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 rounded text-[11px] font-bold text-amber-300">
              <Wand2 className="w-3 h-3" />
              <span>Gemini AI</span>
            </div>
            {[
              { id: 'tashkeel', label: 'تشكيل تام', icon: Sparkles },
              { id: 'formal', label: 'صياغة رسمية', icon: Feather },
              { id: 'friendly', label: 'صياغة ودودة', icon: Smile },
              { id: 'emoji', label: 'تزيين ذكي', icon: Sparkles },
            ].map((act) => (
              <button
                key={act.id}
                onClick={() => handleAiAction(act.id)}
                disabled={aiLoading || !text.trim()}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-white/10 whitespace-nowrap disabled:opacity-50"
              >
                <act.icon className="w-3 h-3" />
                <span>{act.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Keyboard Keys */}
        <div className="p-1.5 flex flex-col gap-1.5">
          {/* Quick Tashkeel */}
          {lang === 'arabic' && (
            <div className="flex justify-between gap-1 overflow-x-auto no-scrollbar bg-white/5 p-1 rounded-md">
              {TASHKEEL_LIST.map((t, idx) => (
                <button key={idx} onClick={() => handleKey(t)} className="flex-1 py-1 text-sm bg-white/10 hover:bg-amber-500/20 text-neutral-200 rounded">
                  {t}
                </button>
              ))}
            </div>
          )}

          {/* Number Row */}
          <div className="flex justify-center gap-1">
            {NUMBER_ROW.map((n, i) => (
              <button key={i} onClick={() => handleKey(n)} className={`${keyClass} h-8 text-xs opacity-75`}>
                {n}
              </button>
            ))}
          </div>

          {/* Arabic Layout */}
          {lang === 'arabic' && ARABIC_KEYS.map((row, rIdx) => (
            <div key={rIdx} className="flex justify-center gap-1">
              {rIdx === 2 && (
                <button onClick={() => setIsShift(!isShift)} className={`${keyClass} max-w-[48px] ${isShift ? 'bg-amber-500/30 text-amber-300' : ''}`}>
                  <ArrowUp className="w-4 h-4" />
                </button>
              )}
              {row.map((k, kIdx) => (
                <button key={kIdx} onClick={() => handleKey(k)} className={keyClass}>
                  {k}
                </button>
              ))}
              {rIdx === 2 && (
                <button onClick={handleBackspace} className={`${keyClass} max-w-[48px] text-red-300`}>
                  <Delete className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}

          {/* English Layout */}
          {lang === 'english' && ENGLISH_KEYS.map((row, rIdx) => (
            <div key={rIdx} className="flex justify-center gap-1" dir="ltr">
              {rIdx === 2 && (
                <button onClick={() => setIsShift(!isShift)} className={`${keyClass} max-w-[48px] ${isShift ? 'bg-amber-500/30 text-amber-300' : ''}`}>
                  <ArrowUp className="w-4 h-4" />
                </button>
              )}
              {row.map((k, kIdx) => (
                <button key={kIdx} onClick={() => handleKey(isShift ? k.toUpperCase() : k)} className={keyClass}>
                  {isShift ? k.toUpperCase() : k}
                </button>
              ))}
              {rIdx === 2 && (
                <button onClick={handleBackspace} className={`${keyClass} max-w-[48px] text-red-300`}>
                  <Delete className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}

          {/* Emojis Layout */}
          {lang === 'emojis' && (
            <div className="grid grid-cols-7 gap-1.5 p-2 max-h-[140px] overflow-y-auto">
              {QUICK_EMOJIS.map((em, i) => (
                <button key={i} onClick={() => handleKey(em)} className={`${keyClass} text-xl`}>
                  {em}
                </button>
              ))}
            </div>
          )}

          {/* Spacebar & Action row */}
          <div className="flex items-center justify-between gap-1.5 mt-0.5">
            <button
              onClick={() => setLang(lang === 'emojis' ? 'arabic' : 'emojis')}
              className={`${keyClass} max-w-[48px]`}
            >
              <Smile className="w-4 h-4 text-amber-400" />
            </button>

            <button
              onClick={() => setLang(lang === 'arabic' ? 'english' : 'arabic')}
              className={`${keyClass} max-w-[64px] text-xs flex items-center gap-1`}
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lang === 'arabic' ? 'EN' : 'عربي'}</span>
            </button>

            <button
              onClick={() => { playClick(); setText((prev) => prev + ' '); }}
              className="flex-1 h-11 relative flex items-center justify-center bg-white/20 hover:bg-white/25 active:scale-95 text-white backdrop-blur-md rounded-lg border border-white/10 text-xs"
            >
              <span>{lang === 'arabic' ? 'مسافة' : 'space'}</span>
              <div className="absolute bottom-1 w-12 h-1 rounded-full opacity-70" style={{ backgroundColor: accent }} />
            </button>

            <button
              onClick={() => { playClick(); setText((prev) => prev + '\n'); }}
              style={{ backgroundColor: accent }}
              className="px-4 h-11 rounded-lg flex items-center justify-center text-black font-bold active:scale-95 transition-all"
            >
              <CornerDownLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </footer>

      {/* Theme Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md" onClick={() => setIsModalOpen(false)}>
          <div className="w-full max-w-sm bg-neutral-900 border border-white/10 rounded-2xl p-4 flex flex-col gap-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Palette className="w-4 h-4 text-amber-400" />
                <span>تخصيص الثيم والألوان</span>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-neutral-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-neutral-400">نمط التصميم:</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'hybrid', label: 'هجين Hybrid' },
                  { id: 'glass', label: 'زجاج iOS' },
                  { id: 'oled', label: 'سواد OLED' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id as any)}
                    className={`py-2 rounded-lg text-xs font-semibold border ${theme === t.id ? 'border-amber-400 bg-amber-500/10 text-amber-300' : 'border-white/10 bg-neutral-800'}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-neutral-400">لون Material You المميز:</label>
              <div className="flex items-center gap-2">
                {['#F59E0B', '#38BDF8', '#34D399', '#A855F7', '#F43F5E'].map((col) => (
                  <button
                    key={col}
                    onClick={() => setAccent(col)}
                    style={{ backgroundColor: col }}
                    className={`w-8 h-8 rounded-full border-2 ${accent === col ? 'border-white scale-110' : 'border-transparent'}`}
                  />
                ))}
              </div>
            </div>

            <button onClick={() => setIsModalOpen(false)} className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl mt-2">
              حفظ الإعدادات
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default App;

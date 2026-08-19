import React from 'react';
import { KeyboardTheme, KeyboardSettings, KeySoundType } from '../types/keyboard';
import { X, Volume2, Vibrate, Palette, Check } from 'lucide-react';
import { playKeyClickSound } from '../utils/keyboardAudio';

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: KeyboardSettings;
  onUpdateSettings: (newSettings: Partial<KeyboardSettings>) => void;
}

export const ThemeCustomizerModal: React.FC<ThemeModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const themes: { id: KeyboardTheme; name: string; desc: string }[] = [
    { id: 'hybrid-blur', name: 'Hybrid iOS + Android', desc: 'أزرار زجاجية iOS مع ألوان Material You' },
    { id: 'ios-glass', name: 'iOS Frosted Glass', desc: 'زجاج شفاف ناعم مستوحى من نظام iOS' },
    { id: 'material-you', name: 'Android Material You', desc: 'ألوان ديناميكية بحواف مستديرة كأجهزة Pixel' },
    { id: 'oled-pure', name: 'OLED Pure Black', desc: 'سواد عميق موفر لبطارية الهاتف' },
    { id: 'tokyo-night', name: 'Tokyo Night Neon', desc: 'تدرجات نيون عصرية بين البنفسجي والأزرق' },
  ];

  const soundOptions: { id: KeySoundType; label: string }[] = [
    { id: 'ios-tick', label: 'نقرات iOS الكلاسيكية' },
    { id: 'pixel-pop', label: 'فقاعات Pixel Pop' },
    { id: 'mechanical', label: 'كيبورد ميكانيكي' },
    { id: 'bubble', label: 'قطرات ماء Bubble' },
    { id: 'silent', label: 'صامت Silent' },
  ];

  const accentPalette = ['#F59E0B', '#38BDF8', '#34D399', '#A855F7', '#F43F5E', '#FB923C', '#E2E8F0', '#E0E576'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md" onClick={onClose}>
      <div className="w-full max-w-lg max-h-[85vh] bg-neutral-900 border border-white/10 rounded-2xl p-5 overflow-y-auto flex flex-col gap-4 text-neutral-100 shadow-2xl" onClick={(e) => e.stopPropagation()} dir="rtl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold">تخصيص لوحة المفاتيح</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-neutral-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-neutral-300">مظهر وثيم اللوحة:</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => onUpdateSettings({ theme: t.id })}
                className={`p-2.5 rounded-xl border text-right transition-all flex flex-col gap-0.5 ${
                  settings.theme === t.id ? 'border-amber-400 bg-amber-500/10' : 'border-white/10 bg-neutral-800/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white">{t.name}</span>
                  {settings.theme === t.id && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </div>
                <p className="text-[11px] text-neutral-400">{t.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-neutral-300">لون التمييز (Material Accent):</label>
          <div className="flex items-center gap-2 flex-wrap">
            {accentPalette.map((color) => (
              <button
                key={color}
                onClick={() => onUpdateSettings({ accentColor: color })}
                style={{ backgroundColor: color }}
                className={`w-8 h-8 rounded-full transition-all flex items-center justify-center border-2 ${
                  settings.accentColor === color ? 'border-white scale-110' : 'border-transparent'
                }`}
              >
                {settings.accentColor === color && <Check className="w-4 h-4 text-black" />}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-300">صوت نقر المفاتيح:</span>
            <button
              onClick={() => playKeyClickSound(settings.soundType, settings.soundVolume)}
              className="text-xs px-2 py-0.5 bg-white/10 rounded-md text-cyan-300"
            >
              تجربة 🔊
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {soundOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  onUpdateSettings({ soundType: opt.id });
                  playKeyClickSound(opt.id, settings.soundVolume);
                }}
                className={`p-2 rounded-lg border text-xs text-right ${
                  settings.soundType === opt.id ? 'bg-cyan-500/20 border-cyan-400 text-white' : 'bg-neutral-800/60 border-white/5 text-neutral-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between bg-neutral-800/40 p-2 rounded-lg border border-white/5">
            <span className="text-xs font-medium">الاهتزاز اللمسي (Haptic Feedback)</span>
            <input 
              type="checkbox" 
              checked={settings.hapticFeedback} 
              onChange={(e) => onUpdateSettings({ hapticFeedback: e.target.checked })} 
              className="w-4 h-4 accent-amber-400"
            />
          </div>
        </div>

        <button onClick={onClose} className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm shadow-lg mt-2">
          تطبيق وحفظ
        </button>
      </div>
    </div>
  );
};

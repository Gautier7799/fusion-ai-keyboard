import React, { useState } from 'react';
import { KeyboardLayout, KeyboardSettings } from '../types/keyboard';
import { 
  ARABIC_LAYOUT, 
  ARABIC_SHIFT_LAYOUT, 
  ENGLISH_LOWER_LAYOUT, 
  ENGLISH_UPPER_LAYOUT, 
  NUMBER_ROW, 
  ARABIC_NUMBER_ROW, 
  SYMBOLS_PAGE_1, 
  SYMBOLS_PAGE_2, 
  QUICK_EMOJIS, 
  DIACRITICS_QUICK_LIST 
} from '../data/keyboardLayouts';
import { playKeyClickSound, triggerHaptic } from '../utils/keyboardAudio';
import { Globe, Delete, CornerDownLeft, ArrowUp, Smile } from 'lucide-react';

interface VirtualKeyboardProps {
  settings: KeyboardSettings;
  onKeyPress: (char: string) => void;
  onBackspace: () => void;
  onEnter: () => void;
  onSpace: () => void;
  onLayoutChange: (layout: KeyboardLayout) => void;
  onToggleShift: () => void;
  onQuickTashkeel: (char: string) => void;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  settings,
  onKeyPress,
  onBackspace,
  onEnter,
  onSpace,
  onLayoutChange,
  onToggleShift,
  onQuickTashkeel,
}) => {
  const [symbolsPage, setSymbolsPage] = useState<1 | 2>(1);

  const handleKeyTouch = (char: string) => {
    playKeyClickSound(settings.soundType, settings.soundVolume);
    triggerHaptic(settings.hapticFeedback, 12);
    onKeyPress(char);
  };

  const handleBackspaceTouch = () => {
    playKeyClickSound(settings.soundType, settings.soundVolume);
    triggerHaptic(settings.hapticFeedback, 18);
    onBackspace();
  };

  const handleSpaceTouch = () => {
    playKeyClickSound(settings.soundType, settings.soundVolume);
    triggerHaptic(settings.hapticFeedback, 15);
    onSpace();
  };

  const handleEnterTouch = () => {
    playKeyClickSound(settings.soundType, settings.soundVolume);
    triggerHaptic(settings.hapticFeedback, 20);
    onEnter();
  };

  const isGlass = settings.theme === 'ios-glass' || settings.theme === 'hybrid-blur';
  
  const keyBaseClass = `relative flex items-center justify-center font-medium transition-all duration-100 select-none cursor-pointer active:scale-92 ${
    isGlass 
      ? 'bg-white/15 hover:bg-white/25 active:bg-white/35 text-white backdrop-blur-md border border-white/10' 
      : 'bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 text-neutral-100 border border-neutral-700/50'
  }`;

  const specialKeyClass = `relative flex items-center justify-center font-semibold transition-all duration-100 select-none cursor-pointer active:scale-92 ${
    isGlass 
      ? 'bg-neutral-900/50 hover:bg-neutral-900/70 text-neutral-300 backdrop-blur-md border border-white/10' 
      : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-700/40'
  }`;

  const keyRadiusStyle = { borderRadius: `${settings.keyBorderRadius}px` };

  const renderLayoutRows = () => {
    if (settings.layout === 'arabic') {
      const rows = settings.isShift ? ARABIC_SHIFT_LAYOUT : ARABIC_LAYOUT;
      return (
        <div className="flex flex-col gap-2 p-1.5" dir="rtl">
          <div className="flex justify-center gap-1.5">
            {rows.row1.map((char, i) => (
              <button key={i} style={keyRadiusStyle} onClick={() => handleKeyTouch(char)} className={`${keyBaseClass} flex-1 h-11 text-lg font-cairo`}>
                {char}
              </button>
            ))}
          </div>
          <div className="flex justify-center gap-1.5 px-2">
            {rows.row2.map((char, i) => (
              <button key={i} style={keyRadiusStyle} onClick={() => handleKeyTouch(char)} className={`${keyBaseClass} flex-1 h-11 text-lg font-cairo`}>
                {char}
              </button>
            ))}
          </div>
          <div className="flex justify-center gap-1.5">
            <button style={keyRadiusStyle} onClick={onToggleShift} className={`${specialKeyClass} w-11 h-11 shrink-0 ${settings.isShift ? 'bg-amber-500/30 text-amber-300' : ''}`}>
              <ArrowUp className={`w-5 h-5 ${settings.isShift ? 'text-amber-400' : ''}`} />
            </button>
            {rows.row3.map((char, i) => (
              <button key={i} style={keyRadiusStyle} onClick={() => handleKeyTouch(char)} className={`${keyBaseClass} flex-1 h-11 text-lg font-cairo`}>
                {char}
              </button>
            ))}
            <button style={keyRadiusStyle} onClick={handleBackspaceTouch} className={`${specialKeyClass} w-11 h-11 shrink-0 text-red-300`}>
              <Delete className="w-5 h-5" />
            </button>
          </div>
        </div>
      );
    }

    if (settings.layout === 'english') {
      const rows = settings.isShift ? ENGLISH_UPPER_LAYOUT : ENGLISH_LOWER_LAYOUT;
      return (
        <div className="flex flex-col gap-2 p-1.5" dir="ltr">
          <div className="flex justify-center gap-1.5">
            {rows.row1.map((char, i) => (
              <button key={i} style={keyRadiusStyle} onClick={() => handleKeyTouch(char)} className={`${keyBaseClass} flex-1 h-11 text-lg`}>
                {char}
              </button>
            ))}
          </div>
          <div className="flex justify-center gap-1.5 px-3">
            {rows.row2.map((char, i) => (
              <button key={i} style={keyRadiusStyle} onClick={() => handleKeyTouch(char)} className={`${keyBaseClass} flex-1 h-11 text-lg`}>
                {char}
              </button>
            ))}
          </div>
          <div className="flex justify-center gap-1.5">
            <button style={keyRadiusStyle} onClick={onToggleShift} className={`${specialKeyClass} w-12 h-11 shrink-0 ${settings.isShift ? 'bg-amber-500/30 text-amber-300' : ''}`}>
              <ArrowUp className={`w-5 h-5 ${settings.isShift ? 'text-amber-400' : ''}`} />
            </button>
            {rows.row3.map((char, i) => (
              <button key={i} style={keyRadiusStyle} onClick={() => handleKeyTouch(char)} className={`${keyBaseClass} flex-1 h-11 text-lg`}>
                {char}
              </button>
            ))}
            <button style={keyRadiusStyle} onClick={handleBackspaceTouch} className={`${specialKeyClass} w-12 h-11 shrink-0 text-red-300`}>
              <Delete className="w-5 h-5" />
            </button>
          </div>
        </div>
      );
    }

    if (settings.layout === 'symbols') {
      const page = symbolsPage === 1 ? SYMBOLS_PAGE_1 : SYMBOLS_PAGE_2;
      return (
        <div className="flex flex-col gap-2 p-1.5">
          <div className="flex justify-center gap-1.5">
            {page.row1.map((char, i) => (
              <button key={i} style={keyRadiusStyle} onClick={() => handleKeyTouch(char)} className={`${keyBaseClass} flex-1 h-11 text-base font-mono`}>
                {char}
              </button>
            ))}
          </div>
          <div className="flex justify-center gap-1.5">
            {page.row2.map((char, i) => (
              <button key={i} style={keyRadiusStyle} onClick={() => handleKeyTouch(char)} className={`${keyBaseClass} flex-1 h-11 text-base font-mono`}>
                {char}
              </button>
            ))}
          </div>
          <div className="flex justify-center gap-1.5">
            <button style={keyRadiusStyle} onClick={() => setSymbolsPage(symbolsPage === 1 ? 2 : 1)} className={`${specialKeyClass} w-14 h-11 text-xs`}>
              {symbolsPage === 1 ? '1/2' : '2/2'}
            </button>
            {page.row3.map((char, i) => (
              <button key={i} style={keyRadiusStyle} onClick={() => handleKeyTouch(char)} className={`${keyBaseClass} flex-1 h-11 text-base font-mono`}>
                {char}
              </button>
            ))}
            <button style={keyRadiusStyle} onClick={handleBackspaceTouch} className={`${specialKeyClass} w-12 h-11 text-red-300`}>
              <Delete className="w-5 h-5" />
            </button>
          </div>
        </div>
      );
    }

    if (settings.layout === 'emojis') {
      return (
        <div className="flex flex-col gap-2 p-2 max-h-[160px] overflow-y-auto">
          <div className="grid grid-cols-8 gap-2">
            {QUICK_EMOJIS.map((emoji, i) => (
              <button key={i} style={keyRadiusStyle} onClick={() => handleKeyTouch(emoji)} className={`${keyBaseClass} h-11 text-xl`}>
                {emoji}
              </button>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`w-full select-none pb-2 pt-1 ${isGlass ? 'bg-black/40 backdrop-blur-2xl' : 'bg-neutral-950'}`}>
      {settings.layout === 'arabic' && (
        <div className="flex items-center justify-between px-2 py-1 gap-1 overflow-x-auto no-scrollbar border-b border-white/5 bg-white/5">
          {DIACRITICS_QUICK_LIST.map((item, idx) => (
            <button
              key={idx}
              onClick={() => onQuickTashkeel(item.char)}
              className="px-2.5 py-1 text-sm font-cairo bg-white/10 hover:bg-amber-500/20 hover:text-amber-300 text-neutral-200 rounded-md border border-white/5"
            >
              {item.char}
            </button>
          ))}
        </div>
      )}

      {settings.showNumberRow && settings.layout !== 'symbols' && settings.layout !== 'emojis' && (
        <div className="flex justify-center gap-1.5 px-2 py-1">
          {(settings.layout === 'arabic' ? ARABIC_NUMBER_ROW : NUMBER_ROW).map((num, i) => (
            <button key={i} style={keyRadiusStyle} onClick={() => handleKeyTouch(num)} className={`${keyBaseClass} flex-1 h-8 text-sm font-mono opacity-80`}>
              {num}
            </button>
          ))}
        </div>
      )}

      {renderLayoutRows()}

      <div className="flex items-center justify-between gap-1.5 px-2 mt-1">
        <button
          style={keyRadiusStyle}
          onClick={() => {
            playKeyClickSound(settings.soundType, settings.soundVolume);
            onLayoutChange(settings.layout === 'symbols' ? 'arabic' : 'symbols');
          }}
          className={`${specialKeyClass} px-3 h-11 text-xs font-bold`}
        >
          {settings.layout === 'symbols' ? 'أب / ABC' : '?123'}
        </button>

        <button
          style={keyRadiusStyle}
          onClick={() => {
            playKeyClickSound(settings.soundType, settings.soundVolume);
            onLayoutChange(settings.layout === 'emojis' ? 'arabic' : 'emojis');
          }}
          className={`${specialKeyClass} w-11 h-11`}
        >
          <Smile className="w-5 h-5 text-amber-400" />
        </button>

        <button
          style={keyRadiusStyle}
          onClick={() => {
            playKeyClickSound(settings.soundType, settings.soundVolume);
            onLayoutChange(settings.layout === 'arabic' ? 'english' : 'arabic');
          }}
          className={`${specialKeyClass} px-3 h-11 flex items-center gap-1 text-xs`}
        >
          <Globe className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold">{settings.layout === 'arabic' ? 'EN' : 'عربي'}</span>
        </button>

        <button
          style={keyRadiusStyle}
          onClick={handleSpaceTouch}
          className={`flex-1 h-11 relative flex items-center justify-center font-medium active:scale-95 transition-all ${
            isGlass ? 'bg-white/20 text-white backdrop-blur-md border border-white/15' : 'bg-neutral-800 text-neutral-100 border border-neutral-700/50'
          }`}
        >
          <span className="text-xs text-neutral-400 tracking-wider">
            {settings.layout === 'arabic' ? 'مسافة' : 'space'}
          </span>
          <div className="absolute bottom-1 w-12 h-1 rounded-full opacity-70" style={{ backgroundColor: settings.accentColor }} />
        </button>

        <button
          style={{ ...keyRadiusStyle, backgroundColor: settings.accentColor }}
          onClick={handleEnterTouch}
          className="px-4 h-11 flex items-center justify-center text-black font-bold shadow-lg hover:brightness-110 active:scale-90 transition-all shrink-0"
        >
          <CornerDownLeft className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

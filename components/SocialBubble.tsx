import React, { useEffect, useState } from 'react';
import { SocialBubble as SocialBubbleType } from '../types';

interface Props {
  bubble: SocialBubbleType | null;
  onClose: () => void;
}

export const SocialBubbleDisplay: React.FC<Props> = ({ bubble, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (bubble) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 500); // Wait for animation to finish
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [bubble, onClose]);

  if (!bubble) return null;

  return (
    <div 
      className={`fixed bottom-24 right-4 left-4 md:left-auto md:w-80 z-50 transition-all duration-500 transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}
    >
      <div className="bg-slate-800 border border-slate-700 p-3 rounded-xl shadow-2xl flex items-start space-x-3">
        <img src={bubble.avatarUrl} alt={bubble.name} className="w-10 h-10 rounded-full border-2 border-emerald-500" />
        <div className="flex-1">
            <div className="flex justify-between items-center">
                <p className="text-xs font-bold text-emerald-400">{bubble.name}</p>
                <span className="text-[10px] text-slate-500">{bubble.timestampRelative}</span>
            </div>
          <p className="text-sm text-slate-200 mt-1">{bubble.text}</p>
          <p className="text-[9px] text-slate-500 mt-2 italic">Resultados variam. Não garantido.</p>
        </div>
      </div>
    </div>
  );
};
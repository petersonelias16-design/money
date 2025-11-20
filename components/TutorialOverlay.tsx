
import React, { useState } from 'react';
import { ChevronRight, X, Target, PlusCircle, LayoutDashboard, Check } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

const STEPS = [
  {
    title: "Bem-vindo ao Money Booster!",
    content: "Vamos transformar sua vida financeira em poucos minutos. Vou te mostrar como o app funciona.",
    icon: <LayoutDashboard className="w-12 h-12 text-primary-500" />
  },
  {
    title: "Registre seus Gastos",
    content: "Use o botão '+' no menu para adicionar despesas. Ganhe XP e Conquistas a cada registro!",
    icon: <PlusCircle className="w-12 h-12 text-emerald-500" />
  },
  {
    title: "Defina Metas",
    content: "Vá em Configurações para definir limites de gastos. O app te avisará se você ficar no 'Vermelho'.",
    icon: <Target className="w-12 h-12 text-red-500" />
  },
  {
    title: "Tudo pronto!",
    content: "Agora é com você. Mantenha a constância e veja seu dinheiro render mais.",
    icon: <Check className="w-12 h-12 text-yellow-400" />
  }
];

export const TutorialOverlay: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const currentStep = STEPS[step];

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
      <div className="bg-dark-card border border-white/10 rounded-2xl p-8 max-w-sm w-full shadow-2xl relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-primary-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <button 
          onClick={onComplete} 
          className="absolute top-4 right-4 text-dark-muted hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="mb-6 p-4 bg-white/5 rounded-full border border-white/5">
            {currentStep.icon}
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-3">{currentStep.title}</h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-8 min-h-[60px]">
            {currentStep.content}
          </p>

          <div className="flex gap-2 w-full">
            <div className="flex gap-1 items-center justify-center flex-1 mr-4">
                {STEPS.map((_, idx) => (
                    <div 
                        key={idx} 
                        className={`h-1.5 rounded-full transition-all ${idx === step ? 'w-6 bg-primary-500' : 'w-1.5 bg-white/10'}`} 
                    />
                ))}
            </div>
            
            <button
              onClick={handleNext}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all"
            >
              {step === STEPS.length - 1 ? 'Começar' : 'Próximo'} <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

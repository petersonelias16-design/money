import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEED_QUIZ_QUESTIONS, SEED_SOCIAL_BUBBLES } from '../constants';
import { SocialBubbleDisplay } from '../components/SocialBubble';
import { SocialBubble, User } from '../types';
import { mockBackend } from '../services/mockBackend';
import { ChevronRight, Star } from 'lucide-react';

export const Onboarding: React.FC<{ onUpdateUser: (u: User) => void }> = ({ onUpdateUser }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [activeBubble, setActiveBubble] = useState<SocialBubble | null>(null);
  const [showXP, setShowXP] = useState(false);
  const navigate = useNavigate();

  const question = SEED_QUIZ_QUESTIONS[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / SEED_QUIZ_QUESTIONS.length) * 100;

  // Social Proof Logic
  useEffect(() => {
    const shouldShowBubble = (currentQuestionIndex + 1) % 2 === 0 && currentQuestionIndex > 0;
    if (shouldShowBubble) {
      // Pick a random bubble based on index to keep it consistent or random
      const bubbleIndex = (currentQuestionIndex / 2 - 1) % SEED_SOCIAL_BUBBLES.length;
      setActiveBubble(SEED_SOCIAL_BUBBLES[bubbleIndex]);
    }
  }, [currentQuestionIndex]);

  const handleAnswer = async (option: string) => {
    setAnswers({ ...answers, [question.id]: option });
    
    // Show Micro Win
    setShowXP(true);
    setTimeout(() => setShowXP(false), 800);

    if (currentQuestionIndex < SEED_QUIZ_QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQuestionIndex(prev => prev + 1), 400);
    } else {
      // Finish
      const updatedUser = await mockBackend.completeOnboarding(100); // 100 XP bonus
      onUpdateUser(updatedUser);
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col relative overflow-hidden">
      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-2">
        <div 
          className="bg-emerald-500 h-2 transition-all duration-500" 
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col justify-center p-6 max-w-lg mx-auto w-full z-10">
        <div className="mb-8">
          <span className="text-emerald-400 text-sm font-bold uppercase tracking-wider">
            Pergunta {currentQuestionIndex + 1} de {SEED_QUIZ_QUESTIONS.length}
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-white mt-2 leading-tight">
            {question.text}
          </h1>
        </div>

        <div className="space-y-3">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(option)}
              className="w-full text-left p-4 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 hover:border-emerald-500 hover:bg-slate-750 transition-all group flex items-center justify-between"
            >
              <span>{option}</span>
              <ChevronRight className="opacity-0 group-hover:opacity-100 text-emerald-500 transition-opacity" />
            </button>
          ))}
        </div>
      </div>

      {/* XP Pop */}
      {showXP && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 animate-slide-in">
          <div className="bg-emerald-500 text-white px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2">
            <Star className="fill-yellow-400 text-yellow-400" /> +10 XP
          </div>
        </div>
      )}

      <SocialBubbleDisplay bubble={activeBubble} onClose={() => setActiveBubble(null)} />
      
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/10 rounded-full filter blur-3xl translate-y-1/2 -translate-x-1/2"></div>
    </div>
  );
};
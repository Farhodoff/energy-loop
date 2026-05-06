import React from 'react';

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlocked: boolean;
}

interface AchievementsModalProps {
    onClose: () => void;
    achievements: Achievement[];
}

const AchievementsModal: React.FC<AchievementsModalProps> = ({ onClose, achievements }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#1a1a1a] border border-white/10 p-6 rounded-2xl w-full max-w-md shadow-2xl relative">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-light tracking-widest text-amber-200 uppercase">Yutuqlar</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        ✕
                    </button>
                </div>

                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    {achievements.map((ach) => (
                        <div 
                            key={ach.id} 
                            className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                                ach.unlocked 
                                ? 'bg-amber-500/10 border-amber-500/30' 
                                : 'bg-white/5 border-white/5 opacity-50'
                            }`}
                        >
                            <div className={`text-3xl ${ach.unlocked ? 'grayscale-0' : 'grayscale'}`}>
                                {ach.icon}
                            </div>
                            <div>
                                <div className={`font-bold ${ach.unlocked ? 'text-amber-200' : 'text-gray-400'}`}>
                                    {ach.title}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {ach.description}
                                </div>
                            </div>
                            {ach.unlocked && (
                                <div className="ml-auto text-amber-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-6 text-center text-[10px] text-gray-600 uppercase tracking-widest">
                    O'ynashda davom eting va barcha yutuqlarni oching!
                </div>
            </div>
        </div>
    );
};

export default AchievementsModal;

import React from 'react';

interface ShopModalProps {
    onClose: () => void;
    onWatchAd: () => void;
    coins: number;
}

const ShopModal: React.FC<ShopModalProps> = ({ onClose, onWatchAd, coins }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#1a1a1a] border border-white/10 p-6 rounded-2xl w-full max-w-md shadow-2xl relative">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-light tracking-widest text-teal-100 uppercase">Energy Store</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        ✕
                    </button>
                </div>

                {/* Balance */}
                <div className="bg-white/5 rounded-xl p-4 mb-6 flex items-center justify-between">
                    <span className="text-sm text-gray-400 uppercase tracking-widest">Current Balance</span>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-amber-400">{coins}</span>
                        <span className="text-xs text-amber-500/80">COINS</span>
                    </div>
                </div>

                {/* Items */}
                <div className="space-y-3">
                    {/* Free / Ad Item */}
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-teal-900/40 to-transparent border border-teal-500/20 hover:border-teal-500/50 transition-all group cursor-pointer" onClick={onWatchAd}>
                        <div>
                            <div className="font-bold text-teal-200 group-hover:text-teal-100 flex items-center gap-2">
                                +3 Free Coins <span className="text-[10px] bg-red-500 text-white px-1 rounded animate-pulse">HOT</span>
                            </div>
                            <div className="text-xs text-teal-400/60">Watch a short video</div>
                        </div>
                        <div className="px-3 py-1 bg-teal-500/20 text-teal-300 rounded text-xs uppercase tracking-wider font-bold">
                            FREE
                        </div>
                    </div>

                    {/* Paid Items (Mock) */}
                    <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-not-allowed opacity-70">
                        <div>
                            <div className="font-bold text-gray-200">Small Energy Pack</div>
                            <div className="text-xs text-gray-500">10 Hints</div>
                        </div>
                        <div className="text-gray-400 text-sm">$0.99</div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-not-allowed opacity-70">
                        <div>
                            <div className="font-bold text-amber-200">Remove Ads</div>
                            <div className="text-xs text-gray-500">Lifetime access</div>
                        </div>
                        <div className="text-amber-400 text-sm">$2.99</div>
                    </div>
                </div>

                <div className="mt-6 text-center text-[10px] text-gray-600 uppercase tracking-widest">
                    Secure Payment Processing
                </div>
            </div>
        </div>
    );
};

export default ShopModal;

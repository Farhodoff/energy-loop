import React, { useState, useEffect, useMemo } from 'react';
import Tile from './Tile';
import ShopModal from './ShopModal';
import AchievementsModal, { Achievement } from './AchievementsModal';
import type { GridMatrix, Point } from '../logic/types';
import { playClickSound, playWinSound } from '../logic/audio';
import { calculatePower } from '../logic/flow';
import { getEffectiveShape } from '../logic/grid';

// API Configuration
const API_URL = '/api';

const INITIAL_ACHIEVEMENTS: Achievement[] = [
    { id: 'first_light', title: 'Birinchi Nur', description: 'Birinchi marta jumboqni yechdingiz!', icon: '🌟', unlocked: false },
    { id: 'zen_master', title: 'Zen Ustasi', description: 'Daily Zen jumboqni yechdingiz!', icon: '🧘', unlocked: false },
    { id: 'economist', title: 'Tejamkor', description: 'Yordamsiz (Hint) jumboqni yechdingiz!', icon: '💎', unlocked: false },
    { id: 'professional', title: 'Professional', description: '10 ta jumboqni muvaffaqiyatli yechdingiz!', icon: '🏆', unlocked: false },
    { id: 'rich', title: 'Boyvachcha', description: '100 ta tanga yig\'dingiz!', icon: '💰', unlocked: false },
];

const Grid: React.FC = () => {
    const [grid, setGrid] = useState<GridMatrix>([]);
    const [isWon, setIsWon] = useState(false);
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<'random' | 'daily'>('daily');

    // Stats & Achievements
    const [achievements, setAchievements] = useState<Achievement[]>(() => {
        const saved = localStorage.getItem('achievements');
        return saved ? JSON.parse(saved) : INITIAL_ACHIEVEMENTS;
    });
    const [levelsSolved, setLevelsSolved] = useState(() => Number(localStorage.getItem('levelsSolved') || 0));
    const [hintUsedThisLevel, setHintUsedThisLevel] = useState(false);
    const [showAchievements, setShowAchievements] = useState(false);
    const [notification, setNotification] = useState<string | null>(null);

    // Shop State
    const [showShop, setShowShop] = useState(false);
    const [coins, setCoins] = useState(() => Number(localStorage.getItem('coins') || 10));

    // Persist stats
    useEffect(() => {
        localStorage.setItem('coins', coins.toString());
        localStorage.setItem('levelsSolved', levelsSolved.toString());
        localStorage.setItem('achievements', JSON.stringify(achievements));
    }, [coins, levelsSolved, achievements]);

    // Check coin-based achievement
    useEffect(() => {
        if (coins >= 100) {
            unlockAchievement('rich');
        }
    }, [coins]);

    const unlockAchievement = (id: string) => {
        setAchievements(prev => {
            const achievement = prev.find(a => a.id === id);
            if (achievement && !achievement.unlocked) {
                setNotification(`Yangi yutuq: ${achievement.title}! ${achievement.icon}`);
                setTimeout(() => setNotification(null), 4000);
                return prev.map(a => a.id === id ? { ...a, unlocked: true } : a);
            }
            return prev;
        });
    };

    // Define Source Point
    const width = grid[0]?.length || 0;
    const height = grid.length || 0;
    const sourcePoint: Point = useMemo(() => ({
        x: Math.floor(width / 2),
        y: height - 1
    }), [width, height]);

    // Calculate Powered Tiles
    const poweredTiles = useMemo(() => {
        if (!grid.length) return new Set<string>();
        return calculatePower(grid, sourcePoint);
    }, [grid, sourcePoint]);

    // Load initial level
    useEffect(() => {
        fetchLevel(mode);
    }, [mode]);

    useEffect(() => {
        if (grid.length > 0) {
            let allPowered = true;
            let hasTiles = false;

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    if (grid[y][x].type !== 0) {
                        hasTiles = true;
                        if (!poweredTiles.has(`${x},${y}`)) {
                            allPowered = false;
                            break;
                        }
                    }
                }
            }

            if (allPowered && hasTiles) {
                if (!isWon) {
                    playWinSound();
                    setCoins(c => c + 10);
                    setLevelsSolved(l => l + 1);
                    
                    // Achievement Checks
                    unlockAchievement('first_light');
                    if (mode === 'daily') unlockAchievement('zen_master');
                    if (!hintUsedThisLevel) unlockAchievement('economist');
                    if (levelsSolved + 1 >= 10) unlockAchievement('professional');
                }
                setIsWon(true);
            } else {
                setIsWon(false);
            }
        }
    }, [poweredTiles, grid, height, width, isWon, mode, hintUsedThisLevel, levelsSolved]);

    const fetchLevel = async (currentMode: 'random' | 'daily') => {
        setLoading(true);
        setHintUsedThisLevel(false);
        try {
            const endpoint = currentMode === 'random' ? '/level/random?width=5&height=5' : '/level/daily';
            const res = await fetch(`${API_URL}${endpoint}`);
            const data = await res.json();
            setGrid(data);
            setIsWon(false);
        } catch (err) {
            console.error("Failed to fetch level:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleRotate = (x: number, y: number) => {
        if (isWon) return;
        playClickSound();
        setGrid(prevGrid => {
            const newGrid = prevGrid.map(row => row.map(tile => ({ ...tile })));
            newGrid[y][x].rotation = (newGrid[y][x].rotation + 1) % 4;
            return newGrid;
        });
    };

    const handleWatchAd = () => {
        alert("Simulating 5 second video ad...");
        setTimeout(() => {
            setCoins(prev => prev + 3);
            alert("Rahmat! +3 Tanga qo'shildi.");
        }, 1000);
    };

    const handleHint = () => {
        if (isWon) return;
        if (coins < 2) {
            if (confirm("Tangalar yetarli emas! Reklama ko'rib +3 tanga olasizmi?")) {
                setShowShop(true);
            }
            return;
        }

        const incorrectTiles: { x: number, y: number }[] = [];
        grid.forEach((row, y) => {
            row.forEach((tile, x) => {
                if (getEffectiveShape(tile) !== tile.type) {
                    incorrectTiles.push({ x, y });
                }
            });
        });

        if (incorrectTiles.length === 0) return;
        const target = incorrectTiles[Math.floor(Math.random() * incorrectTiles.length)];
        
        setCoins(c => c - 2);
        setHintUsedThisLevel(true);
        playClickSound();

        setGrid(prevGrid => {
            const newGrid = prevGrid.map(row => row.map(tile => ({ ...tile })));
            newGrid[target.y][target.x].rotation = 0;
            return newGrid;
        });
    };

    return (
        <div
            className="flex flex-col items-center justify-center min-h-screen text-white p-4 transition-colors duration-1000 relative"
            style={{
                background: 'radial-gradient(circle at center, #2b5c58 0%, #0f1c20 100%)'
            }}
        >
            {/* Header Buttons */}
            <div className="absolute top-6 right-6 flex gap-3">
                <button
                    onClick={() => setShowAchievements(true)}
                    className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all group relative"
                    title="Yutuqlar"
                >
                    <span className="text-xl">🏆</span>
                </button>
                <button
                    onClick={() => setShowShop(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-black/20 hover:bg-black/40 border border-white/10 rounded-full transition-all"
                >
                    <span className="text-amber-400 font-bold">{coins}</span>
                    <span className="text-[10px] uppercase tracking-widest text-gray-300">Coins</span>
                </button>
            </div>

            {/* Achievement Notification */}
            {notification && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-amber-500 text-black px-6 py-3 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.5)] font-bold animate-bounce z-[100] flex items-center gap-3">
                    <span className="text-2xl">🎉</span>
                    {notification}
                </div>
            )}

            <h1 className="text-4xl font-light mb-8 tracking-widest text-teal-100/80 uppercase">Energy Loop</h1>

            {/* Mode Switcher */}
            <div className="flex gap-4 mb-8">
                <button
                    onClick={() => setMode('random')}
                    className={`px-6 py-2 rounded-full text-xs uppercase tracking-widest transition-all duration-300 ${mode === 'random' ? 'bg-teal-500/20 text-teal-200 border border-teal-500/50 shadow-[0_0_15px_rgba(45,212,191,0.2)]' : 'bg-transparent text-gray-500 border border-transparent hover:border-gray-600'}`}
                >
                    Quick Play
                </button>
                <button
                    onClick={() => setMode('daily')}
                    className={`px-6 py-2 rounded-full text-xs uppercase tracking-widest transition-all duration-300 ${mode === 'daily' ? 'bg-amber-500/20 text-amber-200 border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'bg-transparent text-gray-500 border border-transparent hover:border-gray-600'}`}
                >
                    Daily Zen
                </button>
            </div>

            <div className="h-10 mb-2 flex items-center justify-center">
                {isWon && (
                    <div className="text-green-300 font-light text-2xl animate-pulse drop-shadow-[0_0_15px_rgba(74,222,128,0.8)] tracking-widest">
                        — SYSTEM ONLINE —
                    </div>
                )}
            </div>

            {loading ? (
                <div className="w-80 h-80 flex items-center justify-center">
                    <div className="w-12 h-12 border-2 border-teal-500/30 border-t-teal-400 rounded-full animate-spin"></div>
                </div>
            ) : (
                <div
                    className="grid gap-0 p-8 rounded-full shadow-2xl transition-all duration-1000"
                    style={{
                        gridTemplateColumns: `repeat(${grid[0]?.length || 0}, min-content)`,
                        gap: 0,
                        boxShadow: isWon
                            ? '0 0 100px rgba(45, 212, 191, 0.1), inset 0 0 50px rgba(45, 212, 191, 0.05)'
                            : '0 0 50px rgba(0,0,0,0.5)'
                    }}
                >
                    {grid.map((row, y) => (
                        row.map((tile, x) => {
                            const isSource = x === sourcePoint.x && y === sourcePoint.y;
                            return (
                                <div key={`${x}-${y}`} className="flex items-center justify-center p-0 m-0 w-max h-max">
                                    <Tile
                                        type={tile.type}
                                        rotation={tile.rotation}
                                        onClick={() => handleRotate(x, y)}
                                        isPowered={poweredTiles.has(`${x},${y}`)}
                                        isSource={isSource}
                                        size={mode === 'daily' ? 60 : 80}
                                    />
                                </div>
                            );
                        })
                    ))}
                </div>
            )}

            <div className="mt-12 flex gap-4 opacity-80 hover:opacity-100 transition-opacity">
                <button
                    onClick={handleHint}
                    disabled={isWon || loading}
                    className="group px-6 py-3 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 rounded-full text-xs uppercase tracking-[0.2em] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span className="text-amber-200">Hint</span>
                    <span className="bg-amber-500/20 px-2 py-0.5 rounded text-[10px] text-amber-100">-2 🪙</span>
                </button>
                <button
                    onClick={() => fetchLevel(mode)}
                    className="group px-8 py-3 bg-transparent border border-white/10 hover:border-white/30 rounded-full text-xs uppercase tracking-[0.2em] transition-all"
                    disabled={loading}
                >
                    {isWon ? <span className="text-teal-300 group-hover:drop-shadow-[0_0_8px_rgba(94,234,212,0.8)]">Keyingi Bosqich</span> : 'Energiyani Tiklash'}
                </button>
            </div>

            {/* Modals */}
            {showShop && (
                <ShopModal
                    onClose={() => setShowShop(false)}
                    coins={coins}
                    onWatchAd={handleWatchAd}
                />
            )}

            {showAchievements && (
                <AchievementsModal
                    onClose={() => setShowAchievements(false)}
                    achievements={achievements}
                />
            )}
        </div>
    );
};

export default Grid;

import React, { useState, useEffect, useMemo } from 'react';
import Tile from './Tile';
import ShopModal from './ShopModal';
import type { GridMatrix, Point } from '../logic/types';
import { playClickSound, playWinSound } from '../logic/audio';
import { calculatePower } from '../logic/flow';
import { getEffectiveShape } from '../logic/grid';

// API Configuration
const API_URL = '/api';

const Grid: React.FC = () => {
    const [grid, setGrid] = useState<GridMatrix>([]);
    const [isWon, setIsWon] = useState(false);
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<'random' | 'daily'>('daily'); // Default to daily for the big nice grid

    // Shop State
    const [showShop, setShowShop] = useState(false);
    const [coins, setCoins] = useState(10);

    // Define Source Point (Bottom Center usually, but let's dynamic)
    // For 5x5: 2,4. For 7x7: 3,6.
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
        // Determine win by flow: If all non-empty tiles are powered
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
                    // Optional: Reward coin on win
                    setCoins(c => c + 10);
                }
                setIsWon(true);
            } else {
                setIsWon(false);
            }
        }
    }, [poweredTiles, grid, height, width, isWon]);

    const fetchLevel = async (currentMode: 'random' | 'daily') => {
        setLoading(true);
        try {
            const endpoint = currentMode === 'random' ? '/level/random?width=5&height=5' : '/level/daily';
            const res = await fetch(`${API_URL}${endpoint}`);
            const data = await res.json();
            setGrid(data);
            setIsWon(false);
        } catch (err) {
            console.error("Failed to fetch level:", err);
            alert("Failed to connect to game server. Is backend running?");
        } finally {
            setLoading(false);
        }
    };

    const handleRotate = (x: number, y: number) => {
        // Allow rotation even if won to play around? Or freeze?
        // Let's freeze for "Level Complete" feel.
        if (isWon) return;

        playClickSound();

        setGrid(prevGrid => {
            const newGrid = prevGrid.map(row => row.map(tile => ({ ...tile })));
            newGrid[y][x].rotation = (newGrid[y][x].rotation + 1) % 4;
            return newGrid;
        });
    };

    const handleWatchAd = () => {
        // Simulate Ad Watch
        alert("Simulating 5 second video ad...");
        setTimeout(() => {
            setCoins(prev => prev + 3);
            alert("Thanks for watching! +3 Coins added.");
        }, 1000);
    };

    const handleHint = () => {
        if (isWon) return;

        if (coins < 2) {
            if (confirm("Not enough coins! Need 2 Coins. Watch an Ad to get +3?")) {
                setShowShop(true);
            }
            return;
        }

        // Find incorrect tiles
        const incorrectTiles: { x: number, y: number }[] = [];
        grid.forEach((row, y) => {
            row.forEach((tile, x) => {
                // If effective shape doesn't match base type, it's rotated wrong
                // (Assuming base type is always the rotation 0 solution)
                if (getEffectiveShape(tile) !== tile.type) {
                    incorrectTiles.push({ x, y });
                }
            });
        });

        if (incorrectTiles.length === 0) {
            return;
        }

        // Pick random
        const target = incorrectTiles[Math.floor(Math.random() * incorrectTiles.length)];

        setCoins(c => c - 2);
        playClickSound(); // Or special hint sound

        setGrid(prevGrid => {
            const newGrid = prevGrid.map(row => row.map(tile => ({ ...tile })));
            // Set rotation to 0. Since 0 is always A solution.
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
            {/* Shop Button */}
            <div className="absolute top-6 right-6">
                <button
                    onClick={() => setShowShop(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-black/20 hover:bg-black/40 border border-white/10 rounded-full transition-all"
                >
                    <span className="text-amber-400 font-bold">{coins}</span>
                    <span className="text-[10px] uppercase tracking-widest text-gray-300">Coins</span>
                </button>
            </div>

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
                        // No gaps for organic flow
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
                                        // Increase size for organic feel
                                        size={mode === 'daily' ? 60 : 80}
                                    />
                                </div>
                            );
                        })
                    ))}
                </div>
            )}

            <div className="mt-12 flex gap-4 opacity-80 hover:opacity-100 transition-opacity">
                {/* Hint Button */}
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
                    {isWon ? <span className="text-teal-300 group-hover:drop-shadow-[0_0_8px_rgba(94,234,212,0.8)]">Next Sequence</span> : 'Reset Energy'}
                </button>
            </div>

            {/* Shop Modal */}
            {showShop && (
                <ShopModal
                    onClose={() => setShowShop(false)}
                    coins={coins}
                    onWatchAd={handleWatchAd}
                />
            )}
        </div>
    );
};

export default Grid;

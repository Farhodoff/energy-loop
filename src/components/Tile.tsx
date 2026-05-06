import React from 'react';
import clsx from 'clsx';
import { TOP, RIGHT, BOTTOM, LEFT } from '../logic/constants';

interface TileProps {
    type: number;      // 0-15
    rotation: number;  // 0-3
    onClick: () => void;
    size?: number;
    isPowered?: boolean; // Prop name changed from isWon to isPowered for granularity
    isSource?: boolean;
}

const Tile: React.FC<TileProps> = ({ type, rotation, onClick, size = 60, isPowered = false, isSource = false }) => {
    const strokeColor = isPowered ? "#ffffff" : "#ffffff40";
    // Stronger glow for powered, none for unpowered
    const filter = isPowered ? "url(#glow)" : "";
    const strokeWidth = 6;

    // Compute active directions based on type
    // This component renders based on the unrotated 'type' prop, keeping the SVG coordinate system static,
    // and applying CSS transform for rotation.
    const hasTop = (type & TOP) !== 0;
    const hasRight = (type & RIGHT) !== 0;
    const hasBottom = (type & BOTTOM) !== 0;
    const hasLeft = (type & LEFT) !== 0;

    const connectionCount = (hasTop ? 1 : 0) + (hasRight ? 1 : 0) + (hasBottom ? 1 : 0) + (hasLeft ? 1 : 0);

    // Helper to draw specific shapes based on connections
    const renderShape = () => {
        // 1. ENDPOINT (1 connection) - Bulb look
        if (connectionCount === 1) {
            if (hasTop) return <path d="M 50 50 L 50 25 M 50 25 A 5 5 0 1 1 50 15 A 5 5 0 1 1 50 25" fill="none" />;
            if (hasRight) return <path d="M 50 50 L 75 50 M 75 50 A 5 5 0 1 1 85 50 A 5 5 0 1 1 75 50" fill="none" />;
            if (hasBottom) return <path d="M 50 50 L 50 75 M 50 75 A 5 5 0 1 1 50 85 A 5 5 0 1 1 50 75" fill="none" />;
            if (hasLeft) return <path d="M 50 50 L 25 50 M 25 50 A 5 5 0 1 1 15 50 A 5 5 0 1 1 25 50" fill="none" />;
        }

        // 2. STRAIGHT LINE (2 connections, opposite)
        if (connectionCount === 2 && ((hasTop && hasBottom) || (hasLeft && hasRight))) {
            if (hasTop) return <path d="M 50 0 L 50 100" fill="none" />; // Vertical
            if (hasLeft) return <path d="M 0 50 L 100 50" fill="none" />; // Horizontal
        }

        // 3. CURVE/TURN (2 connections, adjacent)
        if (connectionCount === 2) {
            if (hasTop && hasRight) return <path d="M 50 0 Q 50 50 100 50" fill="none" />;
            if (hasRight && hasBottom) return <path d="M 100 50 Q 50 50 50 100" fill="none" />;
            if (hasBottom && hasLeft) return <path d="M 50 100 Q 50 50 0 50" fill="none" />;
            if (hasLeft && hasTop) return <path d="M 0 50 Q 50 50 50 0" fill="none" />;
        }

        // 4. T-SHAPE (3 connections) - Merge curves to center
        // We can construct this by combining basic paths from center to edge.
        // Actually, T-shape usually looks like a smooth merge.
        // Let's use simple center-to-edge paths for complex shapes to ensure connectivity visually.

        // Fallback / Complex shapes: Just draw lines/curves from center to each exist.
        // To make it organic, we start at 50,50.


        // We want smooth curves. If we have Top, we draw line from 50,0 to 50,50? 
        // Or better, for >=3 connections, it's a "Hub".
        // Let's just draw Quadratic curves from edge to center?
        // Actually, to make T-shape look organic like the image (branching), 
        // it usually looks like a main stem splitting.

        // Simplified organic approach:
        // Draw 4 potential segments meeting at center.
        // But curve them slightly if possible or just straight lines meeting at rounded center.
        // The prompt requested curves.
        // Let's stick to the "Curve" logic for corners, but for T-Junctions, 
        // maybe we treat it as lines merging to a central dot?
        // Let's use the provided snippet style: Curves.

        // A generic way to do organic tiling for any shape:
        // Every active side connects to the center (50,50).
        // But instead of straight lines, we can make them look fluid.
        // However, without context of neighbors, straightforward center-to-edge is safest for generic T/Cross.
        // To make it look "curved" like the prompt image (Y shape):
        // The image shows smooth transitions.
        // Let's implement T-Shape as 3 curves meeting.

        // But wait, the standard "Pipe" game T-shape is just a T. 
        // Let's replicate the "Curve" logic for all non-straight, non-endpoint pieces by composing them.
        // Actually, a T-piece is visually 3 curved arms? 
        // Let's trust simple straight lines with a rounded join for 3+ connections, 
        // OR combine curves.
        // Let's try combining curves for the "Curved" aesthetic everywhere.

        // Revised Strategy for 3+ connections:
        // Draw from Center to Edge.
        // To make it seamless with neighboring "Curves" (which enter at 90deg),
        // the path at the edge must be perpendicular to the edge.
        // M 50 50 L 50 0 is perpendicular.
        // So straight lines from center are actually fine and continuity-preserving with curves.
        // But the prompt wants "Organic".
        // 3-way junction: 
        //   Top + Right + Left:  Looks like a 'Y' or 'T'.
        //   Let's draw a smoothed path.
        //   Maybe active sides just `L` to center, with `stroke-linecap="round"` and `stroke-linejoin="round"`.

        const parts = [];
        if (hasTop) parts.push("M 50 50 L 50 0");
        if (hasRight) parts.push("M 50 50 L 100 50");
        if (hasBottom) parts.push("M 50 50 L 50 100");
        if (hasLeft) parts.push("M 50 50 L 0 50");

        return <path d={parts.join(" ")} fill="none" strokeLinecap="round" strokeLinejoin="round" />;
    };

    return (
        <div
            className={clsx(
                "tile transition-transform duration-500 ease-in-out cursor-pointer hover:bg-white/5 rounded-full"
            )}
            style={{
                width: size,
                height: size,
                transform: `rotate(${rotation * 90}deg)`,
            }}
            onClick={onClick}
        >
            <svg width="100%" height="100%" viewBox="0 0 100 100" className="overflow-visible">
                <defs>
                    <filter id="glow" filterUnits="userSpaceOnUse">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Glow Group */}
                <g filter={filter} className="transition-all duration-500" stroke={strokeColor} strokeWidth={strokeWidth}>
                    {renderShape()}

                    {/* Source Indicator (Battery symbol) if it's the source */}
                    {isSource && (
                        <circle cx="50" cy="50" r="10" fill={isPowered ? "#fbbf24" : "#4b5563"} stroke="none" />
                    )}
                    {/* If it's an endpoint (1 connection), add a bulb glow if powered */}
                    {connectionCount === 1 && isPowered && (
                        <circle cx={hasTop ? 50 : (hasBottom ? 50 : (hasLeft ? 15 : 85))} cy={hasTop ? 15 : (hasBottom ? 85 : 50)} r="4" fill="#fff" stroke="none" className="animate-pulse" />
                    )}

                    {/* Central hub to smooth joins for >2 connections */}
                    {connectionCount > 2 && (
                        <circle cx="50" cy="50" r="3.5" fill={strokeColor} stroke="none" />
                    )}
                </g>
            </svg>
        </div>
    );
};

export default Tile;

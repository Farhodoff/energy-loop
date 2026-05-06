import { isConnected } from './grid';
import type { GridMatrix, Point } from './types';

/**
 * Calculates which tiles are powered starting from a source.
 * Returns a Set of stringified coordinates "x,y" that receive power.
 */
export function calculatePower(grid: GridMatrix, source: Point): Set<string> {
    const powered = new Set<string>();
    const queue: Point[] = [source];
    const width = grid[0].length;
    const height = grid.length;

    // Source is always powered if it's within bounds
    if (source.x >= 0 && source.x < width && source.y >= 0 && source.y < height) {
        powered.add(`${source.x},${source.y}`);
    } else {
        return powered;
    }

    while (queue.length > 0) {
        const { x, y } = queue.shift()!;

        const neighbors = [
            { x: x, y: y - 1 }, // Top
            { x: x + 1, y: y }, // Right
            { x: x, y: y + 1 }, // Bottom
            { x: x - 1, y: y }  // Left
        ];

        for (const n of neighbors) {
            const key = `${n.x},${n.y}`;
            if (!powered.has(key)) {
                // Check if physically connected
                if (isConnected(grid, x, y, n.x, n.y)) {
                    powered.add(key);
                    queue.push(n);
                }
            }
        }
    }

    return powered;
}

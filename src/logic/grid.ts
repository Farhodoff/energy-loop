import { TOP, RIGHT, BOTTOM, LEFT } from './constants';
import type { TileData, GridMatrix, Point } from './types';

const OPPOSITE: Record<number, number> = {
    [TOP]: BOTTOM,
    [BOTTOM]: TOP,
    [LEFT]: RIGHT,
    [RIGHT]: LEFT,
};

/**
 * Returns the effective bitmask of a tile after rotation.
 */
export function getEffectiveShape(tile: TileData): number {
    let mask = tile.type;
    for (let i = 0; i < tile.rotation; i++) {
        let newMask = 0;
        if (mask & TOP) newMask |= RIGHT;
        if (mask & RIGHT) newMask |= BOTTOM;
        if (mask & BOTTOM) newMask |= LEFT;
        if (mask & LEFT) newMask |= TOP;
        mask = newMask;
    }
    return mask;
}

/**
 * Checks if two tiles are physically connected.
 * (x1, y1) connects to (x2, y2)
 */
export function isConnected(
    grid: GridMatrix,
    x1: number,
    y1: number,
    x2: number,
    y2: number
): boolean {
    const height = grid.length;
    const width = grid[0].length;

    if (x1 < 0 || x1 >= width || y1 < 0 || y1 >= height) return false;
    if (x2 < 0 || x2 >= width || y2 < 0 || y2 >= height) return false;

    const t1 = grid[y1][x1];
    const t2 = grid[y2][x2];

    const m1 = getEffectiveShape(t1);
    const m2 = getEffectiveShape(t2);

    let direction: number | null = null;
    if (x2 === x1 && y2 === y1 - 1) direction = TOP;
    else if (x2 === x1 + 1 && y2 === y1) direction = RIGHT;
    else if (x2 === x1 && y2 === y1 + 1) direction = BOTTOM;
    else if (x2 === x1 - 1 && y2 === y1) direction = LEFT;

    if (direction === null) return false;

    const hasConnector1 = (m1 & direction) !== 0;
    const hasConnector2 = (m2 & OPPOSITE[direction]) !== 0;

    return hasConnector1 && hasConnector2;
}

/**
 * Checks if the grid is fully connected (win condition).
 * For now, we assume we need to connect ALL tiles that have at least one pipe.
 * Or better: just run BFS from a source (0,0 typically) and see if we reach all non-empty tiles.
 */
export function checkWinCondition(grid: GridMatrix, source: Point = { x: 0, y: 0 }): boolean {
    const height = grid.length;
    const width = grid[0].length;

    // Count total non-empty tiles (tiles that have some pipes)
    // Actually, for Loop game, usually every tile is part of the circuit.
    // But let's assume tiles with type=0 are empty/walls.
    let totalTargetTiles = 0;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (grid[y][x].type !== 0) totalTargetTiles++;
        }
    }

    const visited = new Set<string>();
    const queue: Point[] = [source];
    visited.add(`${source.x},${source.y}`);

    let connectedCount = 0;

    while (queue.length > 0) {
        const { x, y } = queue.shift()!;
        if (grid[y][x].type !== 0) connectedCount++;

        const neighbors = [
            { x: x, y: y - 1 },
            { x: x + 1, y: y },
            { x: x, y: y + 1 },
            { x: x - 1, y: y }
        ];

        for (const n of neighbors) {
            if (!visited.has(`${n.x},${n.y}`)) {
                if (isConnected(grid, x, y, n.x, n.y)) {
                    visited.add(`${n.x},${n.y}`);
                    queue.push(n);
                }
            }
        }
    }

    // If we connected all relevant tiles
    return connectedCount === totalTargetTiles && totalTargetTiles > 0;
}

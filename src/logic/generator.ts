import { TOP, RIGHT, BOTTOM, LEFT } from './constants';
import type { GridMatrix } from './types';

const OPPOSITE: Record<number, number> = {
    [TOP]: BOTTOM,
    [BOTTOM]: TOP,
    [LEFT]: RIGHT,
    [RIGHT]: LEFT,
};

function createEmptyGrid(width: number, height: number): GridMatrix {
    return Array(height).fill(null).map(() =>
        Array(width).fill(null).map(() => ({ type: 0, rotation: 0, locked: false }))
    );
}

function getNeighbors(x: number, y: number, width: number, height: number): { x: number, y: number, dir: number }[] {
    const neighbors = [];
    if (y > 0) neighbors.push({ x, y: y - 1, dir: TOP });
    if (x < width - 1) neighbors.push({ x: x + 1, y, dir: RIGHT });
    if (y < height - 1) neighbors.push({ x, y: y + 1, dir: BOTTOM });
    if (x > 0) neighbors.push({ x: x - 1, y, dir: LEFT });
    return neighbors;
}

function shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export function generateLevel(width: number, height: number): GridMatrix {
    // 1. Initialize Grid
    const grid = createEmptyGrid(width, height);
    const visited = new Set<string>();

    // 2. Recursive Backtracker to generate Spanning Tree
    function carve(cx: number, cy: number) {
        visited.add(`${cx},${cy}`);

        // Get random neighbors
        const neighbors = shuffle(getNeighbors(cx, cy, width, height));

        for (const { x: nx, y: ny, dir } of neighbors) {
            if (!visited.has(`${nx},${ny}`)) {
                // Carve path: Add dir to current, Add opposite to neighbor
                grid[cy][cx].type |= dir;
                grid[ny][nx].type |= OPPOSITE[dir];

                carve(nx, ny);
            }
        }
    }

    // Start from random cell or center
    carve(0, 0);

    // 3. Add Loops (Randomly remove some walls)
    // Iterate all cells, check neighbors. If not connected, maybe connect them.
    const loopChance = 0.1; // 10% chance to open a closed wall

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const neighbors = getNeighbors(x, y, width, height);
            for (const { x: nx, y: ny, dir } of neighbors) {
                // If not already connected in this direction
                if (!(grid[y][x].type & dir)) {
                    // Roll dice
                    if (Math.random() < loopChance) {
                        grid[y][x].type |= dir;
                        grid[ny][nx].type |= OPPOSITE[dir];
                    }
                }
            }
        }
    }

    // 4. Scramble Rotations
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            // Random rotation 0-3
            grid[y][x].rotation = Math.floor(Math.random() * 4);
        }
    }

    return grid;
}

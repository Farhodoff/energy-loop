export interface TileData {
    type: number; // The base shape bitmask (0 deg)
    rotation: number; // 0, 1, 2, 3
    locked: boolean; // For future use (if some tiles can't be rotated)
}

export type GridMatrix = TileData[][];

export interface Point {
    x: number;
    y: number;
}

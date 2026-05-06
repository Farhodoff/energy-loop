import random
from enum import IntEnum
from typing import List, Tuple

# Constants
class Direction(IntEnum):
    TOP = 1
    RIGHT = 2
    BOTTOM = 4
    LEFT = 8

OPPOSITE = {
    Direction.TOP: Direction.BOTTOM,
    Direction.BOTTOM: Direction.TOP,
    Direction.LEFT: Direction.RIGHT,
    Direction.RIGHT: Direction.LEFT
}

def get_neighbors(x: int, y: int, width: int, height: int) -> List[Tuple[int, int, int]]:
    neighbors = []
    if y > 0: neighbors.append((x, y - 1, Direction.TOP))
    if x < width - 1: neighbors.append((x + 1, y, Direction.RIGHT))
    if y < height - 1: neighbors.append((x, y + 1, Direction.BOTTOM))
    if x > 0: neighbors.append((x - 1, y, Direction.LEFT))
    return neighbors

def generate_grid(width: int, height: int, seed: int = None) -> List[List[dict]]:
    if seed is not None:
        random.seed(seed)
    
    # Initialize grid
    grid = [[{"type": 0, "rotation": 0, "locked": False} for _ in range(width)] for _ in range(height)]
    visited = set()

    # Recursive Backtracker
    def carve(cx, cy):
        visited.add((cx, cy))
        neighbors = get_neighbors(cx, cy, width, height)
        random.shuffle(neighbors)

        for nx, ny, direction in neighbors:
            if (nx, ny) not in visited:
                # Carve path
                grid[cy][cx]["type"] |= direction
                grid[ny][nx]["type"] |= OPPOSITE[direction]
                carve(nx, ny)
    
    carve(0, 0)

    # Add Loops (10% chance)
    loop_chance = 0.1
    for y in range(height):
        for x in range(width):
            neighbors = get_neighbors(x, y, width, height)
            for nx, ny, direction in neighbors:
                if not (grid[y][x]["type"] & direction):
                    if random.random() < loop_chance:
                        grid[y][x]["type"] |= direction
                        grid[ny][nx]["type"] |= OPPOSITE[direction]
    
    # Scramble Rotations
    for row in grid:
        for tile in row:
            tile["rotation"] = random.randint(0, 3)

    return grid

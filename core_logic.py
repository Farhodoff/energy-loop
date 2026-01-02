
import collections

# --- A. CONSTANTS (Bitmasks) ---
# T (Top), R (Right), B (Bottom), L (Left)
# Use powers of 2 for bitwise operations.
TOP    = 1  # 0001
RIGHT  = 2  # 0010
BOTTOM = 4  # 0100
LEFT   = 8  # 1000

# Mapping opposite directions
OPPOSITE = {
    TOP: BOTTOM,
    BOTTOM: TOP,
    LEFT: RIGHT,
    RIGHT: LEFT
}

class Tile:
    def __init__(self, shape_type: int, rotation: int = 0):
        """
        shape_type: The bitmask of the tile in its default rotation (0 deg).
        rotation: 0, 1, 2, or 3 (representing 0, 90, 180, 270 degrees clockwise).
        """
        self.shape_type = shape_type
        self.rotation = rotation % 4

    def get_effective_shape(self) -> int:
        """
        Returns the effective bitmask after applying rotation.
        Rotation shifts bits:
        0 deg:  T R B L (1 2 4 8)
        90 deg: L T R B (8 1 2 4) -> Right shift logic effectively, but let's implement carefully.
        
        Easier logic: 
        If we hold 1 (TOP), after 90 deg it becomes 2 (RIGHT).
        2 (RIGHT) -> 4 (BOTTOM)
        4 (BOTTOM) -> 8 (LEFT)
        8 (LEFT) -> 1 (TOP)
        """
        mask = self.shape_type
        for _ in range(self.rotation):
            # Rotate all bits:
            new_mask = 0
            if mask & TOP:    new_mask |= RIGHT
            if mask & RIGHT:  new_mask |= BOTTOM
            if mask & BOTTOM: new_mask |= LEFT
            if mask & LEFT:   new_mask |= TOP
            mask = new_mask
        return mask

    def rotate(self):
        """Rotate 90 degrees clockwise."""
        self.rotation = (self.rotation + 1) % 4
    
    def __repr__(self):
        return f"Tile(type={self.shape_type}, rot={self.rotation}, eff={self.get_effective_shape()})"


class Grid:
    def __init__(self, width: int, height: int, tiles):
        self.width = width
        self.height = height
        self.grid = tiles  # Matrix of Tile objects

    def print_grid(self):
        print(f"Grid {self.width}x{self.height}:")
        for y in range(self.height):
            row_str = []
            for x in range(self.width):
                t = self.grid[y][x]
                row_str.append(f"{t.get_effective_shape():2}")
            print(f"[{' '.join(row_str)}]")

    def is_connected(self, x1, y1, x2, y2):
        """Checks if two adjacent tiles are physically connected."""
        if not (0 <= x1 < self.width and 0 <= y1 < self.height): return False
        if not (0 <= x2 < self.width and 0 <= y2 < self.height): return False

        t1 = self.grid[y1][x1]
        t2 = self.grid[y2][x2]
        m1 = t1.get_effective_shape()
        m2 = t2.get_effective_shape()

        # Determine direction from 1 to 2
        direction = None
        if x2 == x1 and y2 == y1 - 1: direction = TOP
        elif x2 == x1 + 1 and y2 == y1: direction = RIGHT
        elif x2 == x1 and y2 == y1 + 1: direction = BOTTOM
        elif x2 == x1 - 1 and y2 == y1: direction = LEFT
        
        if direction is None: return False # Not neighbors

        # Check if t1 has connector in that direction AND t2 has connector in opposite
        has_connector_1 = (m1 & direction) != 0
        has_connector_2 = (m2 & OPPOSITE[direction]) != 0
        
        return has_connector_1 and has_connector_2

    def check_win_condition(self, source_x, source_y, required_count=None):
        """
        DFS/BFS starting from source. 
        Returns True if all reachable nodes count matches required_count (or simply all nodes usually).
        """
        visited = set()
        queue = collections.deque([(source_x, source_y)])
        visited.add((source_x, source_y))

        connected_count = 0
        
        while queue:
            cx, cy = queue.popleft()
            connected_count += 1
            
            # Check 4 neighbors
            neighbors = [
                (cx, cy - 1), (cx + 1, cy), (cx, cy + 1), (cx - 1, cy)
            ]
            
            for nx, ny in neighbors:
                if (nx, ny) not in visited:
                    if self.is_connected(cx, cy, nx, ny):
                        visited.add((nx, ny))
                        queue.append((nx, ny))
        
        print(f"Connected Count: {connected_count}")
        if required_count:
             return connected_count == required_count
        return connected_count == (self.width * self.height)


# --- TEST SIMULATION ---
if __name__ == "__main__":
    print("--- Running Logic Test ---")

    # Let's make a simple 2x2 grid that forms a loop (square)
    # Target:
    # ┌ ┐  (Bottom+Right) (Bottom+Left) -> 4+2=6, 4+8=12
    # └ ┘  (Top+Right)    (Top+Left)    -> 1+2=3, 1+8=9
    
    # But let's start them scrambled
    t1 = Tile(6, rotation=1) # 6 is Bottom+Right. Rotated 1 (90) -> Left + Bottom (8+4=12) WRONG orientation
    t2 = Tile(12, rotation=0) # Correct
    t3 = Tile(3, rotation=0)  # Correct
    t4 = Tile(9, rotation=0)  # Correct

    grid_data = [
        [t1, t2],
        [t3, t4]
    ]
    
    g = Grid(2, 2, grid_data)
    g.print_grid()
    
    print("Checking win condition (expect False)...")
    is_win = g.check_win_condition(0, 0)
    print(f"Win: {is_win}")

    print("\nFixing rotation of Tile(0,0)...")
    # Tile 0,0 was 6 (BR). Rot 1 => BL. 
    # We want BR. Rot 0 is BR.
    # Currently it is Rot 1. Let's rotate it 3 more times to get back to 0 (1+3=4=0)
    t1.rotate() # 2
    t1.rotate() # 3
    t1.rotate() # 0
    
    g.print_grid()
    
    print("Checking win condition (expect True)...")
    is_win = g.check_win_condition(0, 0)
    print(f"Win: {is_win}")

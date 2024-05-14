import heapq
from numpy import sqrt, load
from pathlib import Path
import numpy as np

SPATIAL_HEIGHTMAP_PATH = Path(__file__).parent.parent / 'data' / 'grid.npy'
OBSTACLE_CLEARANCE = 1  
SLOPE_PENALTY = 10

class Node:
    heuristic_cache = {}

    def __init__(self, x: int, y: int, parent: "Node" = None, penalty: float = 0) -> None:
        self.x = x
        self.y = y
        self.parent = parent
        self.height = GRID[x][y]
        self.penalty = penalty

        self.g: float = 0
        self.h: float = 0
        self.f: float = 0

        if parent is not None:
            self.g = parent.g + self.dist_btw(parent) + self.penalty
            self.h = self.heuristic(goal_node)
            self.f = self.g + self.h

    def __lt__(self, other: "Node") -> bool:
        return self.f < other.f

    def heuristic(self, other: "Node") -> float:
        key = (self.x, self.y, other.x, other.y)
        if key in Node.heuristic_cache:
            return Node.heuristic_cache[key]

        dx = self.x - other.x
        dy = self.y - other.y
        result = sqrt(dx ** 2 + dy ** 2)
        Node.heuristic_cache[key] = result
        return result

    def dist_btw(self, node2: 'Node') -> float:
        dx = node2.x - self.x
        dy = node2.y - self.y
        height_diff = abs(node2.height - self.height)
        penalty = height_diff * SLOPE_PENALTY
        return sqrt(dx ** 2 + dy ** 2) + penalty
    
    
    
obstacle_cache = set()

def is_obstacle(x, y):
    if (x, y) in obstacle_cache:
        return True

    height = GRID[x][y]
    if height > 1000:
        obstacle_cache.add((x, y))
        return True

    for dx in [-1, 0, 1]:
        for dy in [-1, 0, 1]:
            if dx == dy == 0:
                continue
            x2 = x + dx
            y2 = y + dy
            if (
                0 <= x2 < len(GRID)
                and 0 <= y2 < len(GRID[0])
                and GRID[x2][y2] > 1000
            ):
                obstacle_cache.add((x, y))
                return True

    return False

neighbor_cache = {}

def precompute_neighbors():
    neighbor_cache = {}
    for x in range(len(GRID)):
        for y in range(len(GRID[0])):
            neighbors = []
            node_height = GRID[x][y]
            for dx, dy in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
                x2 = x + dx
                y2 = y + dy
                if (
                    0 <= x2 < len(GRID)
                    and 0 <= y2 < len(GRID[0])
                    and not is_obstacle(x2, y2)
                ):
                    neighbor_height = GRID[x2][y2]
                    height_diff = abs(neighbor_height - node_height)
                    penalty = height_diff * SLOPE_PENALTY
                    neighbors.append(((x2, y2), penalty))
            neighbor_cache[(x, y)] = neighbors

    return neighbor_cache

def get_neighbors(node):
    neighbors = []
    for (x, y), penalty in neighbor_cache[(node.x, node.y)]:
        neighbors.append(Node(x, y, node, penalty))
    return neighbors

def astar():
    nodes = []
    heapq.heappush(nodes, start_node)
    visited = set()

    while nodes:
        current = heapq.heappop(nodes)

        if (current.x, current.y) in visited:
            continue
        visited.add((current.x, current.y))

        if current.x == goal_node.x and current.y == goal_node.y:
            path = []
            while current.parent:
                path.append((current.x, current.y))
                current = current.parent
            path.append((start_node.x, start_node.y))
            path.reverse()
            return path

        neighbors = get_neighbors(current)
        for neighbor in neighbors:
            heapq.heappush(nodes, neighbor)

    return []

def visualize_path(points):
    import matplotlib.pyplot as plt
    print("Visualizing Path")

    if not points:
        print("No path found.")
        return

    plt.figure(figsize=(10, 10))
    plt.imshow(GRID, cmap='hot', interpolation='nearest')

    x_coords, y_coords = zip(*points)

    plt.plot(y_coords, x_coords, color='blue', linewidth=2)

    plt.show()

    print("Path Visualized")

def run_astar():
    print("Finding Optimized Path")

    global GRID
    GRID = load(SPATIAL_HEIGHTMAP_PATH)
    (start_x, start_y), (goal_x, goal_y) = (GRID.shape[0] - 1, 0), (0, GRID.shape[1] - 1)

    global neighbor_cache
    neighbor_cache = precompute_neighbors() 

    global goal_node, start_node
    goal_node = Node(goal_x, goal_y)
    start_node = Node(start_x, start_y)

    final_path = astar()
    if final_path:
        print(final_path)
        visualize_path(final_path)
    else:
        print("No path found.")

    print("Path Generation Complete")

if __name__ == "__main__":
    run_astar()
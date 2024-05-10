from PIL import Image, ImageDraw
import heapq
from numpy import sqrt, load, exp
from pathlib import Path


SPATIAL_HEIGHTMAP_PATH = Path(__file__).parent.parent / 'data' / 'grid.npy'


class Node:
    def __init__(self, x: int, y: int, parent: "Node" = None) -> None:
        self.x = x
        self.y = y

        self.parent = parent

        self.height = GRID[x][y]

        self.g: float = 0
        self.h: float = 0
        self.f: float = 0

        if parent is not None:
            self.g = parent.new_g(self)
            self.h = self.heuristic(goal_node)
            self.f = self.g + self.h

    def __lt__(self, other: "Node") -> bool:
        return self.f < other.f

    def heuristic(self, other: "Node") -> float:
        return self.dist_btw(other)

    def dist_btw(self, other: "Node") -> float:
        return sqrt((self.x - other.x) ** 2 + (self.y - other.y) ** 2 + (self.height - other.height) ** 2)

    def new_g(self, other: "Node") -> float:
        k_dist: float = 1
        k_height: float = 1000  
        base_height_penalty: float = 50
        exp_height_penalty: float = 200  

        dist = self.dist_btw(other)
        diff = abs(self.height - other.height)
        height_penalty = base_height_penalty + exp_height_penalty * exp(-0.01 * self.height)  

        eqn = k_dist * dist + k_height * diff + height_penalty
        return eqn



def astar():
    nodes = []

    heapq.heappush(nodes, start_node)
    visited = set()

    while nodes:
        current = heapq.heappop(nodes)

        if (current.x, current.y) in visited:
            continue
        visited.add((current.x, current.y))

        if current.x == goal_node.x and current.y == goal_node.y and current.height == goal_node.height:
            path = []
            while current.parent:
                path.append((current.x, current.y, current.height))
                current = current.parent
            path.append((start_node.x, start_node.y, start_node.height))
            path.reverse()
            return path

        for dx, dy in [(0, 1), (0, -1), (1, 0), (-1, 0)]: #TODO: Create padding around areas of high heights
            x2 = current.x + dx
            y2 = current.y + dy

            if 0 <= x2 < len(GRID) and 0 <= y2 < len(GRID[0]):
                new_node = Node(x2, y2, current)
                heapq.heappush(nodes, new_node)

    return []


def visualize_path(points): 
    import matplotlib.pyplot as plt 
    print("Visualizing Path")

    plt.figure(figsize=(10, 10))
    plt.imshow(GRID, cmap='hot', interpolation='nearest')

    x_coords, y_coords = zip(*points)

    plt.plot(y_coords, x_coords, color='blue', linewidth=2)

    plt.show()

    print("Path Visualized")

    


def run_astar() -> None:
    print("Finding Optimized Path")

    global GRID
    GRID = load(SPATIAL_HEIGHTMAP_PATH)
    (start_x, start_y), (goal_x, goal_y) = (GRID.shape[0] - 1, 0), (0, GRID.shape[1] - 1)
    print(GRID)
    
    global goal_node, start_node
    goal_node = Node(goal_x, goal_y)
    start_node = Node(start_x, start_y) 

    final_path = astar()
    final_path = list(map(lambda x: (x[0], x[1]), final_path))
    print(final_path) 

    visualize_path(final_path)

    print("Path Generated") 


if __name__ == "__main__":
    run_astar() 
from PIL import Image, ImageDraw
import heapq
from numpy import sqrt, load
from pathlib import Path
from tqdm import tqdm
from concurrent.futures import ThreadPoolExecutor

HEIGHTMAP_NPY = Path(__file__).parent.parent / 'data' / 'heightmap.npy'
TIFF_PATH = Path(__file__).parent / 'rockyard.tif'

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
        k_height: float = 0.25
        height_penalty: float = 0.5

        dist: float = self.dist_btw(other)
        height: float = abs(self.height - other.height)

        penalty: float = 0.0
        if other.height > 30:
            penalty = (other.height - 140) * 1000

        eqn: float = k_dist * dist + k_height * height + height_penalty + penalty
        return eqn
    
    def __repr__(self): 
        return f"Node({self.x}, {self.y}, {self.height})"


def process_node(current, dx, dy):
    x2 = current.x + dx
    y2 = current.y + dy
    if 0 <= x2 < len(GRID) and 0 <= y2 < len(GRID[0]):
        new_node = Node(x2, y2, current)
        return new_node
    return None

def astar():
    nodes = []
    heapq.heappush(nodes, start_node)
    visited = set()
    total_nodes = len(GRID) * len(GRID[0])

    with tqdm(total=total_nodes) as pbar:
        with ThreadPoolExecutor() as executor:
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

                futures = [executor.submit(process_node, current, dx, dy) for dx, dy in [(0, 1), (0, -1), (1, 0), (-1, 0)]]
                for future in futures:
                    new_node = future.result()
                    if new_node:
                        heapq.heappush(nodes, new_node)

                pbar.update(1)
    
    return []



def run_astar(s_x, s_y, g_x, g_y) -> None:
    global GRID
    GRID = load(HEIGHTMAP_NPY)
    print(len(GRID), len(GRID[0]))

    start_x, start_y, goal_x, goal_y = s_y, s_x, g_y, g_x

    global start_node
    global goal_node
    start_node = Node(start_x, start_y)
    goal_node = Node(goal_x, goal_y)

    print(start_node, goal_node)

    final_path = astar()
    
    return final_path 

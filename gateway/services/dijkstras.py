from PIL import Image, ImageDraw
import heapq
import numpy as np
from pathlib import Path
from tqdm import tqdm
from concurrent.futures import ThreadPoolExecutor

HEIGHTMAP_NPY = Path(__file__).parent / 'heightmap.npy'
TIFF_PATH = Path(__file__).parent / 'rockyard.tif'

class Node:
    def __init__(self, x: int, y: int, parent: "Node" = None) -> None:
        self.x = x
        self.y = y
        self.parent = parent
        self.height = GRID[y][x]

        self.cost: float = 0

        if parent is not None:
            self.cost = parent.new_cost(self)

    def __lt__(self, other: "Node") -> bool:
        return self.cost < other.cost

    def dist_btw(self, other: "Node") -> float:
        return np.sqrt((self.x - other.x) ** 2 + (self.y - other.y) ** 2 + (self.height - other.height) ** 2)

    def new_cost(self, other: "Node") -> float:
        k_dist: float = 1
        k_height: float = 100
        height_penalty: float = 2 ** other.height

        dist: float = self.dist_btw(other)
        height: float = abs(self.height - other.height)

        eqn: float = k_dist * dist + k_height * height + height_penalty
        return eqn

    def __repr__(self):
        return f"Node({self.x}, {self.y}, {self.height})"

def process_node(current, dx, dy):
    x2 = current.x + dx
    y2 = current.y + dy
    if 0 <= x2 < len(GRID[0]) and 0 <= y2 < len(GRID):
        new_node = Node(x2, y2, current)
        return new_node
    return None

def dijkstra():
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

def run_dijkstra(s_x, s_y, g_x, g_y) -> None:
    global GRID
    GRID = np.load(HEIGHTMAP_NPY)

    start_x, start_y, goal_x, goal_y = s_x, s_y, g_x, g_y

    global start_node
    global goal_node
    start_node = Node(start_x, start_y)
    goal_node = Node(goal_x, goal_y)

    print(start_node, goal_node)

    final_path = dijkstra()

    return final_path

if __name__ == '__main__':
    start_x, start_y = 2445, 670
    goal_x, goal_y = 1220, 2580

    final_path = run_dijkstra(start_x, start_y, goal_x, goal_y)
    print("Final path:")
    print(final_path)

    import matplotlib.pyplot as plt
    from PIL import Image, ImageDraw

    heightmap_img = Image.open("heightmap.png")
    draw = ImageDraw.Draw(heightmap_img)

    for i in range(len(final_path) - 1):
        x1, y1, _ = final_path[i]
        x2, y2, _ = final_path[i + 1]
        draw.line((x1, y1, x2, y2), fill=(255, 0, 0), width=2)

    heightmap_img.show()
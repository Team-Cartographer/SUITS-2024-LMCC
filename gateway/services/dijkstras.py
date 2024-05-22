import heapq
import numpy as np
from pathlib import Path
from tqdm import tqdm
from concurrent.futures import ThreadPoolExecutor

HEIGHTMAP_NPY = Path(__file__).parent / 'heightmap.npy'
TIFF_PATH = Path(__file__).parent / 'rockyard.tif'

class Node:
    def __init__(self, x: int, y: int) -> None:
        self.x = x
        self.y = y
        self.height = GRID[y][x]
        self.g = float('inf')
        self.rhs = float('inf')
        self.k = 0
        self.h = self.heuristic(goal_node)

    def __lt__(self, other: "Node") -> bool:
        return self.k < other.k or (self.k == other.k and self.rhs < other.rhs)

    def heuristic(self, other: "Node") -> float:
        dx = abs(self.x - other.x)
        dy = abs(self.y - other.y)
        dz = abs(self.height - other.height)
        return (dx + dy + dz) * 1.001  # Slight overestimation

def calculate_key(node: Node) -> tuple:
    if node.rhs < node.g:
        return (node.rhs, node.rhs)
    else:
        return (node.g, node.rhs)

def get_neighbors(node: Node) -> list:
    neighbors = []
    for dx, dy in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
        x2 = node.x + dx
        y2 = node.y + dy
        if 0 <= x2 < len(GRID[0]) and 0 <= y2 < len(GRID):
            neighbors.append(NODES[y2][x2])
    return neighbors

def cost(node1: Node, node2: Node) -> float:
    k_dist: float = 1
    k_height: float = 100
    height_penalty: float = 2 ** node2.height

    dist: float = np.sqrt((node1.x - node2.x) ** 2 + (node1.y - node2.y) ** 2 + (node1.height - node2.height) ** 2)
    height: float = abs(node1.height - node2.height)

    eqn: float = k_dist * dist + k_height * height + height_penalty
    return eqn

def dstar_lite():
    global NODES
    NODES = [[Node(x, y) for x in range(len(GRID[0]))] for y in range(len(GRID))]

    start_node = NODES[start_y][start_x]
    goal_node = NODES[goal_y][goal_x]

    start_node.rhs = 0
    start_node.k = 0

    U = []
    heapq.heappush(U, (calculate_key(start_node), start_node))

    with tqdm(total=len(GRID) * len(GRID[0])) as pbar:
        while True:
            if not U:
                return []  # No path found

            current = heapq.heappop(U)[1]

            if current == goal_node:
                path = []
                node = current
                while node:
                    path.append((node.x, node.y, node.height))
                    node = min(get_neighbors(node), key=lambda n: n.g + cost(n, goal_node), default=None)
                path.reverse()
                return path

            k_old = current.k
            current.k = min(calculate_key(neighbor)[0] for neighbor in get_neighbors(current)) + cost(current, start_node)

            if current.k != k_old:
                heapq.heappush(U, (calculate_key(current), current))

            neighbors = get_neighbors(current)

            for neighbor in neighbors:
                rhs_neighbor = min(cost(neighbor, succ) + succ.g for succ in get_neighbors(neighbor))
                neighbor.rhs = min(neighbor.rhs, rhs_neighbor)

                if neighbor.rhs != neighbor.g:
                    heapq.heappush(U, (calculate_key(neighbor), neighbor))

            pbar.update(1)

def run_dstar_lite(s_x, s_y, g_x, g_y) -> None:
    global GRID, start_x, start_y, goal_x, goal_y
    GRID = np.load(HEIGHTMAP_NPY)

    start_x, start_y, goal_x, goal_y = s_x, s_y, g_x, g_y

    global goal_node
    goal_node = Node(goal_x, goal_y)

    final_path = dstar_lite()

    return final_path

if __name__ == '__main__':
    start_x, start_y = 2445, 670
    goal_x, goal_y = 1220, 2580

    final_path = run_dstar_lite(start_x, start_y, goal_x, goal_y)
    print("Final path:")
    print(final_path)

    import matplotlib.pyplot as plt
    from PIL import Image

    heightmap_img = Image.open("heightmap.png")
    heightmap_array = np.array(heightmap_img)

    fig, ax = plt.subplots(figsize=(10, 8))

    ax.imshow(heightmap_array, cmap='gray')

    for i in range(len(final_path) - 1):
        x1, y1, _ = final_path[i]
        x2, y2, _ = final_path[i + 1]
        ax.plot([x1, x2], [y1, y2], 'r-', linewidth=2)

    plt.show()
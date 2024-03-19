from PIL import Image, ImageDraw
import heapq
from numpy import sqrt, load
from typing import List, Tuple, Union


class Node:
    def __init__(self, x: int, y: int, GRID: List[List[List[float]]], goal_coords: Tuple[int, int], parent = None) -> None:
        """
        Initialize a node with coordinates, parent, height, slope, g, h, and f values.
        """

        self.x = x
        self.y = y
        self.parent = parent
        self.height = GRID[x][y][8]  # Get the height of the node from the grid
        self.slope = GRID[x][y][3]  # Get the slope of the node from the grid
        self.g: float = 0  # Cost from start node to current node
        self.h: float = 0  # Heuristic cost from current node to goal node
        self.f: float = 0  # Total cost f = g + h

        if parent is not None:
            self.g = parent.new_g(self)  # Calculate g value
            self.h = self.heuristic(goal_coords, GRID)  # Calculate h value dynamically
            self.f = self.g + self.h  # Calculate f value

    def __lt__(self, other: "Node") -> bool:
        """
        Comparison method to compare nodes based on f value.
        """

        return self.f < other.f

    def heuristic(self, goal_coords: Tuple[int, int], GRID: List[List[List[float]]]) -> float:
        """
        Calculate the heuristic value (distance) between current node and goal node.
        """

        goal_x, goal_y = goal_coords
        return sqrt((self.x - goal_x) ** 2 + (self.y - goal_y) ** 2 + (self.height - GRID[goal_x][goal_y][8]) ** 2)

    def new_g(self, other: "Node") -> float:
        """
        Calculate the new g value for the current node based on the parent node and other parameters.
        """

        k_dist: float = 1  # Distance constant
        k_slope: float = 0.25  # Slope constant
        slope_penalty: float = 0  # Slope penalty

        if other.slope >= 15:
            slope_penalty = 100
        elif other.slope >= 8:
            slope_penalty = 5

        dist: float = sqrt((self.x - other.x) ** 2 + (self.y - other.y) ** 2)  # Distance between nodes
        slope: float = abs(self.slope - other.slope)  # Absolute difference in slope
        eqn: float = k_dist * dist + k_slope * slope + slope_penalty  # Equation to calculate g value
        return eqn


class BreakIt(Exception):
    pass


def astar(start_node: Node, goal_coords: Tuple[int, int], GRID: List[List[List[float]]]) -> Union[List[Tuple[int, int, int]], None]:
    """
    A* search algorithm to find the optimal path from start node to goal node in a grid.
    """

    nodes: List[Node] = []  # Priority queue for nodes
    heapq.heappush(nodes, start_node)  # Add start node to the priority queue
    visited = set()  # Set to store visited nodes

    while nodes:
        current = heapq.heappop(nodes)  # Pop node with the lowest f value from the priority queue

        if (current.x, current.y) in visited:
            continue
        visited.add((current.x, current.y))

        if current.x == goal_coords[0] and current.y == goal_coords[1] and current.height == GRID[goal_coords[0]][goal_coords[1]][8]:
            # If goal node is reached, construct and return the path
            path = []
            while current.parent:
                path.append((current.x, current.y, current.height))
                current = current.parent
            path.append((start_node.x, start_node.y, start_node.height))
            path.reverse()
            return path


        # Expand current node's neighbors
        for dx, dy in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
            x2 = current.x + dx
            y2 = current.y + dy
            if 0 <= x2 < len(GRID) and 0 <= y2 < len(GRID[0]):
                new_node = Node(x2, y2, GRID, goal_coords, current)
                heapq.heappush(nodes, new_node)

    return None

def run_astar(sv, goal_coords: Tuple[int, int], GRID: List[List[List[float]]]) -> None:
    """
    Main function to run the A* algorithm.
    """

    print("Finding a suitable lunar path")
    SIZE = sv.size
    (x, y) = get_pathfinding_endpoints()
    start_node = Node(x, y, GRID, goal_coords)
    final_path = astar(start_node, goal_coords, GRID)

    print("Initial path generated")

    if final_path:
        generate_image(final_path, SIZE)  # Pass SIZE to generate_image

def get_pathfinding_endpoints() -> Tuple[int, int]:
    """
    Helper function to get the start and end points for pathfinding.
    """

    x = int(input("Enter x coordinate: "))
    y = int(input("Enter y coordinate: "))
    return (x, y)

def generate_image(final_path: List[Tuple[int, int, int]], SIZE: Tuple[int, int]) -> None:
    """
    Generate an image of the optimal path using Pillow library.
    """

    img = Image.new("RGB", (SIZE[0], SIZE[1]), color="white")  # Create a new image
    draw = ImageDraw.Draw(img)  # Create a drawing context
    for node in final_path:
        draw.point((node[0], node[1]), fill="blue")  # Draw blue points for the path nodes
    img.show()  # Display the image


if __name__ == "__main__":
    pass

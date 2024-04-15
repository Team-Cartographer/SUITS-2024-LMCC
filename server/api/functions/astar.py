from PIL import Image, ImageDraw
import heapq
from numpy import sqrt, load
from typing import Dict, List, Tuple, Union
from collections import defaultdict


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


def parse_obj_file(file_path: str) -> Tuple[Dict[str, List[List[float]]], Tuple[float, float, float]]:
    """
    Parse a .obj file and convert it into a 3D grid for the A* algorithm. 
    Returns a tuple containing: a dictionary containing vertices, faces, and normal vectors, 
                                and the size of the grid as a tuple (x_range, y_range, z_range).
    """
    data = defaultdict(list)
    min_coords = [float('inf')] * 3
    max_coords = [float('-inf')] * 3

    with open(file_path, 'r') as file:
        for line in file:
            parts = line.split()

            if not parts:
                continue

            if parts[0] == 'v':  # Vertex data
                vertex = list(map(float, parts[1:]))
                data['vertices'].append(vertex)

                # Update min and max coordinates
                for i in range(3):
                    min_coords[i] = min(min_coords[i], vertex[i])
                    max_coords[i] = max(max_coords[i], vertex[i])

            elif parts[0] == 'f':  # Face data
                data['faces'].append(list(map(int, parts[1:])))
            elif parts[0] == 'vn':  # Normal vector data
                data['normals'].append(list(map(float, parts[1:])))


    size = tuple(max_coord - min_coord for min_coord, max_coord in zip(min_coords, max_coords)) # Grid size

    return data, size



def run_astar(file_path: str, goal_coords: Tuple[int, int]) -> None:
    """
    Main function to run the A* algorithm.
    """

    print("Parsing .obj file")
    data, size = parse_obj_file(file_path)
    
    print("Finding a suitable lunar path")
    start_coords, end_coords = get_pathfinding_endpoints(data['vertices'])
    start_node = Node(*start_coords, data, end_coords)
    final_path = astar(start_node, end_coords, data)

    print("Initial path generated")

    if final_path:
        generate_image(final_path, size)



def get_pathfinding_endpoints(vertices: List[List[float]]) -> Tuple[Tuple[float, float, float], Tuple[float, float, float]]:
    """
    Helper function to get the start and end points for pathfinding.
    """

    min_vertex = min(vertices, key=lambda v: (v[0], v[1], v[2]))
    max_vertex = max(vertices, key=lambda v: (v[0], v[1], v[2]))

    return (min_vertex[0], min_vertex[1], min_vertex[2]), (max_vertex[0], max_vertex[1], max_vertex[2])

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

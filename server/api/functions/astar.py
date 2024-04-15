from PIL import Image, ImageDraw
import heapq
from numpy import sqrt, load
from typing import Dict, List, Tuple, Union
from collections import defaultdict


class Node:
    def __init__(self, x: float, y: float, z: float, graph: Dict[Tuple[float, float, float], List[Tuple[float, float, float]]], goal_coords: Tuple[float, float, float]):
        self.position = (x, y, z)
        self.graph = graph
        self.goal_coords = goal_coords

        self.g = 0  # Cost from start to current node
        self.h = self.heuristic()  # Heuristic cost from current node to goal
        self.f = self.g + self.h  # Total cost

        self.parent = None  # Parent node

    def heuristic(self):
        # Use Euclidean distance as heuristic
        return ((self.position[0] - self.goal_coords[0]) ** 2 + (self.position[1] - self.goal_coords[1]) ** 2 + (self.position[2] - self.goal_coords[2]) ** 2) ** 0.5

    def get_neighbors(self):
        # Get the neighbors of the node from the graph
        return [Node(*neighbor, self.graph, self.goal_coords) for neighbor in self.graph[self.position]]


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



def convert_to_graph(data: Dict[str, List[List[float]]]) -> Dict[Tuple[float, float, float], List[Tuple[float, float, float]]]:
    """
    Convert the parsed .obj file data into a graph.

    Parameters:
    - data: The parsed .obj file data.

    Returns:
    - A graph where each vertex is a node and each face is an edge connecting the vertices.
    """
    graph = defaultdict(list)

    for face in data['faces']:
        for i in range(len(face)):
            v1 = tuple(data['vertices'][face[i-1] - 1])
            v2 = tuple(data['vertices'][face[i] - 1])
            graph[v1].append(v2)
            graph[v2].append(v1)

    return graph



def parse_obj_file(file_path: str) -> Tuple[Dict[str, List[List[float]]], Tuple[float, float, float]]:
    """
    Parse a .obj file and convert it into a 3D grid for the A* algorithm.

    Parameters:
    - file_path: The path to the .obj file.

    Returns:
    - A dictionary containing vertices, faces, and normal vectors.
    - The size of the grid as a tuple (x_range, y_range, z_range).
    """
    data = defaultdict(list)
    min_coords = [float('inf')] * 3
    max_coords = [float('-inf')] * 3

    with open(file_path, 'r') as file:
        for line in file:
            parts = line.split()

            if not parts:
                continue

            try:
                if parts[0] == 'v':  # Vertex data
                    vertex = list(map(float, parts[1:]))
                    data['vertices'].append(vertex)

                    # Update min and max coordinates
                    for i in range(3):
                        min_coords[i] = min(min_coords[i], vertex[i])
                        max_coords[i] = max(max_coords[i], vertex[i])

                elif parts[0] == 'f':  # Face data
                    # Split on slashes and only keep the vertex index
                    face = [int(part.split('/')[0]) for part in parts[1:]]
                    data['faces'].append(face)

                elif parts[0] == 'vn':  # Normal vector data
                    data['normals'].append(list(map(float, parts[1:])))
            except ValueError as e:
                print(f"Error parsing line '{line.strip()}': {e}")
                continue

    if not data['vertices'] or not data['faces']:
        raise ValueError("Missing vertices or faces in .obj file")

    size = tuple(max_coord - min_coord for min_coord, max_coord in zip(min_coords, max_coords))

    return data, size


def run_astar(file_path: str, goal_coords: Tuple[int, int]) -> None:
    """
    Main function to run the A* algorithm.
    """

    print("Parsing .obj file")
    try:
        data, size = parse_obj_file(file_path)
    except ValueError as e:
        print(f"Error parsing .obj file: {e}")
        return

    print("Converting to graph")
    graph = convert_to_graph(data)

    print("Finding a suitable lunar path")
    try:
        start_coords, end_coords = get_pathfinding_endpoints(data['vertices'])
    except ValueError as e:
        print(f"Error finding pathfinding endpoints: {e}")
        return

    start_node = Node(*start_coords, graph, end_coords)
    final_path = astar(start_node, end_coords, graph)

    print("Initial path generated")

    if final_path:
        generate_image(final_path, size)  # Pass size to generate_image



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
    run_astar("spatial_mapping.obj", (0, 0))  # Run the A* algorithm

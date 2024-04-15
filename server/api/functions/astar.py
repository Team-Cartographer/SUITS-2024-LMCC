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
    
    


def astar(start_node: Node, goal_coords: Tuple[float, float, float], graph: Dict[Tuple[float, float, float], List[Tuple[float, float, float]]]) -> Union[List[Tuple[float, float, float]], None]:
    """
    A* algorithm.
    """
    open_list = [start_node]
    closed_list = []

    while open_list:
        current_node = min(open_list, key=lambda node: node.f)

        if current_node.position == goal_coords:
            path = []
            while current_node is not None:
                path.append(current_node.position)
                current_node = current_node.parent
            return path[::-1]

        open_list.remove(current_node)
        closed_list.append(current_node)

        for neighbor in current_node.get_neighbors():
            if neighbor in closed_list:
                continue

            if neighbor not in open_list:
                open_list.append(neighbor)
            else:
                if current_node.g + 1 < neighbor.g:
                    neighbor.g = current_node.g + 1
                    neighbor.f = neighbor.g + neighbor.h
                    neighbor.parent = current_node

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

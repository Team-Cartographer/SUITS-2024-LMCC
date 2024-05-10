from PIL import Image, ImageDraw
import heapq
import numpy as np
from typing import Tuple
from scipy.sparse import lil_matrix


class PriorityQueue:
    def __init__(self):
        self.elements = []

    def empty(self):
        return not self.elements

    def put(self, item, priority):
        heapq.heappush(self.elements, (priority, item))

    def get(self):
        return heapq.heappop(self.elements)[1]

    def contains(self, item):
        return any(element[1] == item for element in self.elements)


class Node:
    def __init__(self, x: float, y: float, z: float, adjacency_matrix: np.ndarray, vertices: np.ndarray, goal_coords: np.ndarray):
        self.position = np.array([x, y, z])
        self.adjacency_matrix = adjacency_matrix
        self.vertices = vertices
        self.goal_coords = goal_coords

        self.g = 0  
        self.h = self.heuristic()  
        self.f = self.g + self.h  

        self.parent = None  

    def heuristic(self):
        return np.linalg.norm(self.position - self.goal_coords)

    def get_neighbors(self):
        position_indices = np.where((self.vertices == self.position).all(axis=1))
        if position_indices[0].size == 0:
            return []

        position_index = position_indices[0][0]

        neighbors = np.argwhere(self.adjacency_matrix[position_index, :]).flatten()
        return [Node(*self.vertices[neighbor], self.adjacency_matrix, self.vertices, self.goal_coords) for neighbor in neighbors]

    def __lt__(self, other):
        return self.f < other.f


def astar(start_node: Node, goal_coords: np.ndarray, adjacency_matrix: np.ndarray, vertices: np.ndarray) -> np.ndarray:
    open_list = PriorityQueue()
    open_list.put(start_node, start_node.f)
    closed_list = set()

    while not open_list.empty():
        current_node = open_list.get()

        if np.array_equal(current_node.position, goal_coords):
            path = []
            while current_node is not None:
                path.append(current_node.position)
                current_node = current_node.parent
            return np.array(path[::-1])

        closed_list.add(current_node)

        for neighbor in current_node.get_neighbors():
            if neighbor in closed_list or open_list.contains(neighbor):
                continue

            neighbor.g = current_node.g + 1
            neighbor.f = neighbor.g + neighbor.h
            neighbor.parent = current_node
            open_list.put(neighbor, neighbor.f)

    return np.array([])


def convert_to_adjacency_matrix(data: dict) -> Tuple[np.ndarray, np.ndarray]:
    """
    Convert the parsed .obj file data into an adjacency matrix.

    Parameters:
    - data: The parsed .obj file data.

    Returns:
    - An adjacency matrix representing the graph.
    - An array of vertex coordinates.
    """
    vertices = np.array(data['vertices'])
    num_vertices = len(vertices)
    adjacency_matrix = lil_matrix((num_vertices, num_vertices), dtype=bool)

    for face in data['faces']:
        for i in range(len(face)):
            v1 = face[i-1] - 1
            v2 = face[i] - 1
            adjacency_matrix[v1, v2] = True
            adjacency_matrix[v2, v1] = True

    print(adjacency_matrix)
    return adjacency_matrix.tocsr(), vertices


def parse_obj_file(file_path: str) -> dict:
    """
    Parse a .obj file and convert it into a dictionary containing vertices, faces, and normal vectors.

    Parameters:
    - file_path: The path to the .obj file.

    Returns:
    - A dictionary containing vertices, faces, and normal vectors.
    """
    data = {'vertices': [], 'faces': [], 'normals': []}

    with open(file_path, 'r') as file:
        for line in file:
            parts = line.split()

            if not parts:
                continue

            try:
                if parts[0] == 'v':  # Vertex data
                    data['vertices'].append(list(map(float, parts[1:])))

                elif parts[0] == 'f':  # Face data
                    face = [int(part.split('/')[0]) for part in parts[1:]]
                    data['faces'].append(face)

                elif parts[0] == 'vn':  # Normal vector data
                    data['normals'].append(list(map(float, parts[1:])))
            except ValueError:
                continue

    if not data['vertices'] or not data['faces']:
        raise ValueError("Missing vertices or faces in .obj file")

    return data


def run_astar(file_path: str) -> None:
    """
    Main function to run the A* algorithm.
    """
    print("Parsing .obj file")
    data = parse_obj_file(file_path)
    # print(data)

    print("Converting to adjacency matrix")
    adjacency_matrix, vertices = convert_to_adjacency_matrix(data)
    print(adjacency_matrix)
    print("vertices", vertices)

    print("Finding a suitable lunar path")
    start_coords = np.min(vertices, axis=0)
    end_coords = np.max(vertices, axis=0)

    start_node = Node(*start_coords, adjacency_matrix, vertices, end_coords)
    # print(start_node.position)
    final_path = astar(start_node, end_coords, adjacency_matrix, vertices)

    print("Initial path generated")

    if final_path.size > 0:
        generate_image(final_path, vertices)
    else:
        print("No path found.")


def generate_image(final_path: np.ndarray, vertices: np.ndarray) -> None:
    """
    Generate an image of the optimal path using Pillow library.
    """
    min_coords = np.min(vertices, axis=0)
    max_coords = np.max(vertices, axis=0)
    SIZE = (int(max_coords[0] - min_coords[0]), int(max_coords[1] - min_coords[1]))

    img = Image.new("RGB", SIZE, color="white")  
    draw = ImageDraw.Draw(img)  
    for node in final_path:
        draw.point((int(node[0] - min_coords[0]), int(node[1] - min_coords[1])), fill="blue")
    img.show()


if __name__ == "__main__":
    run_astar("SpatialMapping.obj")  
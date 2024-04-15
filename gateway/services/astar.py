from collections import defaultdict
import heapq
from typing import Dict, List, Tuple, Union
import numpy as np
from tqdm import tqdm

class EfficientPriorityQueue:
    def __init__(self):
        self.elements = []
        self.element_set = set()

    def empty(self):
        return not self.elements

    def put(self, item, priority):
        heapq.heappush(self.elements, (priority, item))
        self.element_set.add(item)

    def get(self):
        _, item = heapq.heappop(self.elements)
        self.element_set.remove(item)
        return item

    def contains(self, item):
        return item in self.element_set

class Node:
    def __init__(self, position: Tuple[float, float, float], goal_coords: Tuple[float, float, float]):
        self.position = position
        self.goal_coords = goal_coords
        self.g = 0
        self.h = self.heuristic()
        self.f = self.g + self.h
        self.parent = None

    def heuristic(self):
        return np.linalg.norm(np.array(self.position) - np.array(self.goal_coords))

    def __lt__(self, other):
        return self.f < other.f

def astar(start_coords: Tuple[float, float, float], goal_coords: Tuple[float, float, float], graph: Dict[Tuple[float, float, float], List[Tuple[float, float, float]]]) -> Union[List[Tuple[float, float, float]], None]:
    start_node = Node(start_coords, goal_coords)
    open_list = EfficientPriorityQueue()
    open_list.put(start_node, start_node.f)
    closed_set = set()

    while not open_list.empty():
        current_node = open_list.get()

        if current_node.position == goal_coords:
            path = []
            while current_node is not None:
                path.append(current_node.position)
                current_node = current_node.parent
            return path[::-1]

        closed_set.add(current_node.position)

        for neighbor_position in tqdm(graph[current_node.position]):
            if neighbor_position in closed_set:
                continue

            neighbor_node = Node(neighbor_position, goal_coords)
            tentative_g = current_node.g + np.linalg.norm(np.array(neighbor_position) - np.array(current_node.position))

            if open_list.contains(neighbor_node) and tentative_g >= neighbor_node.g:
                continue

            neighbor_node.parent = current_node
            neighbor_node.g = tentative_g
            neighbor_node.f = neighbor_node.g + neighbor_node.h

            if not open_list.contains(neighbor_node):
                open_list.put(neighbor_node, neighbor_node.f)

    return None

def convert_to_graph(data: Dict[str, List[List[float]]]) -> Dict[Tuple[float, float, float], List[Tuple[float, float, float]]]:
    graph = defaultdict(list)
    for face in data['faces']:
        for i in range(len(face)):
            v1 = tuple(data['vertices'][face[i-1] - 1])
            v2 = tuple(data['vertices'][face[i] - 1])
            graph[v1].append(v2)
            graph[v2].append(v1)
    return graph

def parse_obj_file(file_path: str) -> Tuple[Dict[str, List[List[float]]], Tuple[float, float, float]]:
    data = defaultdict(list)
    min_coords = [float('inf')] * 3
    max_coords = [float('-inf')] * 3

    with open(file_path, 'r') as file:
        for line in file:
            parts = line.split()
            if not parts:
                continue
            if parts[0] == 'v':
                vertex = list(map(float, parts[1:]))
                data['vertices'].append(vertex)
                for i in range(3):
                    min_coords[i] = min(min_coords[i], vertex[i])
                    max_coords[i] = max(max_coords[i], vertex[i])
            elif parts[0] == 'f':
                face = [int(part.split('/')[0]) for part in parts[1:]]
                data['faces'].append(face)

    size = tuple(max_coord - min_coord for min_coord, max_coord in zip(min_coords, max_coords))
    return data, size

def get_pathfinding_endpoints(vertices: List[List[float]]) -> Tuple[Tuple[float, float, float], Tuple[float, float, float]]:
    min_vertex = min(vertices, key=lambda v: (v[0], v[1], v[2]))
    max_vertex = max(vertices, key=lambda v: (v[0], v[1], v[2]))
    return tuple(min_vertex), tuple(max_vertex)

def run_astar(file_path: str, goal_coords: Tuple[float, float, float]) -> None:
    print("Parsing .obj file")
    data, _ = parse_obj_file(file_path)

    print("Converting to graph")
    graph = convert_to_graph(data)

    print("Finding a suitable path")
    start_coords, end_coords = get_pathfinding_endpoints(data['vertices'])

    print("Executing A* Algorithm")
    final_path = astar(start_coords, end_coords, graph)

    if final_path:
        print("Path found:", final_path)
    else:
        print("No path found")

if __name__ == "__main__":
    run_astar("SpatialMapping.obj", (0, 0, 0))

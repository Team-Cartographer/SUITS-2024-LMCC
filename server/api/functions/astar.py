import numpy as np
from typing import List, Tuple
import heapq
from .imaging import draw_path_image
from typing import List, Tuple, Optional
import heapq
import numpy as np

"""
Just an fyi, this version of A* will not work for what we want! I ran into this same issue for the adc. It works for 2 dimensions
of evenly spaced nodes, however when a third dimension is added and the nodes are no longer evenly spaced, the algorithm can not know
which nodes are its "neighbors" and must be fed that information. Luckily, I already solved this problem in the ADC, however I will
not be able to modify that code and add it to this new implementation until I have a list and format of the data. @ me for more questions
    -JL
"""

class Node:
    def __init__(self, parent: 'Node' = None, position: Tuple[int, int] = None):
        self.parent: Node = parent
        self.position: Tuple[int, int] = position
        self.cost_to_reach: float = 0
        self.total_cost: float = 0
        self.heuristic_cost: float = 0
        
    def __eq__(self, compare: 'Node') -> bool:
        'Compare nodes based on their positions'
        return self.position == compare.position
    
    def __lt__(self, compare: 'Node') -> bool:
        'Define the order of nodes based on their total cost (for priority queue)'
        return self.cost_to_reach < compare.cost_to_reach

    
def a_star(grid: List[List[float]], start: Tuple[int, int], end: Tuple[int, int]) -> Optional[List[Tuple[int, int]]]:
    start_node: Node = Node(None, start)
    end_node: Node = Node(None, end)
    
    open_list: List[Tuple[float, Node]] = []
    closed_list: List[Node] = []
    
    # Add the start node to the open list
    heapq.heappush(open_list, (start_node.total_cost, start_node))

    while len(open_list) > 0:
        # Pop the node with the lowest cost from open list
        current_node: Node = heapq.heappop(open_list)[1]
        closed_list.append(current_node)
        
        # Check if we have reached the end, return the path
        if current_node == end_node:
            path: List[Tuple[int, int]] = []
            current: Node = current_node
            while current is not None:
                path.append(current.position)
                current = current.parent
            return path[::-1]  # Return reversed path
        
        children: List[Node] = []
        for new_position in [(0, -1), (0, 1), (-1, 0), (1, 0)]: # Check adjacent squares
            node_position: Tuple[int, int] = (current_node.position[0] + new_position[0], current_node.position[1] + new_position[1])

            # Make sure node is within range (grid boundaries)
            if node_position[0] > (len(grid) - 1) or node_position[0] < 0 or node_position[1] > (len(grid[len(grid)-1]) -1) or node_position[1] < 0:
                continue

            new_node: Node = Node(current_node, node_position)
            children.append(new_node)
            
        for child in children:
            if child in closed_list:
                continue

            # Calculate costs
            child.cost_to_reach = current_node.cost_to_reach + grid[child.position[0]][child.position[1]]
            child.heuristic_cost = ((child.position[0] - end_node.position[0]) ** 2) + ((child.position[1] - end_node.position[1]) ** 2)
            child.total_cost = child.cost_to_reach + child.heuristic_cost

            if len([i for i in open_list if child == i[1] and child.cost_to_reach > i[1].cost_to_reach]) > 0:
                continue

            heapq.heappush(open_list, (child.total_cost, child))

    return None


def create_random_test_grid(grid_size: int) -> Tuple[np.ndarray, Tuple[int, int], Tuple[int, int]]:
    'Generates random square test grid in specified size'
    grid: np.ndarray = np.random.randint(1, 10, size=(grid_size, grid_size))
    start: Tuple[int, int] = (grid_size - 1, 0)
    end: Tuple[int, int] = (0, grid_size - 1)
    
    return (grid, start, end)



if __name__ == "__main__":
    # Generate a random test grid with size 50x50
    path_data: Tuple[np.ndarray, Tuple[int, int], Tuple[int, int]] = create_random_test_grid(50)
    grid, start, end = path_data

    # Find the optimal path using the A* algorithm
    path: Optional[List[Tuple[int, int]]] = a_star(grid, start, end)

    # If a path is found, print it
    if path:
        print("Optimal path found:", path)
    # If no path is found, print a message indicating so
    else:
        print('No optimal path found')
    # print(path)
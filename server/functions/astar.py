import numpy as np


class Node:
    def __init__(self, parent=None, position=None):
        self.parent = parent
        self.position = position
        self.cost_to_reach = 0
        self.total_cost = 0
        self.heuristic_cost = 0
        
    def __eq__(self, compare):
        return self.position == compare.position
    
    def __lt__(self, compare):
        return self.cost_to_reach < compare.cost_to_reach
        





if __name__ == "__main__":
    print("A* goes here")
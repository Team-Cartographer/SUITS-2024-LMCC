import numpy as np
import networkx as nx
import math

matrix = np.load("heightmap.npy")

print(matrix.shape)

G = nx.Graph()

# Get the number of rows and columns in the matrix
rows = len(matrix)
cols = len(matrix[0])

start_point = (0, 0)
end_point = (2, 2)


def weight(p, q, m, k):
    return math.fabs(matrix[p][q] - matrix[m][k])

def dist(a, b):
    (x1, y1) = a
    (x2, y2) = b
    return ((x1 - x2) ** 2 + (y1 - y2) ** 2) ** 0.5

# Add nodes and edges to the graph
for i in range(rows):
    for j in range(cols):
        # Add a node for each element in the matrix
        G.add_node((i, j), value=matrix[i][j])

        # Connect to the right neighbor
        if j + 1 < cols:
            G.add_edge((i, j), (i, j + 1), weight=weight(i, j, i, j + 1))

        # Connect to the bottom neighbor
        if i + 1 < rows:
            G.add_edge((i, j), (i + 1, j), weight=weight(i, j, i + 1, j))

        # Connect to the bottom-right diagonal neighbor
        if i + 1 < rows and j + 1 < cols:
            G.add_edge((i, j), (i + 1, j + 1), weight=weight(i, j, i + 1, j + 1))

        # Connect to the bottom-left diagonal neighbor
        if i + 1 < rows and j - 1 >= 0:
            G.add_edge((i, j), (i + 1, j - 1), weight=weight(i, j, i + 1, j - 1))
print(G)
nx.astar_path(G, start_point, end_point, dist, "weight")

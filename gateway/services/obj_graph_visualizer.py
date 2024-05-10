import matplotlib.pyplot as plt
import networkx as nx
import numpy as np

def visualize_graph(vertices, adjacency_matrix):
    G = nx.Graph()

    for i, vertex in enumerate(vertices):
        G.add_node(i, pos=(vertex[0], vertex[1])) 

    non_zero_indices = adjacency_matrix.nonzero()
    for i, j in zip(*non_zero_indices):
        G.add_edge(i, j)

    pos = nx.get_node_attributes(G, 'pos')
    nx.draw(G, pos, with_labels=True)

    plt.show()
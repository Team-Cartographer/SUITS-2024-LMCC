import matplotlib.pyplot as plt
import networkx as nx
from mpl_toolkits.mplot3d import Axes3D

def visualize_graph(vertices, adjacency_matrix):
    G = nx.Graph()

    for i, vertex in enumerate(vertices):
        G.add_node(i, pos=vertex)

    non_zero_indices = adjacency_matrix.nonzero()
    for i, j in zip(*non_zero_indices):
        G.add_edge(i, j)

    pos = nx.get_node_attributes(G, 'pos')

    fig = plt.figure()
    ax = fig.add_subplot(111, projection='3d')

    for node in G.nodes:
        ax.scatter(*pos[node], color='b')

    for edge in G.edges:
        x = [pos[edge[0]][0], pos[edge[1]][0]]
        y = [pos[edge[0]][1], pos[edge[1]][1]]
        z = [pos[edge[0]][2], pos[edge[1]][2]]
        ax.plot(x, y, z, color='r')

    plt.show()
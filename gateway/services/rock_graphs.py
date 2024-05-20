import json
import matplotlib.pyplot as plt
import os

os.makedirs('rock_graphs', exist_ok=True)

with open('rock_data.json') as f:
    data = json.load(f)

for rock in data['ROCKS']:
    rock_data = rock['data']
    rock_name = rock['name']
    rock_id = str(rock['id'])

    fig, ax = plt.subplots(figsize=(8, 4))

    keys = list(rock_data.keys())
    values = list(rock_data.values())

    ax.barh(keys, values, height=0.5)

    ax.set_title(f'Composition of {rock_name}', fontsize=12)
    ax.set_xlabel('Percentage', fontsize=10)
    ax.set_ylabel('Component', fontsize=10)

    plt.subplots_adjust(left=0.2)

    plt.tight_layout()
    plt.savefig(os.path.join('rock_graphs', f'{rock_id}.png'))
    plt.close()
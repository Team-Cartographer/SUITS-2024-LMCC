from pathlib import Path 
from PIL import Image 
import numpy as np 

HEIGHTMAP_IMG_PATH = Path(__file__).parent / 'heightmap.png'

import matplotlib.pyplot as plt

image = Image.open(HEIGHTMAP_IMG_PATH)
image_array = np.array(image)
norm = (image_array - np.min(image_array)).T[0].T
norm.reshape(-1, 1)

plt.imshow(norm, cmap='gray')
plt.show()

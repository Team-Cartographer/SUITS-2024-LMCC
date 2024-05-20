# from pathlib import Path 
# from PIL import Image 
# import numpy as np 

# HEIGHTMAP_IMG_PATH = Path(__file__).parent / 'heightmap.png'

# import matplotlib.pyplot as plt

# image = Image.open(HEIGHTMAP_IMG_PATH)
# image_array = np.array(image)
# norm = (image_array - np.min(image_array)).T[0].T
# norm.reshape(-1, 1)

# plt.imshow(norm, cmap='gray')
# plt.show()

from pathlib import Path
from PIL import Image
from matplotlib import pyplot as plt
import numpy as np

HEIGHTMAP_IMG_PATH = Path(__file__).parent / 'heightmap.png'

image = Image.open(HEIGHTMAP_IMG_PATH).convert('L')
image_array = np.array(image)

np.save('heightmap.npy', image_array)

plt.figure(figsize=(10, 8))
plt.imshow(image_array, cmap='gray')
plt.colorbar()
plt.title('Heightmap Array')
plt.show()

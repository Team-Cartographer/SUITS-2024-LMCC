from PIL import Image, ImageDraw
import numpy as np

def draw_path_image(grid: np.ndarray, path: list[tuple[int, int]], start: tuple[int, int], end: tuple[int, int]) -> Image.Image:
    """
    Creates an image representation of a path on a grid.

    Parameters:
    - grid (np.ndarray): A 2D array-like structure representing the grid with weightings at each node.
    - path (list[tuple[int, int]]): A list of tuples representing the coordinates of the path on the grid.
    - start (tuple[int, int]): A tuple representing the starting coordinate on the grid.
    - end (tuple[int, int]): A tuple representing the end coordinate on the grid.

    Returns:
    - An Image object representing the grid with the path, start point, and end point visually marked.
    """
    scale: int = 20  # Increase the scaling factor for a higher definition image if needed
    img: Image.Image = Image.new("RGB", (grid.shape[1] * scale, grid.shape[0] * scale), "white")
    draw: ImageDraw.ImageDraw = ImageDraw.Draw(img)

    # Draw the grid (with node weightings)
    for y in range(grid.shape[0]):
        for x in range(grid.shape[1]):
            color: int = int(255 - grid[y][x] * 255 / 9)  # Darker for higher values
            draw.rectangle([x*scale, y*scale, (x+1)*scale-1, (y+1)*scale-1], fill=(color, color, color))


    # Draw the found path
    for position in path:
        x, y = position
        draw.rectangle([x*scale, y*scale, (x+1)*scale-1, (y+1)*scale-1], fill="#89A1EF")

    # Draw the start and end points in green and red, respectively
    draw.rectangle([start[1]*scale, start[0]*scale, (start[1]+1)*scale-1, (start[0]+1)*scale-1], fill="green")
    draw.rectangle([end[1]*scale, end[0]*scale, (end[1]+1)*scale-1, (end[0]+1)*scale-1], fill="red")

    return img

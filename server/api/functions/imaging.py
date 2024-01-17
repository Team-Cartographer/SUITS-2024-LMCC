from typing import Any
from PIL import Image, ImageDraw


def draw_path_image(grid: Any, path: list[tuple[int, int]], start: tuple[int, int], end: tuple[int, int]) -> Image:
    scale = 20  # Increase the scaling factor for a higher definition image if needed
    img = Image.new("RGB", (grid.shape[1] * scale, grid.shape[0] * scale), "white")
    draw = ImageDraw.Draw(img)


    # Draw the grid (with node weightings)
    for y in range(grid.shape[0]):
        for x in range(grid.shape[1]):
            color = int(255 - grid[y][x] * 255 / 9)  # Darker for higher values
            draw.rectangle([x*scale, y*scale, (x+1)*scale-1, (y+1)*scale-1], fill=(color, color, color))


    # Draw the found path
    for position in path:
        x, y = position
        draw.rectangle([x*scale, y*scale, (x+1)*scale-1, (y+1)*scale-1], fill="#89A1EF")

    # Draw the start and end points in green and red, respectively
    draw.rectangle([start[1]*scale, start[0]*scale, (start[1]+1)*scale-1, (start[0]+1)*scale-1], fill="green")
    draw.rectangle([end[1]*scale, end[0]*scale, (end[1]+1)*scale-1, (end[0]+1)*scale-1], fill="red")

    return img
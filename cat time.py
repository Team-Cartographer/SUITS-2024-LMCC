import tkinter as tk

def remove_pin(event):
    if event.widget.winfo_class() == 'Pin':
        event.widget.destroy()
        update_geojson()

def update_geojson():
    # this function to update the GeoJSON data
    # and send it to the server to remove the pin permanently
    pass  # Add your implementation here

def update_pin_positions():
    # put this function to adjust the positions of pins
    # based on the new dimensions of the map or interface
    pass  # Add your implementation here

root = tk.Tk()
root.geometry("800x600")

canvas = tk.Canvas(root, bg="white")
canvas.pack(fill=tk.BOTH, expand=True)

canvas.bind("<Button-1>", remove_pin)
root.bind("<Configure>", lambda event: update_pin_positions())

# Create a pin 
pin = canvas.create_oval(100, 100, 120, 120, fill="red", outline="black", tags="Pin")

root.mainloop()

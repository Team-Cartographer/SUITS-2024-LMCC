import tkinter as tk
import tkinter.messagebox as messagebox
import re
from urllib.parse import urlparse
from json import dump
from pathlib import Path

def save_to_json(data):
    with open("config/tss_data.json", "w") as file:
        dump(data, file, indent=4)

class StartupWindow:
    def __init__(self):
        self.url = ""
        self.root = tk.Tk()
        self.root.title("Team Cartographer LMCC Server Startup")

        label = tk.Label(self.root, text="Enter Your TSS Server URL:")
        label.pack(pady=(10, 0))

        self.url_entry = tk.Entry(self.root, width=50)
        self.url_entry.pack(padx=20, pady=10)
        self.url_entry.bind("<Return>", self.submit_url)

        submit_button = tk.Button(self.root, text="Submit", command=self.submit_url)
        submit_button.pack(pady=(0, 10))

    def submit_url(self, _=None):
        self.url = self.url_entry.get()
        pattern = r'^http://(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}):14141/?$'
        if re.match(pattern, self.url):
            print(f"TSS Server URL: {self.url}")
            parsed_url = urlparse(self.url)
            host = parsed_url.hostname
            port = parsed_url.port
            url_data = {
                "TSS_URL": self.url,
                "TSS_HOST": host,
                "TSS_PORT": port
            }
            save_to_json(url_data)
            self.root.destroy()  
        else:
            messagebox.showinfo("Error", "Invalid URL. Please enter a URL in the correct format.")

    def on_close(self):
        messagebox.showinfo("Requirement", "Enter a URL and Click Submit")

    def run(self):
        self.root.protocol("WM_DELETE_WINDOW", self.on_close)
        self.url_entry.focus_set()
        self.root.mainloop()


if __name__ == "__main__":
    data_path = Path(__file__).parent / 'tss_data.json'
    if data_path.exists():
        exit(0)
    else:
        StartupWindow().run()


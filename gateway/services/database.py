import json
from logging import getLogger


log = getLogger(__name__)


class JSONDatabase(dict):
    """
    A dictionary which operates together with a JSON file.
    Data is initially loaded from a JSON file and can be saved back to the file.
    You should not modify this class.
    """

    def __init__(self, path: str):
        """Initialize the database with the file data at the given path."""
        super().__init__()
        self._path = path

        log.info(f"\tStarting {path} Database")

    def __setitem__(self, key: str, value) -> None:
        if not isinstance(key, str):
            raise TypeError(f"Database key must be str, not {type(key)}")
        return super().__setitem__(key, value)

    def close(self) -> None:
        """Save database by writing to file."""
        if self._path: 
            log.info("Saving database to file")
            with open(self._path, "w") as file:
                json.dump(self, file, indent="\t")



class ListCache(list):
    def __init__(self, max_size: int=20):
        super().__init__()
        self.max_size = max_size

    def append(self, item):
        super().append(item)
        if len(self) > self.max_size:
            del self[0]
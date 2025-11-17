from typing import List, Dict
import json
import os

class Storage:
    def __init__(self, storage_file: str):
        self.storage_file = storage_file
        self.data = self.load_data()

    def load_data(self) -> List[Dict]:
        if os.path.exists(self.storage_file):
            with open(self.storage_file, 'r') as file:
                return json.load(file)
        return []

    def save_data(self, new_data: Dict) -> None:
        self.data.append(new_data)
        with open(self.storage_file, 'w') as file:
            json.dump(self.data, file)

    def get_data(self) -> List[Dict]:
        return self.data

    def clear_data(self) -> None:
        self.data = []
        with open(self.storage_file, 'w') as file:
            json.dump(self.data, file)
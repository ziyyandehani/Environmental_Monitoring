class Aggregator:
    def __init__(self):
        self.data_store = []

    def process_data(self, data):
        self.data_store.append(data)
        self.display_data(data)

    def display_data(self, data):
        print(f"Processed Data: {data}")

    def get_data(self):
        return self.data_store
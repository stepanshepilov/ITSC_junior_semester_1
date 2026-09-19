

def func(a: int, b: int) -> float:
    return a / b


class Model:
    def __init__(self, path: str):
        self.path = path

    def load_model(self):
        """
        какая-то логика загрузки модели
        """

        print("Модель загружена")


model = Model("path/to/your/model")
model.load_model()

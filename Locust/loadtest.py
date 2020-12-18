import time
from locust import HttpUser, task

class QuickstartUser(HttpUser):
    @task
    def access_model(self):
        self.client.post("https://localhost:4200"\
	,json={"data":1})

    def on_start(self):
        self.client.get("ws://localhost:3000")

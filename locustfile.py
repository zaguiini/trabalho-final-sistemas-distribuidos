from locust import HttpUser, task, between
from random import randint


class AutoScalableWordPress(HttpUser):
    wait_time = between(1, 5)

    @task
    def hello_world(self):
        self.client.get("/?" + str(randint(0, 5000)))
        self.client.get("/?p=1&" + str(randint(0, 5000)))

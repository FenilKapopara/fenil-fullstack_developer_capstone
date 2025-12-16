import requests
import time
import random

s = requests.Session()
rnd = "user" + str(random.randint(1000, 9999))
# Register
reg_url = "http://localhost:8000/djangoapp/register"
reg_data = {"userName": rnd, "password": "password", "firstName": "D", "lastName": "B", "email": f"{rnd}@test.com"}
print(f"Registering {rnd}")
res = s.post(reg_url, json=reg_data)
print("Keys:", res.text)
# Login
login_url = "http://localhost:8000/djangoapp/login"
login_data = {"userName": rnd, "password": "password"}
res = s.post(login_url, json=login_data)
print("Login:", res.status_code, res.text)

# Add Review
add_url = "http://localhost:8000/djangoapp/add_review"
review_data = {
    "dealership": 1,
    "review": "Debug Review",
    "name": rnd,
    "purchase": True,
    "purchase_date": "2023-01-01",
    "car_make": "Toyota",
    "car_model": "Camry",
    "car_year": "2023"
}
res = s.post(add_url, json=review_data)
print("Add Review:", res.status_code, res.text)

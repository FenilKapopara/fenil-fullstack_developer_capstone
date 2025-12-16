import urllib.request
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

BASE_URL_NODE = "http://localhost:3030"
BASE_URL_DJANGO = "http://localhost:8000"

def run_curl(filename, command, url, method="GET", data=None, headers=None):
    if headers is None:
        headers = {}
    
    logged_command = f"curl -X {method} {url}"
    if data:
        logged_command += f" -H \"Content-Type: application/json\" -d '{json.dumps(data)}'"
    
    print(f"Generating {filename}...")
    try:
        req = urllib.request.Request(url, method=method, headers=headers)
        if data:
            req.data = json.dumps(data).encode('utf-8')
            req.add_header('Content-Type', 'application/json')
        
        with urllib.request.urlopen(req) as response:
            res_body = response.read().decode('utf-8')
            
            # Format JSON if possible
            try:
                json_obj = json.loads(res_body)
                formatted_output = json.dumps(json_obj, indent=2)
            except:
                formatted_output = res_body

            # Write to file: Command then Output
            with open(filename, "w") as f:
                f.write(logged_command + "\n\n")
                f.write(formatted_output)
            print(f"Success: {filename}")

    except Exception as e:
        print(f"Error generating {filename}: {e}")
        # Write error to file so we know
        with open(filename, "w") as f:
            f.write(logged_command + "\n\n")
            f.write(f"Error: {e}")

def main():
    # 1. loginuser
    # Ensure we have a user. We'll try the admin credential or a test user.
    # We will assume 'admin' 'admin' exists or similar.
    run_curl("loginuser", "login", f"{BASE_URL_DJANGO}/djangoapp/login", "POST", {"userName": "admin", "password": "password"})

    # 2. logoutuser
    run_curl("logoutuser", "logout", f"{BASE_URL_DJANGO}/djangoapp/logout", "GET")

    # 3. getdealerreviews
    run_curl("getdealerreviews", "fetchReviews", f"{BASE_URL_NODE}/fetchReviews/dealer/15", "GET")

    # 4. getalldealers
    run_curl("getalldealers", "fetchDealers", f"{BASE_URL_NODE}/fetchDealers", "GET")

    # 5. getdealerbyid
    run_curl("getdealerbyid", "fetchDealer", f"{BASE_URL_NODE}/fetchDealer/15", "GET")

    # 6. getdealersbyState
    run_curl("getdealersbyState", "fetchDealersByState", f"{BASE_URL_NODE}/fetchDealers/Kansas", "GET")

    # 7. getallcarmakes
    run_curl("getallcarmakes", "getCars", f"{BASE_URL_DJANGO}/djangoapp/get_cars", "GET")

    # 8. analyzereview
    run_curl("analyzereview", "analyze", f"{BASE_URL_NODE}/analyze/Fantastic%20services", "GET")

if __name__ == "__main__":
    main()

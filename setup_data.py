import os
import sys
import django

# Add server directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'server'))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'djangobackend.settings')
django.setup()

from django.contrib.auth.models import User
from djangoapp.models import CarMake, CarModel

def setup():
    # Create Admin
    try:
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@test.com', 'password')
            print("Superuser 'admin' created.")
        else:
            print("Superuser 'admin' already exists.")
    except Exception as e:
        print(f"Error creating admin: {e}")

    # Create Test User
    try:
        if not User.objects.filter(username='testuser').exists():
            User.objects.create_user('testuser', 'test@test.com', 'password123')
            print("User 'testuser' created.")
        else:
            print("User 'testuser' already exists.")
    except Exception as e:
         print(f"Error creating testuser: {e}")

if __name__ == '__main__':
    setup()

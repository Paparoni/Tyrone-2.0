import subprocess
import sys

subprocess.call([sys.executable, '-m', 'pip', 'install', 'requests'])
subprocess.call([sys.executable, '-m', 'pip', 'install', 'Pillow'])
sys.stdout.flush()

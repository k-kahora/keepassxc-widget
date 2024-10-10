# Navigate to the directory where the script is located
cd "$(dirname "$0")"

# Check for the first argument passed to the script
if [ "$1" == "toggle" ]; then
    just toggle
elif [ "$1" == "open" ]; then
    just open
else
    echo "Usage: $0 {toggle|open}"
    exit 1
fi

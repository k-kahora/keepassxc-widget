DATABASE="$HOME"/Documents/PassDatabase/Passwords.kdbx
PASS=$(secret-tool lookup xc 1)

if [ -z "$PASS" ]; then
  echo "Failed to retrieve the password."
  exit 1
fi

# List entries in the database
entries=$(echo "$PASS" | keepassxc-cli ls "$DATABASE")

# Use rofi to select an entry
selected_entry=$(echo "$entries" | rofi -dmenu)

# Copy the selected entry's password to clipboard
if [ -n "$selected_entry" ]; then
  echo "$PASS" | keepassxc-cli clip "$DATABASE" "$selected_entry"
else
  echo "No entry selected."
  exit 1
fi

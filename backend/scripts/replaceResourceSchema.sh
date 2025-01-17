#!/bin/bash

# Define paths
SOURCE_DIR="schematics/resource"
TARGET_DIR="node_modules/@nestjs/schematics/dist/lib/resource"
REPLACEMENT_FLAG="$TARGET_DIR/replaced.txt"

# Get the terminal width
WIDTH="${COLUMNS:-80}"

# Check if the flag file exists
if [ -f "$REPLACEMENT_FLAG" ]; then
  printf "%-${WIDTH}s\n" "" | tr ' ' '='

  # Output the message
  echo -e "\033[32m\nResource schema already replaced.\n\033[0m"

  printf "%-${WIDTH}s\n" "" | tr ' ' '='
  exit 0  
fi

# Check if the source directory exists
if [ ! -d "$SOURCE_DIR" ]; then
  echo "Error: Source directory $SOURCE_DIR does not exist."
  exit 1
fi

# Check if the target directory exists
if [ ! -d "$(dirname "$TARGET_DIR")" ]; then
  echo "Error: Target directory $(dirname "$TARGET_DIR") does not exist."
  exit 1
fi

# Remove the target directory and its contents without output
rm -rf "$TARGET_DIR"

# Copy the source folder to the target location
cp -r "$SOURCE_DIR" "$TARGET_DIR"

# Create the flag file to indicate the replacement was made
touch "$REPLACEMENT_FLAG"

printf "%-${WIDTH}s\n" "" | tr ' ' '='

# Output the message
echo -e "\033[32m\nResource schema replaced successfully.\n\033[0m"

printf "%-${WIDTH}s\n" "" | tr ' ' '='

exit 0

#!/bin/bash

# Define the backend directory and frontend directory paths
BACKEND_DIR="./src"
FRONTEND_DIR="../frontend"
GENERATED_INTERFACE_FILE="$FRONTEND_DIR/src/app/generated_interfaces.ts"

# Check if the frontend directory exists
if [ ! -d "$FRONTEND_DIR" ]; then
  echo "Frontend directory not found!"
  exit 1
fi

# Create/clear the generated interface file
> "$GENERATED_INTERFACE_FILE"

# Find all entity files in the backend directory recursively
find "$BACKEND_DIR" -type f -name "*.entity.ts" | while read ENTITY_FILE_PATH; do
  # Extract the entity class name from the file path
  ENTITY_NAME=$(basename "$ENTITY_FILE_PATH" .entity.ts)
  
  # Capitalize the entity name (first letter uppercase, the rest unchanged)
  ENTITY_NAME_CAPITALIZED=$(echo "$ENTITY_NAME" | sed -r 's/(^|\_)([a-z])/\1\U\2/g')

  # Prepare the output interface name with 'I_' prefix
  INTERFACE_NAME="I_$ENTITY_NAME_CAPITALIZED"

  # Initialize the interface content
  INTERFACE_CONTENT="export interface $INTERFACE_NAME {\n"

  # Read through the entity file line by line
  while IFS= read -r LINE
  do
    # Skip lines with decorators (those starting with @)
    if [[ $LINE == @* ]]; then
      continue
    fi

    # Skip lines that include cascade or other decorator options
    if [[ $LINE =~ cascade ]]; then
      continue
    fi

    # If the line contains a class property, process it
    if [[ $LINE =~ ^[[:space:]]*[a-zA-Z0-9_]+[:][[:space:]]*[a-zA-Z0-9_]+ ]]; then
      # Extract the type
      TYPE=$(echo "$LINE" | grep -oP ':[[:space:]]*\K[a-zA-Z0-9_]+')
      
      # Check if type is not a primitive type
      if [[ ! $TYPE =~ ^(string|number|boolean|Date|any|void|null|undefined)$ ]]; then
        # Preserve the case and apply the I_ prefix for non-primitive types
        MODIFIED_TYPE=$(echo "$TYPE" | sed 's/^\(.\)/\U\1/;s/\(.*\)/I_\1/')
        MODIFIED_LINE=$(echo "$LINE" | sed "s/: *$TYPE/: $MODIFIED_TYPE/")
        INTERFACE_CONTENT+="  $MODIFIED_LINE\n"
      else
        INTERFACE_CONTENT+="  $LINE\n"
      fi
    fi
  done < "$ENTITY_FILE_PATH"

  # Close the interface
  INTERFACE_CONTENT+="}\n"

  # Append the interface to the generated interface file
  echo -e "$INTERFACE_CONTENT" >> "$GENERATED_INTERFACE_FILE"

  echo "Interface for $ENTITY_NAME_CAPITALIZED generated and appended."
done

echo "All interfaces generated successfully: $GENERATED_INTERFACE_FILE"

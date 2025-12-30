#!/bin/bash
# Layer dependency validation for Clean Architecture
# This hook validates that domain layer does not depend on outer layers

input=$(cat)
file_path=$(echo "$input" | jq -r '.tool_input.file_path // empty')
content=$(echo "$input" | jq -r '.tool_input.content // empty')

# Skip if no file path or content
if [ -z "$file_path" ] || [ -z "$content" ]; then
  exit 0
fi

# Check if this is a domain layer file
if [[ "$file_path" == *"/domain/"* ]]; then
  # Check for forbidden imports from outer layers
  if echo "$content" | grep -E "from ['\"].*/(infrastructure|application|interface)/"; then
    echo "❌ LAYER VIOLATION: Domain layer MUST NOT depend on outer layers" >&2
    echo "Found forbidden import in: $file_path" >&2
    echo "" >&2
    echo "Domain layer can only depend on:" >&2
    echo "  - Other domain layer modules" >&2
    echo "  - Shared kernel (src/shared/domain)" >&2
    echo "" >&2
    echo "Please move the dependency behind an interface in the domain layer." >&2
    exit 2  # Block the operation
  fi
  
  # Check for direct database/ORM imports
  if echo "$content" | grep -E "from ['\"].*(typeorm|prisma|mongoose|sequelize|knex)"; then
    echo "❌ LAYER VIOLATION: Domain layer MUST NOT have database dependencies" >&2
    echo "Found ORM/database import in: $file_path" >&2
    exit 2
  fi
fi

# Check if application layer imports from infrastructure
if [[ "$file_path" == *"/application/"* ]]; then
  if echo "$content" | grep -E "from ['\"].*/(infrastructure|interface)/"; then
    echo "⚠️  WARNING: Application layer should not directly depend on infrastructure" >&2
    echo "Consider using dependency injection instead." >&2
    # Warning only, don't block
  fi
fi

echo "✅ Layer dependencies validated"
exit 0

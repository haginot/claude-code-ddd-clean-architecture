#!/bin/bash
# Naming convention validation for DDD patterns
# This hook validates that files and classes follow DDD naming conventions

input=$(cat)
file_path=$(echo "$input" | jq -r '.tool_input.file_path // empty')
content=$(echo "$input" | jq -r '.tool_input.content // empty')

# Skip if no file path or content
if [ -z "$file_path" ] || [ -z "$content" ]; then
  exit 0
fi

# Extract filename without extension
filename=$(basename "$file_path" .ts)

# Check Value Object naming (should not have "ValueObject" suffix in most cases)
if [[ "$file_path" == *"/domain/"* ]]; then
  
  # Check for common Value Object patterns that should be named properly
  if echo "$content" | grep -q "extends ValueObject"; then
    # Acceptable names: Money, Email, Address, OrderId, etc.
    # Bad names: MoneyValueObject, EmailVO
    if echo "$filename" | grep -qiE "(ValueObject|VO)$"; then
      echo "⚠️  Value Objects should be named after the concept they represent" >&2
      echo "Example: 'Money' instead of 'MoneyValueObject'" >&2
    fi
  fi
  
  # Check Entity naming
  if echo "$content" | grep -q "extends Entity"; then
    if echo "$filename" | grep -qiE "Entity$"; then
      echo "⚠️  Entities should be named after the domain concept" >&2
      echo "Example: 'Order' instead of 'OrderEntity'" >&2
    fi
  fi
  
  # Check Aggregate Root naming
  if echo "$content" | grep -q "extends AggregateRoot"; then
    if echo "$filename" | grep -qiE "(Aggregate|Root|AggregateRoot)$"; then
      echo "⚠️  Aggregate Roots should be named after the domain concept" >&2
      echo "Example: 'Order' instead of 'OrderAggregate'" >&2
    fi
  fi
fi

# Check Repository interface naming
if [[ "$file_path" == *"Repository.ts" ]] && [[ "$file_path" == *"/domain/"* ]]; then
  if ! echo "$content" | grep -q "interface.*Repository"; then
    echo "⚠️  Repository files in domain layer should contain an interface" >&2
  fi
fi

# Check Repository implementation naming
if [[ "$file_path" == *"/infrastructure/"* ]]; then
  if echo "$content" | grep -q "implements.*Repository"; then
    if ! echo "$filename" | grep -qE "(Impl|Repository)$"; then
      echo "⚠️  Repository implementations should have descriptive names" >&2
      echo "Example: 'SqlOrderRepository' or 'OrderRepositoryImpl'" >&2
    fi
  fi
fi

# Check Use Case naming
if [[ "$file_path" == *"/application/"* ]] && [[ "$file_path" == *"UseCase.ts" ]]; then
  # Should be [Action][Entity]UseCase
  if ! echo "$filename" | grep -qE "^[A-Z][a-z]+[A-Z].*UseCase$"; then
    echo "⚠️  Use Cases should follow [Action][Entity]UseCase naming" >&2
    echo "Example: 'CreateOrderUseCase', 'ConfirmPaymentUseCase'" >&2
  fi
fi

# Check Command naming
if [[ "$file_path" == *"Command.ts" ]]; then
  # Should be [Action][Entity]Command
  if ! echo "$filename" | grep -qE "^[A-Z][a-z]+[A-Z].*Command$"; then
    echo "⚠️  Commands should follow [Action][Entity]Command naming" >&2
    echo "Example: 'CreateOrderCommand', 'ConfirmPaymentCommand'" >&2
  fi
fi

# Check Query naming
if [[ "$file_path" == *"Query.ts" ]]; then
  # Should be Get/Find/List[Entity]Query
  if ! echo "$filename" | grep -qE "^(Get|Find|List|Search)[A-Z].*Query$"; then
    echo "⚠️  Queries should follow Get/Find/List[Entity]Query naming" >&2
    echo "Example: 'GetOrderQuery', 'FindOrdersByCustomerQuery'" >&2
  fi
fi

# Check for technical jargon in domain layer
if [[ "$file_path" == *"/domain/"* ]]; then
  if echo "$content" | grep -qiE "(Manager|Helper|Util|Service|Handler|Processor)"; then
    # Only warn if it's a class name, not a comment
    if echo "$content" | grep -E "class.*(Manager|Helper|Util|Handler|Processor)"; then
      echo "⚠️  Avoid technical jargon in domain layer" >&2
      echo "Use ubiquitous language from the domain instead" >&2
    fi
  fi
fi

echo "✅ Naming conventions validated"
exit 0

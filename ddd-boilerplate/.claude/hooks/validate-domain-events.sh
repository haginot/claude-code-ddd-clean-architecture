#!/bin/bash
# Domain Event validation for DDD patterns
# This hook validates that domain events follow DDD conventions

input=$(cat)
file_path=$(echo "$input" | jq -r '.tool_input.file_path // empty')
content=$(echo "$input" | jq -r '.tool_input.content // empty')

# Skip if no file path or content
if [ -z "$file_path" ] || [ -z "$content" ]; then
  exit 0
fi

# Check if this is a domain event file
if [[ "$file_path" == *"Event.ts" ]] || [[ "$file_path" == *"/events/"* ]]; then
  
  # Check if events use past tense naming
  # Look for class declarations that don't use past tense
  if echo "$content" | grep -E "class\s+(Create|Update|Delete|Add|Remove|Set|Process|Confirm|Cancel)[A-Z]" | grep -v -E "(Created|Updated|Deleted|Added|Removed|Set|Processed|Confirmed|Cancelled)Event"; then
    echo "⚠️  Domain events should use past tense naming" >&2
    echo "Example: 'OrderCreated' instead of 'CreateOrder'" >&2
  fi
  
  # Check if events implement DomainEvent interface
  if echo "$content" | grep -q "class.*Event" && ! echo "$content" | grep -q "implements.*DomainEvent"; then
    echo "⚠️  Domain events should implement DomainEvent interface" >&2
  fi
  
  # Check for readonly properties (immutability)
  if echo "$content" | grep -q "class.*Event" && ! echo "$content" | grep -q "readonly"; then
    echo "⚠️  Domain events should have readonly properties for immutability" >&2
  fi
  
  # Check for occurredAt timestamp
  if echo "$content" | grep -q "class.*Event" && ! echo "$content" | grep -q "occurredAt"; then
    echo "⚠️  Domain events should include an 'occurredAt' timestamp" >&2
  fi
fi

# Check if aggregates publish domain events
if [[ "$file_path" == *"/domain/"* ]] && [[ "$file_path" != *"/events/"* ]]; then
  if echo "$content" | grep -q "extends.*AggregateRoot"; then
    # Check if aggregate has methods that should publish events
    if echo "$content" | grep -qE "(create|confirm|cancel|update|delete|add|remove)\s*\(" && ! echo "$content" | grep -q "addDomainEvent"; then
      echo "⚠️  Aggregate state changes should publish domain events" >&2
      echo "Consider calling 'this.addDomainEvent()' in state-changing methods" >&2
    fi
  fi
fi

echo "✅ Domain event validation completed"
exit 0

---
name: task-list
description: List all available tasks from PLAN.md
user-invocable: true
---

# Task List

Lists all tasks defined in PLAN.md with their task IDs, organized by phase.

## Usage

```
/task-list
/task-list [keyword]
```

## What it does

1. Reads PLAN.md
2. Extracts all task IDs (format: `[task-id]`)
3. Shows task ID and description organized by phase
4. Shows active worktrees
5. Optionally filters by keyword if provided

## Implementation

Use grep to extract and format task information:

```bash
# Read PLAN.md and extract tasks
echo "📋 Available Tasks from PLAN.md"
echo "================================"
echo ""

# Get all task lines with phase context
grep -n "^## Phase\|^\- \[" /Users/kate/todo-list/PLAN.md | while IFS=: read -r line_num content; do
  if echo "$content" | grep -q "^## Phase"; then
    # Print phase header
    echo "$content"
  else
    # Extract task ID and description
    task_id=$(echo "$content" | grep -o '\[[\w-]*\]' | sed 's/\[\(.*\)\]/\1/')
    description=$(echo "$content" | sed 's/^- \[[\w-]*\] //')
    echo "  [$task_id] $description"
  fi
done

echo ""
echo "---"

# Count total tasks
total=$(grep -c "^\- \[" /Users/kate/todo-list/PLAN.md)
echo "Total: $total tasks"

# Show active worktrees if any
if git worktree list | grep -q ".worktrees"; then
  echo ""
  echo "Active worktrees:"
  git worktree list | grep ".worktrees" | awk '{print "  - " $1}' | sed 's|.*/\.worktrees/||'
fi
```

## Filtering (optional)

If `$ARGUMENTS` provided, filter tasks:

```bash
# Filter tasks by keyword
if [ -n "$ARGUMENTS" ]; then
  echo "Tasks matching '$ARGUMENTS':"
  grep "^\- \[.*$ARGUMENTS" /Users/kate/todo-list/PLAN.md | sed 's/^- /  /'
fi
```

## Output Format Example

```
📋 Available Tasks from PLAN.md
================================

## Phase 0: Foundation
  [env-setup] Add environment variables (JWT_SECRET, JWT_EXPIRES_IN)
  [deps-install] Add dependencies if missing (bcrypt, jsonwebtoken, plus type packages)
  [types-auth] Create shared auth/user types in libs/types

## Phase 1: Backend Authentication + Users
  [user-model] Create User mongoose model
  [auth-controller] Add auth controller + repository + routes
  [jwt-middleware] Add JWT auth middleware
  [protect-routes] Protect todo/todolist routes
  [req-user] Replace any trust in query userId with user from token (req.user)

...

---
Total: 30 tasks
Active worktrees:
  - auth-users
  - todo-fields
```

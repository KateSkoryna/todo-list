---
name: task
description: Create a git worktree for a task from PLAN.md
argument-hint: <task-id>
disable-model-invocation: true
user-invocable: true
---

# Task Worktree Creator

Creates a git worktree and branch for working on a specific task from PLAN.md.

## Usage

```
/task auth-users
/task todo-fields
```

## What it does

When you invoke `/task <task-id>`:

1. **Validates** task-id exists in PLAN.md using grep
2. **Checks conflicts**: existing branch or worktree
3. **Creates branch**: `task/<task-id>` from current main
4. **Creates worktree**: `.worktrees/<task-id>/`
5. **Sets up symlinks** for node_modules and .nx/cache (saves 631MB)
6. **Reports success** with next steps

## Implementation Steps

Execute the following steps to create a task worktree:

### 1. Validate task exists in PLAN.md

```bash
# Check if task ID exists in PLAN.md
if ! grep -q "\[$ARGUMENTS\]" /Users/kate/todo-list/PLAN.md; then
  echo "❌ Error: Task ID '$ARGUMENTS' not found in PLAN.md"
  echo ""
  echo "Available tasks:"
  grep -o '\[[\w-]*\]' /Users/kate/todo-list/PLAN.md | sed 's/\[\(.*\)\]/  - \1/'
  exit 1
fi
```

### 2. Check for existing branch

```bash
# Check if branch already exists
if git show-ref --verify --quiet refs/heads/task/$ARGUMENTS; then
  echo "⚠️  Branch 'task/$ARGUMENTS' already exists"
  echo ""
  echo "Options:"
  echo "  1. Use different task ID"
  echo "  2. Delete existing branch: git branch -D task/$ARGUMENTS"
  echo "  3. Switch to existing worktree if it exists"
  exit 1
fi
```

### 3. Check for existing worktree directory

```bash
# Check if worktree directory exists
if [ -d ".worktrees/$ARGUMENTS" ]; then
  echo "⚠️  Worktree directory '.worktrees/$ARGUMENTS' already exists"
  echo ""
  echo "Options:"
  echo "  1. Remove it: rm -rf .worktrees/$ARGUMENTS"
  echo "  2. Use different task ID"
  exit 1
fi
```

### 4. Create worktree

```bash
# Create worktree from main branch
echo "Creating worktree for task: $ARGUMENTS"
git worktree add -b task/$ARGUMENTS .worktrees/$ARGUMENTS main

if [ $? -ne 0 ]; then
  echo "❌ Failed to create worktree"
  exit 1
fi
```

### 5. Set up symlinks for node_modules and Nx cache

```bash
# Navigate to worktree
cd .worktrees/$ARGUMENTS

# Remove node_modules if it exists (git worktree might copy it)
if [ -d "node_modules" ] || [ -L "node_modules" ]; then
  rm -rf node_modules
fi

# Create symlink to shared node_modules
ln -s ../../node_modules node_modules

# Handle .nx directory
if [ -d ".nx" ] || [ -L ".nx" ]; then
  rm -rf .nx
fi

# Create .nx directory and symlink cache
mkdir -p .nx
cd .nx
ln -s ../../../.nx/cache cache
cd ..

echo ""
echo "✅ Worktree created successfully!"
echo ""
echo "Details:"
echo "  📁 Path: .worktrees/$ARGUMENTS"
echo "  🌿 Branch: task/$ARGUMENTS"
echo "  🔗 Symlinks: node_modules → ../../node_modules"
echo "  🔗 Symlinks: .nx/cache → ../../../.nx/cache"
echo ""
echo "Next steps:"
echo "  cd .worktrees/$ARGUMENTS"
echo "  nx test todo-be  # or your preferred test command"
echo ""
echo "To switch back to main: cd /Users/kate/todo-list"
```

### 6. Detect package.json changes (warning)

```bash
# Check if main branch has uncommitted package.json changes
cd /Users/kate/todo-list
if git diff --quiet main -- package.json package-lock.json; then
  : # No changes, all good
else
  echo "⚠️  Note: package.json has uncommitted changes in main"
  echo "   Symlinked node_modules may not match if you run 'npm install' in this worktree"
fi
```

## Error Handling

| Error | Response |
|-------|----------|
| Task ID not found | List all available task IDs from PLAN.md |
| Branch exists | Suggest deleting branch or using different ID |
| Worktree directory exists | Suggest removing directory or using different ID |
| Git command fails | Show error and abort |
| Package.json conflicts | Warn about potential dependency mismatch |

## Notes

- **Symlinks save disk space**: Shared 631MB node_modules instead of per-worktree
- **Fast creation**: ~1 second vs ~2 minutes for full npm install
- **The Rule**: ALWAYS add dependencies in main first, then `git rebase main` in worktrees
- **NEVER run `npm install` in worktrees** - This breaks the symlink!

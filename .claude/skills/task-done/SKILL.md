---
name: task-done
description: Complete a task and cleanup its worktree
argument-hint: <task-id> [--no-pr] [--keep-branch]
disable-model-invocation: true
user-invocable: true
---

# Task Completion

Completes a task by optionally creating a PR, then cleaning up the worktree.

## Usage

```
/task-done auth-users
/task-done auth-users --no-pr
/task-done auth-users --keep-branch
```

## What it does

1. **Verifies** worktree exists for the task
2. **Checks** for uncommitted changes (aborts if found)
3. **Checks** for unpushed commits
4. **Creates PR** using `gh pr create` (unless --no-pr)
5. **Removes** worktree directory
6. **Optionally deletes** local branch (unless --keep-branch)

## Implementation Steps

### 1. Parse arguments

```bash
# Extract task ID and flags
TASK_ID=$(echo "$ARGUMENTS" | awk '{print $1}')
CREATE_PR=true
KEEP_BRANCH=false

if echo "$ARGUMENTS" | grep -q "\-\-no-pr"; then
  CREATE_PR=false
fi

if echo "$ARGUMENTS" | grep -q "\-\-keep-branch"; then
  KEEP_BRANCH=true
fi
```

### 2. Verify worktree exists

```bash
# Check if worktree exists
if ! git worktree list | grep -q "\.worktrees/$TASK_ID"; then
  echo "❌ Error: Worktree for task '$TASK_ID' not found"
  echo ""
  echo "Active worktrees:"
  git worktree list
  exit 1
fi

# Check if worktree directory exists
if [ ! -d ".worktrees/$TASK_ID" ]; then
  echo "❌ Error: Worktree directory '.worktrees/$TASK_ID' not found"
  exit 1
fi
```

### 3. Check for uncommitted changes

```bash
# Navigate to worktree
cd .worktrees/$TASK_ID

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
  echo "❌ Error: Uncommitted changes detected in worktree"
  echo ""
  echo "Please commit or stash your changes first:"
  echo "  cd .worktrees/$TASK_ID"
  echo "  git status"
  echo "  git add . && git commit -m 'Your message'"
  echo ""
  exit 1
fi

# Check for untracked files
if [ -n "$(git ls-files --others --exclude-standard)" ]; then
  echo "⚠️  Warning: Untracked files detected"
  git ls-files --others --exclude-standard
  echo ""
  echo "Commit or remove these files before proceeding"
  exit 1
fi
```

### 4. Check for unpushed commits

```bash
# Check if branch has commits not yet pushed
cd .worktrees/$TASK_ID

# Get remote tracking branch
REMOTE_BRANCH=$(git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null)

if [ -z "$REMOTE_BRANCH" ]; then
  echo "⚠️  Warning: Branch has no remote tracking branch"
  echo "   Commits will be pushed when creating PR"
  UNPUSHED=true
else
  # Check for unpushed commits
  UNPUSHED_COUNT=$(git rev-list @{u}..HEAD --count 2>/dev/null || echo "0")
  if [ "$UNPUSHED_COUNT" -gt 0 ]; then
    echo "ℹ️  Note: $UNPUSHED_COUNT unpushed commit(s) detected"
    UNPUSHED=true
  else
    UNPUSHED=false
  fi
fi
```

### 5. Create PR (optional)

```bash
cd .worktrees/$TASK_ID

if [ "$CREATE_PR" = true ]; then
  echo "Creating pull request..."

  # Push branch to remote if not pushed
  if [ "$UNPUSHED" = true ]; then
    echo "Pushing branch to remote..."
    git push -u origin task/$TASK_ID

    if [ $? -ne 0 ]; then
      echo "❌ Failed to push branch"
      exit 1
    fi
  fi

  # Get task description from PLAN.md
  TASK_DESC=$(grep "\[$TASK_ID\]" /Users/kate/todo-list/PLAN.md | sed 's/^- \[[\w-]*\] //')

  # Create PR using gh CLI
  gh pr create \
    --title "[$TASK_ID] $TASK_DESC" \
    --body "Implements task \`$TASK_ID\` from PLAN.md" \
    --base main

  if [ $? -ne 0 ]; then
    echo "❌ Failed to create PR"
    echo "You can create it manually later"
  else
    echo "✅ Pull request created"
  fi
else
  echo "Skipping PR creation (--no-pr flag)"

  # Still push if needed
  if [ "$UNPUSHED" = true ]; then
    echo "Pushing branch to remote..."
    git push -u origin task/$TASK_ID || echo "⚠️  Push failed, branch remains local"
  fi
fi
```

### 6. Remove worktree

```bash
# Navigate back to main directory
cd /Users/kate/todo-list

echo "Removing worktree..."
git worktree remove .worktrees/$TASK_ID

if [ $? -ne 0 ]; then
  echo "❌ Failed to remove worktree"
  echo "Try manually: git worktree remove .worktrees/$TASK_ID --force"
  exit 1
fi

echo "✅ Worktree removed"
```

### 7. Delete local branch (optional)

```bash
if [ "$KEEP_BRANCH" = false ]; then
  echo "Deleting local branch..."
  git branch -d task/$TASK_ID

  if [ $? -ne 0 ]; then
    echo "⚠️  Branch has unmerged changes, use -D to force delete"
    echo "Run: git branch -D task/$TASK_ID"
  else
    echo "✅ Local branch deleted"
  fi
else
  echo "Keeping local branch (--keep-branch flag)"
fi
```

### 8. Success summary

```bash
echo ""
echo "🎉 Task '$TASK_ID' completed!"
echo ""
echo "Summary:"
echo "  ✓ Worktree removed: .worktrees/$TASK_ID"
if [ "$CREATE_PR" = true ]; then
  echo "  ✓ Pull request created"
fi
if [ "$KEEP_BRANCH" = false ]; then
  echo "  ✓ Local branch deleted: task/$TASK_ID"
else
  echo "  ℹ️  Local branch kept: task/$TASK_ID"
fi
echo ""
echo "Remote branch remains: origin/task/$TASK_ID"
echo "It will be deleted when PR is merged"
```

## Flags

- `--no-pr`: Skip PR creation, just cleanup worktree
- `--keep-branch`: Don't delete local branch after cleanup

## Safety Features

- Aborts if uncommitted changes detected
- Warns about untracked files
- Pushes commits before creating PR
- Provides fallback instructions if commands fail
- Keeps remote branch (deleted on PR merge)

## Prerequisites

- `gh` CLI must be installed and authenticated
- Git remote must be configured
- User must have push permissions

## Error Handling

| Error | Response |
|-------|----------|
| Worktree not found | List active worktrees |
| Uncommitted changes | Abort with instructions to commit |
| Untracked files | Warn and list files |
| Push fails | Continue with local cleanup, warn user |
| PR creation fails | Continue with cleanup, suggest manual PR |

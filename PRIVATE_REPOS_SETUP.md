# Private Repos Setup — SILENCE.OBJECTS Ecosystem

## Step 1: Create Private Repos on GitHub

Go to: https://github.com/organizations/Patternslab-ecosystem/repositories/new

Create these 3 PRIVATE repos:

### 1. silence-closed
- **Visibility:** Private
- **Description:** "SILENCE.OBJECTS closed modules — @silence/safety, @silence/ai, @silence/predictive, @silence/voice, @silence/medical, @silence/legal, @silence/linkedin-agent"
- **Initialize:** empty (no README, no .gitignore)

### 2. silence-agents
- **Visibility:** Private
- **Description:** "SILENCE.OBJECTS Agent Army v3.0 — 3-layer autonomous agent orchestration"
- **Initialize:** empty

### 3. silence-patternslab
- **Visibility:** Private
- **Description:** "PatternsLab — SILENCE.OBJECTS institutional B2B platform"
- **Initialize:** empty

## Step 2: Push Closed Code to Private Repos

### silence-closed (all 7 closed modules)
```powershell
cd C:\SILENCE.OBJECTS

# Create a clean directory for closed modules
mkdir ..\silence-closed
cd ..\silence-closed
git init

# Copy closed module source code
$modules = @('safety','ai','predictive','voice','medical','legal','linkedin-agent')
foreach ($m in $modules) {
    if (Test-Path "..\SILENCE.OBJECTS\packages\$m\src") {
        robocopy "..\SILENCE.OBJECTS\packages\$m" "packages\$m" /E /XF README.md
    }
}

git add -A
git commit -m "feat: initial closed modules migration"
git remote add origin git@github.com:Patternslab-ecosystem/silence-closed.git
git branch -M main
git push -u origin main
```

### silence-agents
```powershell
mkdir ..\silence-agents
cd ..\silence-agents
git init

robocopy "..\SILENCE.OBJECTS\agents" "." /E /XF README.md

git add -A
git commit -m "feat: initial agent army migration"
git remote add origin git@github.com:Patternslab-ecosystem/silence-agents.git
git branch -M main
git push -u origin main
```

### silence-patternslab
```powershell
mkdir ..\silence-patternslab
cd ..\silence-patternslab
git init

robocopy "..\SILENCE.OBJECTS\apps\patternslab" "." /E /XF README.md

git add -A
git commit -m "feat: initial PatternsLab migration"
git remote add origin git@github.com:Patternslab-ecosystem/silence-patternslab.git
git branch -M main
git push -u origin main
```

## Step 3: Enable Security Features on ALL repos

For EACH repo (public + 3 private), go to Settings:

### Branch Protection (Settings > Branches > Add rule)
- Branch name pattern: `main`
- Require a pull request before merging
- Require approvals (1)
- Require status checks to pass before merging
- Require branches to be up to date
- Do not allow bypassing the above settings

### Secret Scanning (Settings > Code security)
- Secret scanning: Enabled
- Push protection: Enabled (blocks commits with detected secrets)

### Dependabot (Settings > Code security)
- Dependabot alerts: Enabled
- Dependabot security updates: Enabled

### Private repos EXTRA:
- Visibility: Private (verify!)
- Disable forking
- Restrict who can push to main

## Step 4: Update GitHub Repo Settings

### Public repo (SILENCE.OBJECTS):
- **Description:** "SILENCE.OBJECTS — Modular framework for structural behavioral pattern analysis. Open Core: 8 MIT modules + enterprise closed modules."
- **Topics:** `typescript`, `behavioral-analysis`, `pattern-detection`, `framework`, `open-source`, `supabase`, `nextjs`, `monorepo`
- **Website:** https://patternslab.app
- **Remove:** Any mention of "mental health" from description

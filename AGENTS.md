# Ken Teacher Tool Standards

Preferred stack:
- GitHub Pages frontend
- GAS backend
- Google Sheets database
- clasp sync
- vanilla HTML/CSS/JS

Avoid:
- React unless requested
- npm/build systems unless needed
- unnecessary frameworks
- backend hosting services

UI:
- desktop-first by default
- Google Stitch-inspired UI
- Tabler Icons preferred
- teacher-tool UX
- fast scanability
- minimal scrolling

Repo conventions:
- frontend at repo root
- /gas folder for GAS source
- .clasp.json gitignored

Workflow:
- Codex should push GitHub changes
- Codex should clasp push GAS changes when possible
- minimize manual copy/paste

## GitHub Auth / Repo Setup

Preferred Git remote format:
- SSH only
- Example:
  git@github.com:palytinsley/repo-name.git

Avoid:
- HTTPS GitHub remotes
- PAT/token-based workflows unless explicitly required

Reason:
- SSH auth is already configured and reliable
- avoids recurring GitHub 403/token expiration issues
- smoother Codex automation workflow

When creating or cloning repos:
- use SSH remotes by default
- verify push access early with:
  git push -u origin main

## Codex Responsibilities

Codex should:
- edit local files directly
- commit changes to git
- push commits to GitHub
- run clasp push for GAS projects when appropriate
- verify GitHub repo contents after push

Avoid:
- leaving commits only in local repos
- creating duplicate v1/v2 files unless explicitly requested
- regenerating files when the task is only auth/deployment related

## GAS Deployment Conventions

For GAS projects:
- keep active GAS file as Code.gs during clasp push
- avoid deploying multiple versions with duplicate doGet/doPost handlers
- v1/v2 archival files may exist locally, but only active deployment files should be pushed via clasp

## Preferred Development Workflow

Standard flow:

1. Brainstorm/spec with ChatGPT
2. Codex edits repo locally
3. Codex commits changes
4. Codex pushes to GitHub via SSH
5. Codex runs clasp push
6. Verify deployment/repo state

Before starting:
- ask whether this is a new repo or existing repo
- ask whether this uses a shared student database

# Deployment + Sync Workflow

Before making edits, always verify:

1. This project folder is a valid Git repository.
2. A GitHub remote named `origin` is connected.
3. The GAS backend folder contains:
   - `.clasp.json`
   - `appsscript.json`

If any of these are missing, STOP and report the issue before continuing.

---

# After Completing Changes

After edits are complete:

1. Review changed files.
2. Commit changes with a descriptive commit message.
3. Push commits to GitHub using:
   git push origin main

If GAS backend files were modified:

1. Navigate to the GAS folder.
2. Run:
   clasp push

3. Confirm whether clasp push succeeded or failed.

Never claim deployment occurred unless push commands actually succeeded.
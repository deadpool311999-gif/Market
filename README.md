# Holiday Market Order Builder

Small React app to build an order list (copy/paste output text).

## Local dev

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173/`).

## Build

```bash
npm run build
npm run preview
```

## Deploy to Netlify

This repo includes `netlify.toml`, so Netlify will auto-detect settings:

- **Build command**: `npm run build`
- **Publish directory**: `dist`

### Option A: Netlify UI (recommended)

1. Push this project to GitHub.
2. In Netlify, choose **Add new site → Import an existing project**.
3. Pick your GitHub repo and deploy.

### Option B: Netlify CLI (optional)

```bash
npm i -g netlify-cli
netlify login
netlify init
netlify deploy
netlify deploy --prod
```

## Push to GitHub (quick steps)

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```


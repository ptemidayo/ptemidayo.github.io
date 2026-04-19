# Deploy Guide — elufisantemidayo.com

Everything you need to get your site live on your custom domain, with a working AI tutor.

---

## Part 1 — Publish the site to GitHub Pages

### 1. Create the repo
On github.com (signed in as **ptemidayo**) create a new **public** repository named exactly:

```
ptemidayo.github.io
```

The repo name literally becomes the default URL. Leave it empty for now (no README, no .gitignore).

### 2. Upload the files
Click **"uploading an existing file"** on the empty repo page and drag in **all** of these:

```
index.html
tutorial.html
styles.css
app.js
publications.js
CNAME
assets/portrait.png
assets/Elufisan_CV.pdf
```

(The `CNAME` file is already prepared — it contains just `elufisantemidayo.com`.)

Commit directly to `main`.

### 3. Turn on Pages
Repo → **Settings → Pages**
- **Source:** Deploy from a branch
- **Branch:** `main` / `/ (root)` → **Save**

In ~60 seconds `https://ptemidayo.github.io` will go live as a preview.

---

## Part 2 — Connect `elufisantemidayo.com`

### 1. GitHub side
Repo → **Settings → Pages → Custom domain** → enter `elufisantemidayo.com` → **Save**.
GitHub will say DNS check failed — that's expected until step 2.

### 2. Cloudflare side (DNS)
Log in to Cloudflare → select `elufisantemidayo.com` → **DNS → Records**.

Add these four **A records** (apex domain → GitHub Pages):

| Type | Name | IPv4 address | Proxy |
|------|------|--------------|-------|
| A | `@` | `185.199.108.153` | DNS only (grey cloud) |
| A | `@` | `185.199.109.153` | DNS only |
| A | `@` | `185.199.110.153` | DNS only |
| A | `@` | `185.199.111.153` | DNS only |

And one **CNAME** for `www`:

| Type | Name | Target | Proxy |
|------|------|--------|-------|
| CNAME | `www` | `ptemidayo.github.io` | DNS only |

> **Important:** leave the cloud **grey** (DNS-only) while GitHub validates the domain and issues an HTTPS cert. You can flip it orange (proxied) later for extra CDN if you want.

Go to **SSL/TLS → Overview** in Cloudflare → set mode to **Full**.

### 3. Enforce HTTPS
Wait ~5–30 minutes for DNS. Then on GitHub: **Settings → Pages** → check **Enforce HTTPS**.

Visit `https://elufisantemidayo.com` — you should see the site.

---

## Part 3 — Make the AI tutor work live

The built-in tutor only runs inside the preview environment. For the public site we'll use a tiny **Cloudflare Worker** that proxies requests to Anthropic's API so your API key stays server-side.

### 1. Get an Anthropic API key
Sign up at https://console.anthropic.com → **API Keys** → Create Key. Copy it (starts with `sk-ant-...`).

### 2. Deploy the Worker
Install Wrangler once:
```bash
npm install -g wrangler
wrangler login
```

From this project folder:
```bash
cd worker
wrangler init --yes tutor-worker
# overwrite the generated src/index.js with tutor-worker.js from this folder
wrangler secret put ANTHROPIC_API_KEY
# paste your sk-ant-... key when prompted
wrangler deploy
```

Wrangler will print a URL like `https://tutor-worker.<your-subdomain>.workers.dev`.

### 3. (Optional but nicer) Give the Worker a custom subdomain
In Cloudflare → **Workers & Pages → tutor-worker → Settings → Domains & Routes → Add Custom Domain** → enter `tutor.elufisantemidayo.com`. Cloudflare auto-adds the DNS record.

### 4. Point the site at the Worker
In **app.js**, change one line near the top:
```js
const TUTOR_ENDPOINT = "https://tutor.elufisantemidayo.com/chat";
// or the workers.dev URL if you skipped step 3
```
Commit and push. The tutor will now talk to Claude live on your real site.

---

## Costs summary
| Item | Cost |
|------|------|
| Domain (`elufisantemidayo.com`) | you already paid (~$10/yr) |
| GitHub Pages hosting | **free** |
| Cloudflare DNS | **free** |
| Cloudflare Worker (100k req/day) | **free** |
| Anthropic API (Claude Haiku) | pay-as-you-go; a chatty tutor costs pennies/day. Set a spend cap in the Anthropic console. |

---

## Updating the site later
Just edit files on GitHub (web UI or `git push`). Pages redeploys in ~30 seconds.

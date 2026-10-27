# Launch and protect (Stages 10 to 13)

## Stage 10 · Deploy with GitHub and Vercel

1. Create a GitHub repository. The main page must be named exactly `index.html` and sit at the top level; folders (`projects/`, `treasure/`) sit beside it.
2. The GitHub website uploads at most 100 files per batch. For bigger sites, upload the root files first, then open a folder in the repository and upload into it, so paths stay right. Check the repository afterwards: a site that shows only `index.html` online is the most common cause of empty folders and galleries.
3. On vercel.com, sign in with GitHub, Add New → Project, choose the repository, Deploy. No build settings for a plain HTML site.
4. Every change to the repository redeploys within a minute or two. Deployments shows Ready when live; a hard refresh (Cmd+Shift+R) skips the browser cache.
5. A 404 almost always means the main file is called something like `index (2).html`, or sits inside a folder.

## Stage 11 · A custom domain

1. Buy from a registrar (Namecheap, Porkbun, Cloudflare, Squarespace), about $10 to $20 a year.
2. Vercel project → Settings → Domains → Add.
3. Copy the exact DNS records Vercel shows (usually an A record for the bare domain and a CNAME for `www`) into the registrar. Values can differ per project, so never copy them from memory.
4. Wait for Valid Configuration; HTTPS is added automatically. Choose which of `www` or the bare domain is primary.

## Stage 12 · Push updates for the person

1. The person connects GitHub in claude.ai (Settings → Connectors) and installs the Claude GitHub App on their account with access to the site repository.
2. With the repository attached to the session, clone it, copy changes in, commit with a short message, and push to the branch Vercel deploys (usually `main`).
3. Before pushing visual changes, screenshot and let the person approve.
4. If a push is refused with a "no GitHub access" message, the App is not installed on that repository. Tell the person the exact fix; access granted mid-session may need a new session.
5. Pull before editing in later sessions: the person may have uploaded files themselves.
6. Never put passwords, tokens or API keys in the site.

## Stage 13 · Protect the work

Be honest first: a public website cannot be made impossible to copy, because the browser must receive the code. These steps stop casual copying and well-behaved AI tools.

| Step | How |
|---|---|
| Private repository | GitHub → Settings → Danger Zone → Change visibility → Private. Vercel keeps deploying. |
| Ask AI crawlers to stay out | Copy `assets/robots.txt` to the site root. It allows search engines and blocks GPTBot, ClaudeBot, Google-Extended, PerplexityBot, CCBot, Bytespider and others. |
| "Do not train" signals | Copy `assets/vercel.json` (adds `X-Robots-Tag: noai, noimageai` to every response) and add `<meta name="robots" content="noai, noimageai">` to `index.html`. |
| Block AI bots at the server | Vercel → Firewall → Bot management → AI Bots → Deny. Keep general Bot Protection on Log: Challenge mode can break LinkedIn and email link previews and some recruiting systems' link checks. |
| Copyright line | "© Name. All rights reserved." in the footer or About panel. |
| Proof of authorship | Dated commits and the iteration log. |
| If copied | Save screenshots; file a DMCA takedown with the copier's host. |

Optional: minify and obfuscate the JavaScript at deploy time (keep the readable source in the private repository and let Vercel build the minified version). It raises the effort to copy but not to imitate from screenshots, and makes live debugging harder; recommend it only if the person has seen copying.

Protect the learners too: see the privacy section of `content-and-docs.md`.

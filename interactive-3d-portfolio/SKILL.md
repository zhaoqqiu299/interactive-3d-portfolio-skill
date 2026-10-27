---
name: interactive-3d-portfolio
description: Build, iterate and launch an explorable 3D portfolio website (a room or studio in the browser, made with Three.js) for an educator, learning designer, designer or student, with each portfolio section living in an object in the room. Covers planning the room metaphor, image prompts for a reference picture, the single-file Three.js build, filling real content with design notes, linking Google Drive files, round-by-round polishing, testing, deploying on GitHub and Vercel, a custom domain, auto-updating GitHub, and protecting the work and the learners in it. Use this whenever someone wants an interactive, 3D, immersive, game-like or "room" portfolio or personal site, wants to turn a picture of a space into a website, is iterating on such a site ("make the bookshelf glow", "move the menu", "the chest should open a gallery"), or asks how to publish, update or protect one, even if they never say "Three.js" or "skill".
---

# Interactive 3D portfolio

Help a person build a portfolio that people explore like a room: a chalkboard for About, a laptop for Projects, a bookshelf for skills, a mailbox for Contact. The person usually cannot code. You build; they look, judge and redirect. Most of the quality comes from many short rounds of their feedback, so make each round fast and visible.

The process has 13 stages in 4 phases. Do them in order the first time; later requests usually land in one stage (most often Stage 8).

| Phase | Stages | Read |
|---|---|---|
| Plan and build | 1 Plan · 2 First prompt · 3 Reference picture · 4 3D build · 5 Borrowed interactions | `references/build-patterns.md` |
| Fill | 6 Content and design notes · 7 Google files | `references/content-and-docs.md` |
| Polish | 8 Iterate · 9 Test | this file, then `scripts/screenshot_site.js` |
| Launch and protect | 10 Deploy · 11 Domain · 12 Auto-update GitHub · 13 Protect | `references/launch-and-protect.md` |

## Working with the person

- **Expect plain-language requests, in any language.** "The books lying flat look like long planks" is a complete brief. Translate it into the change yourself. Reply in the person's language; keep site text in the site's language.
- **Handle numbered requests one by one** and report back against the same numbers, so nothing is silently dropped.
- **Show, don't describe.** After a visual change, take a screenshot and look at it before you say it is done. Send the person the screenshot when the change is about layout or look. Software WebGL is slow, so give screenshots generous timeouts (see Stage 9).
- **Explain trade-offs briefly and recommend one option** when there is a real choice ("Testimonials" vs "Testimony": recommend the first and say why in one sentence). Do not ask questions you can answer from context.
- **When the person is unsure what a word means** (DNS, commit, repository), explain it in one line, then continue.

## Honesty and care

A portfolio is read by people deciding whether to hire someone, so it must be true.

- Do not add skills, tools, results, testing or collaborators the person has not confirmed. If they ask you to list tools they did not use ("pretend I know Blender"), say plainly that an interviewer may ask about it, offer the true and often stronger framing (for example, "every object modelled in code"), and suggest listing real skills in a Skills section instead.
- When you write design rationales, ground every claim in what the artifact actually does. Planned use goes under a heading like "How I would use it in class", never as something that happened.
- Flag any sentence you inferred rather than were told, and ask the person to check it.
- Protect learners: remove names, IDs, grades and private comments; blur faces (including background people) before publishing photos; keep research data and code private unless a supervisor approves. See Stage 13.

## Stage 1 · Plan before you prompt

Agree on three things before building: the audience and their goal (for example, "hiring teams for learning design internships, 3 to 5 minutes per candidate"), the list of sections, and a room map where each object's everyday function matches its section. If an object and its meaning disagree, change the object (a suitcase suggests leaving; a mailbox suggests writing). Every section must also be reachable from a plain menu.

## Stages 2 to 5 · Build the room

Read `references/build-patterns.md` before writing the scene. Default architecture:

- One `index.html` with Three.js loaded from a pinned CDN version via an import map, every object modelled in code from primitives (no model files), canvas-generated textures, and a top-left menu.
- Content that changes often (project folders, gallery items) lives in small JSON files beside `index.html`, so the person can add a project or photo without touching the 3D code.
- If the person brings a reference picture (Stage 3), match its layout, palette and light first; style details come later. If they bring an example interaction (React Bits, Codrops), build an original version in the site's own style, and do not paste licensed code.

First-build checklist: every section has an object that glows on hover with a label; a click moves the camera there and opens the section; the menu works without the 3D room; it loads in about 5 seconds; it works at phone width.

## Stage 6 and 7 · Fill with real work

Read `references/content-and-docs.md`. In short: ask for real material (CV, LinkedIn text, project files), draft from it, and let the person correct it. Put real artifacts first and the reasoning beside them as numbered design notes naming the decision and the learning theory behind it. Cut stale dates unless they matter. For Google links, check sharing is "Anyone with the link, Viewer"; if a file needs a university sign-in, host it on the site instead.

## Stage 8 · Iterate

This is where most of the work happens. Rules learned from real rounds:

- **One signal for "clickable".** Everything clickable glows on hover; nothing decorative glows or looks clickable. Delete false signals (glowing papers, floating formulas, stray sticky notes).
- **Signpost hidden interactions.** If visitors can draw on a board, turn the pointer into chalk over it, place the tools right under it and let them glow until first use. If a gallery scrolls, show a small legend (arrow keys, wheel, two-finger swipe, drag on touch). When a section is open, make the next clickable thing in it glow gently (a pulsing outline) so people notice it.
- **Keep interactive things near where people look.** When a panel opens on the right, put the objects you can interact with on the right side of the scene.
- **Real proportions.** Books, mugs and furniture at true scale look right; stretched shapes look wrong immediately.
- **Sound only after a click** (browsers block autoplay): an "Enter" button that starts the music, plus a quiet option.
- **Order content by the story.** In testimonials, words (letters, notes, messages) before photos; the most personal item first.
- **Name sections plainly.** A menu label should say what is inside ("Research", not "Next chapter").
- **Check what blocks clicks.** Three.js `Line` and `LineSegments` objects catch rays from about a metre away by default; set `obj.raycast = () => {}` on decorative wireframes, or clicks near them go to the wrong object.

After each round, screenshot the changed views, fix what is visibly wrong once, and report what changed in plain words.

## Stage 9 · Test

Run `scripts/screenshot_site.js <site_dir> <out_dir> about projects contact` (section ids are the menu buttons' `data-go` values) to capture desktop and phone views and print page errors. Then walk the person through the manual checks: every object and menu item opens, every link works in a private window, the contact form arrives (FormSubmit needs a one-time activation email), sound off still works, keyboard-only navigation works, and one friend visits without help.

## Stages 10 to 13 · Launch and protect

Read `references/launch-and-protect.md`. It covers GitHub plus Vercel deployment (the main page must be `index.html` at the top level; the GitHub website uploads at most 100 files at a time), custom domains, pushing changes through the Claude GitHub App, and protection: a private repository, `assets/robots.txt` and `assets/vercel.json` for AI crawlers, Vercel's AI bot blocking, and a copyright line. Be honest that nothing public is copy-proof.

## Optional deliverables

People who finish often want to teach the process. A handout and a slide deck can follow the 13 stages; use real screenshots of their site (before and after) rather than stock imagery, and write speaker notes in their voice. `scripts/html_to_docx.py` turns a project document with design notes into Word.

## Common failures

| Symptom | Cause | Fix |
|---|---|---|
| 404 on Vercel | Main file not `index.html`, or inside a folder | Rename and move to the top level |
| Laptop folders or gallery empty online | `projects/` or other folders never uploaded | Upload them beside `index.html` |
| Old version showing | Cache or deployment still running | Wait for Ready, then hard refresh |
| "Cannot access X before initialization" | A function or texture used before its `const` line | Hoist it (a `function` declaration) or move the use later |
| Clicking an object opens a neighbour | Decorative line object catching rays | `obj.raycast = () => {}` |
| Push to GitHub refused | Claude GitHub App not installed on the repo | Install it for that repo; a new session may be needed |

# Interactive 3D Portfolio skill

A Claude skill for building, polishing and launching an explorable 3D portfolio website: a room in the browser where each object opens one part of your work (a chalkboard for About, a laptop for Projects, a bookshelf for skills, a mailbox for Contact).

It follows 13 stages in four phases:

1. **Plan and build:** plan the room, write the first prompt, generate a reference picture, build the room with Three.js, borrow interaction ideas
2. **Fill:** add real content with design notes, link Google Docs, Slides and Drive
3. **Polish:** iterate round by round, test on real devices
4. **Launch and protect:** deploy on GitHub and Vercel, add a custom domain, auto-update GitHub, protect your design and your learners

## Install

- **Claude.ai:** download `interactive-3d-portfolio.skill` from this repository, then add it under Settings → Capabilities → Skills.
- **Claude Code:** copy the `interactive-3d-portfolio/` folder into `~/.claude/skills/`.

Then ask Claude something like "I'm a teacher and I want a portfolio that feels like a cozy classroom you can walk around in."

## What's inside

| Path | Contents |
| --- | --- |
| `interactive-3d-portfolio/SKILL.md` | The workflow, working style, honesty and privacy rules, iteration lessons |
| `references/build-patterns.md` | Three.js scene patterns: hotspots, hover glow, camera moves, objects in code, laptop desktop, walk-through gallery, sound, cursors |
| `references/content-and-docs.md` | Content formats, design notes, Google file sharing, privacy work |
| `references/launch-and-protect.md` | Deployment, domains, pushing updates, protection from copying and AI crawlers |
| `scripts/screenshot_site.js` | Desktop and phone screenshots of a local site, with page errors |
| `scripts/html_to_docx.py` | Turns a project document with design notes into Word |
| `assets/robots.txt`, `assets/vercel.json` | Templates that ask AI crawlers to stay out |

Created by Rachel (Qiuqiu) Zhao, M.S. Learning Design and Technology, Stanford.

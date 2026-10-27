# Content and documents (Stages 6 and 7)

## Getting the content

1. List every placeholder still in the site, section by section, and show the person the list.
2. Ask for real sources: CV, LinkedIn text, project files, links, photos. Draft from them; never invent.
3. Fill one section per round and let the person correct facts and voice.
4. Read the final text for exaggeration. A modest true claim beats an impressive one that fails in an interview.

## Writing for reviewers

- Lead each project with what was designed, for whom, and what changed.
- Real artifacts first: lesson plans, handouts, rubrics, assessments, code, game assets.
- Design notes beside the key decisions name the decision and the theory behind it (cognitive load and segmenting, scaffolding and ZPD, ICAP, UDL, backward design, retrieval practice, noticing, Norman's signifiers, Mayer's coherence principle, MDA for games). Ground each note in what the artifact actually does.
- Remove dates that make good work look old; keep ones that matter (graduation).
- Testimonials: words before photos.

## `projects/desktop.json`

```json
{
  "folders": [
    {
      "id": "csp",
      "name": "Reading lesson · Concentrating Solar Power",
      "note": "Lesson design · Wenzhou Business College",
      "files": [
        { "name": "Design rationale", "kind": "doc", "src": "projects/csp/design-rationale.html", "docx": "projects/csp/design-rationale.docx" },
        { "name": "Lesson slides", "kind": "slides", "href": "https://docs.google.com/presentation/d/…/edit?usp=sharing" },
        { "name": "Game assets", "kind": "photos-doc", "src": "projects/game/assets.html" },
        { "name": "Play the story", "kind": "game", "src": "projects/fox/play.html" }
      ]
    }
  ]
}
```

Kinds that open inside the laptop: `doc`, `photos-doc`, `code`, `game`. Kinds that open a new tab: `slides`, `video`, `photos`, `link`. Folder order is the order on the desktop; the person usually wants their strongest or newest project first.

## Document fragments

A project document is an HTML fragment (no `<html>` or `<body>`), fetched into the laptop window:

```html
<h1>Design rationale</h1>
<p class="sub">Reading lesson · Concentrating Solar Power · Wenzhou Business College</p>
<table class="glance"><tr><th>Learners</th><td>…</td></tr></table>
<h2>Decision 1 · Reading circles mapped to the IELTS skill</h2>
<p>…</p>
<aside class="dn"><b>Design note · Cognitive load</b>Splitting the text into roles…</aside>
<figure><img src="projects/csp/media/board.jpg" alt="…"><figcaption>…</figcaption></figure>
<div class="gal two"><img src="…" alt="…"><img src="…" alt="…"></div>
```

Image paths are relative to the site root, because the fragment is rendered inside `index.html`.

Word copies: `python scripts/html_to_docx.py projects/csp/design-rationale.html projects/csp/design-rationale.docx "Design rationale" <site_root>` (needs pandoc and python-docx). Design notes become shaded boxed paragraphs; pass the site root so images are embedded.

## `treasure/gallery.json`

```json
{
  "title": "Letters & moments from my students",
  "items": [
    { "type": "letter", "title": "Dear Rachel,", "text": "My most favorite teacher, …", "from": "Aglaia", "caption": "A letter from Aglaia" },
    { "type": "video", "src": "treasure/wishes.mp4", "poster": "treasure/wishes.jpg", "caption": "A notebook of wishes from my students" },
    { "type": "image", "src": "treasure/note-1.jpg", "caption": "Thank-you note" }
  ]
}
```

Rotate videos with ffmpeg before publishing rather than with CSS. Convert iPhone HEIC photos with pillow-heif.

## Google Docs, Slides and Drive

1. Share → General access → Anyone with the link → Viewer. Never Editor.
2. Open the link in a private window to confirm no sign-in.
3. University accounts often block public sharing. If a sign-in page appears, move the file to a personal account or host it on the site (render PDFs to JPEG with `pdftoppm -r 110`).
4. Check every file for student names, faces, grades and private comments before linking.

## Privacy work that is often needed

- Research code and notebooks: replace real IDs and site labels ("District A", "Track B"), remove seeds and case IDs that identify people, and get the supervisor's approval before publishing.
- Dissertations: publish without student numbers, transcripts, participant responses, consent and information sheets, and copyrighted readings.
- Photos: blur every face that has not agreed, including people in the background. With Pillow: crop each face box, downscale by 10, upscale, Gaussian blur, paste through a soft elliptical mask. Look at the result before publishing, and keep the unblurred original out of the site folder.

# Build patterns (Stages 2 to 5)

Proven patterns for a single-file Three.js room portfolio. Adapt names and numbers; keep the structure.

## Contents
1. File layout
2. Scene setup and post-processing
3. Hotspots: hover glow, labels, clicks
4. Camera moves and zoom
5. Modelling objects in code
6. Canvas textures (chalkboard, book spines, screens)
7. HTML overlays pinned to 3D objects
8. Panels, menu and keyboard
9. The laptop as a desktop of project folders
10. A walk-through gallery for testimonials
11. Sound
12. Custom cursors
13. Accessibility and performance

## 1. File layout

```
index.html              the whole scene, styles and UI
projects/desktop.json   laptop folders and files (see content-and-docs.md)
projects/<id>/*.html    project documents (HTML fragments with design notes)
projects/<id>/*.docx    Word copies
treasure/gallery.json   testimonials gallery items
treasure/*.jpg|mp4      gallery media
robots.txt, vercel.json protection (launch-and-protect.md)
```

Load Three.js with an import map pinned to an exact version:

```html
<script type="importmap">
{ "imports": {
  "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
  "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/"
}}
</script>
<script type="module">
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
```

Order matters inside the module: `const` and `let` are not hoisted, so a texture or helper used before its definition throws "Cannot access X before initialization" and the whole scene goes blank. Define helpers first, or use `function` declarations.

## 2. Scene setup and post-processing

- `renderer.toneMapping = THREE.ACESFilmicToneMapping`, `outputColorSpace = SRGBColorSpace`, soft shadows on a few key lights only.
- Environment light from `new RoomEnvironment()` through a PMREM generator gives warm, even fill; add a lamp `PointLight` and a window `DirectionalLight` for mood.
- Composer: RenderPass → UnrealBloomPass (subtle: strength about 0.5, threshold about 0.9) → OutlinePass (hover glow) → OutputPass.
- Expose `window.__studioReady = true` after the first frame so tests can wait for it.

## 3. Hotspots: hover glow, labels, clicks

```js
const hotspots = [];
function hot(obj, section, label) { obj.userData.section = section; obj.userData.label = label; hotspots.push(obj); return obj; }

function pick(x, y) {
  mouse.set(x / innerWidth * 2 - 1, -(y / innerHeight) * 2 + 1);
  ray.setFromCamera(mouse, camera);
  for (const h of ray.intersectObjects(hotspots, true)) {
    let o = h.object; while (o && !o.userData.section) o = o.parent;
    if (o) return o;
  }
  return null;
}
```

- On `pointermove`: set `outline.selectedObjects = [hovered]`, show a small label near the pointer, set `cursor: pointer`.
- On click (pointer moved less than about 6 px since pointerdown): `open(o.userData.section)`.
- `outline.pulsePeriod = 2.4` while a section is open can make one object in it pulse gently to say "click me too".
- Decorative `Line` or `LineSegments` (wireframes) catch rays from about a metre away: give them `raycast = () => {}`.
- A hotspot that is a child of another hotspot group gets swallowed by its parent's outline; add it to the scene directly.

## 4. Camera moves and zoom

```js
function tweenCam(pos, tgt, dur = 1.6) {
  tween = { p0: camera.position.clone(), t0: controls.target.clone(), p1: pos.clone(), t1: tgt.clone(), start: performance.now(), dur: reduceMotion ? .01 : dur };
}
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
// in the render loop: k = min(1, elapsed / dur); lerp position and target with ease(k); clear tween at k = 1
```

- Keep one `SECTIONS` table: `{ id: { title, eyebrow, pos: [x,y,z], tgt: [x,y,z] } }`. The panel opens on the right, so aim the target to the right of the object; the object then sits in the visible left area.
- Replace OrbitControls' zoom with your own wheel handler: trackpad pinch arrives as `ctrlKey` wheel events with small deltas, so scale those about 5 times more than mouse wheel deltas. People find default zoom far too sensitive.
- Zooming in on a group (the desk) frames all its objects with a bounding box; zooming back out leaves it, and a visible back button helps people who do not think to zoom.

## 5. Modelling objects in code

Build furniture from `BoxGeometry`, `RoundedBoxGeometry`, `CylinderGeometry`, `LatheGeometry` (vases, lamp shades), `TubeGeometry` along a `CatmullRomCurve3` (handles, cables) and `ExtrudeGeometry` (arches). Use `InstancedMesh` for many leaves and `Points` for dust motes.

Keep real-world sizes in metres. A book lying flat is about 0.33 to 0.38 long, 0.06 to 0.07 thick and 0.22 to 0.25 deep. Upright books are 0.035 to 0.075 wide and 0.36 to 0.55 tall. A mug handle is a `TorusGeometry` arc attached to the side, not floating.

Shelves people browse: put titled, interactive books at eye level and on the side nearest the info panel; fillers elsewhere.

## 6. Canvas textures

```js
function canvasTex(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
```

- Chalkboard: dark green base, faint smudges, a handwriting font for the motto. Keep the blank board in a second canvas so an eraser can restore it with `drawImage` clipped to an ellipse.
- Book spines: canvas sized to the spine's aspect (for example 1024×192 for a flat book), gold bands, a title that shrinks to fit. A spine whose canvas aspect differs from the face looks stretched.
- Laptop and phone screens: draw the same desktop the HTML overlay will show, so the screen looks right from across the room.
- Paper or board art in a bright scene: tint the material colour slightly below white (for example `0xb8a684`), or bloom washes it out.

## 7. HTML overlays pinned to 3D objects

For a real link over a framed picture (LinkedIn), project the frame's four corners every frame and position an absolutely placed `<a>` over their bounding box; hide it when behind the camera or during a camera move. The same projection places a toolbar under a chalkboard: project the board's bottom-centre and set `left`/`top` with `transform: translateX(-50%)`, `width: max-content`.

## 8. Panels, menu and keyboard

- A right-hand panel per section, filled from `<template id="t-<section>">`. Footer links name the previous and next sections ("Next: Toolkit"). If a section has no menu button, fall back to a readable name, or the lookup throws.
- Menu top-left, short labels, hover grows the pill smoothly with even padding.
- Esc closes the panel and returns the camera; `prefers-reduced-motion` shortens tweens to near zero.

## 9. The laptop as a desktop of project folders

Clicking the laptop grows a fake operating-system desktop out of the projected screen rectangle (animate `clip-path` from the screen's rect to full size). Folders come from `projects/desktop.json`; each opens a draggable window.

- Window title bar with three buttons: close, minimise (collapse to the title bar), maximise (fill the desktop; remember the old geometry). Show × − + glyphs when the pointer is over the button group, scale the hovered one slightly. Double-clicking the title bar maximises. Animate size changes only during the toggle, not while dragging.
- File kinds: `doc` (fetch the HTML fragment and render it, with design notes in the margin), `photos-doc` (a gallery document), `code` (a notebook rendered as HTML), `game` (an iframe of a self-contained HTML game), and link kinds (`slides`, `video`, `photos`, `link`) that open a new tab.
- Images inside documents open larger on click or Enter.
- Design notes: `<aside class="dn"><b>Design note · Title</b>text</aside>` in the fragment; on open, rebuild each into a numbered margin note. Use a container query so notes move into the margin only when the window is wide, and hide the "Highlight design notes" toggle when a document has none.

## 10. A walk-through gallery for testimonials

A dark corridor in CSS 3D (`perspective` on the stage, `transform-style: preserve-3d` on the world) with items placed alternately left and right at increasing depth; scrolling, dragging, two-finger swipe and arrow keys move the camera forward (up arrow forward, down arrow back). Items come from `treasure/gallery.json`; letters are typed cards, images and videos are framed. Click opens a lightbox; Esc closes it. A short intro title fades once movement starts. A progress bar and a small control legend sit at the bottom. Order: words first, photos after.

## 11. Sound

Generate sound with the Web Audio API so there are no files: chalk is band-passed noise whose gain follows stroke speed; an eraser is low filtered noise; a book sliding is a short noise sweep. Background music can be a simple generative loop, but tastes vary a lot, so offer a mute button and accept a licensed audio file if the person prefers. Start audio only from a user click.

## 12. Custom cursors

Over a drawable board, set `canvas.style.cursor` to an SVG data URI of the tool, coloured with the selected chalk, with the hotspot at the tip:

```js
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32">…fill="${chalkColor}"…</svg>`;
canvas.style.cursor = `url("data:image/svg+xml,${encodeURIComponent(svg)}") 3 29, crosshair`;
```

Cache one cursor string per colour. Keep it 32 px for Windows.

## 13. Accessibility and performance

- `aria-label` on icon buttons, visible `:focus-visible`, every section reachable from the menu by keyboard.
- `prefers-reduced-motion`: no camera flights, no pulsing.
- Cap `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))`; compress photos to about 1600 px JPEG; lazy-load gallery images.
- On phones, panels become bottom sheets and toolbars move to the top.

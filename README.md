# Lin Khant — Formula Edition · RB22 model edition

React 19 + TypeScript + Vite portfolio for Lin Khant. Black / racing-red design with recruiter-focused content and an actual car mesh (supplied in `2026-redbull-rb22.zip`) behind the homepage introduction.

## Start locally

Install Node.js 20.19+ or 22+ and run:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`.

Build and verify before publishing:

```bash
npm run typecheck
npm run build
npm run preview
```

**Note:** The source was assembled in an environment without npm registry access, so a complete production build was not possible there. Run these commands in your own development environment and report any build errors.

## Formula car background and interactions

- The **actual supplied GLB geometry** is loaded by `public/rb22-viewer.html`, rendered through Three.js and `GLTFLoader`.
- Model asset: `public/models/formula-rb22-optimized.glb` (approximately 10 MB, reduced from 37.5 MB by resizing and recompressing texture data). All body shapes are supplied-model geometry, not a procedurally invented replacement.
- **Hero only:** the car is visually behind `LIN KHANT` and the portfolio content. The HTML text and links stay in front.
- The 3D iframe has `pointer-events: none`; a limited transparent hover zone reacts to mouse entry/exit and pointer movement. The normal page can scroll even when the cursor is over the car.
- The original GLB contains *one mesh with 27 material primitives*, not semantically separate mechanical pieces. The viewer divides triangles into approximate physical regions (nose, wings, wheel areas, sidepods, cockpit, body) to animate a **stylized exploded view**, preserving original exterior geometry. An authentic engine-level teardown would require a separate detailed engine and suspension model.
- Black and crimson material treatment replaces recognisable team-branding materials; metallic finish and selected carbon textures remain.
- **Continuous rotation:** the car slowly spins on the hero background while its parts assemble. Desktop hover over the right-hand car region smoothly separates the body regions; pointer leave reassembles them while rotation continues. There is no Play button or cinema overlay.
- Mobile and reduced-motion visitors see the still artwork rendered from the supplied mesh (`public/images/formula-hero-poster.webp`).
- The car background is intentionally semi-transparent, with deep charcoal text scrims to avoid bright bands behind the name.
- When WebGL, external Three.js CDN or the GLB cannot load, the static poster remains visible; the portfolio text and navigation still function.
- The rendering loop pauses while hidden, including when the tab is not visible. A capped pixel ratio limits GPU load.
- The 3D viewer imports Three.js from jsDelivr and therefore needs access to the CDN. For fully offline deployment, install `three` through npm and bundle the viewer into the Vite app.

**Model rights:** Only publish or redistribute the supplied RB22 asset if you have permission under its original licence. The enclosed version is restyled to avoid using the source team's livery as portfolio branding, but redistribution terms still apply.

## Personal data, projects and media

Edit `src/data/portfolio.ts` to change profile details, projects, descriptions, repository/demo URLs, image paths and optional videos. The six main projects are preserved. The project detail dialogs include **interactive portfolio mini-previews** of selected flows, not live instances of the production backends. Do not describe them as real API-connected deployments.

To add screenshots, put `.webp`, `.png`, etc. in `public/images/projects/` and update each project's `screenshot` path. When an image is unavailable, the card shows designed title artwork instead of claiming to be a screenshot. For videos, store `.mp4` or `.webm` in `public/videos/` and set a real `video` URL. The About section intentionally uses a skills-based panel instead of a portrait.

The seven original archived UI effects from `Projects(2).zip` are integrated into `public/ui-effects/` as working, visually isolated HTML/CSS/JavaScript interactions. These are third-party effects, **not your original authored portfolio projects**. The source archive's licence permits use in personal/commercial projects but forbids reselling, reuploading, redistributing or claiming the standalone pack as your own product. Keep these files embedded as working effects in your site, credit their creator if known, and do not publish the effect pack itself as an original repository.

## Deploy

**Netlify:** Connect the GitHub repository; build command `npm run build`, publish directory `dist`. `netlify.toml` and `public/_redirects` include SPA reload rules.

**Vercel:** Import the repository; framework Vite, build command `npm run build`, output directory `dist`. `vercel.json` provides the direct-page fallback.

## Accessibility

Semantic headings, skip navigation, sticky active-section navigation, keyboard-operable menu, native project dialogs, scroll progress, copy-email feedback, bookmark persistence and reduced-motion handling are included. The original UI effects open in native accessible dialogs that support Escape and do not change your portfolio styling. The large 3D background is decorative and does not intercept page scrolling.


## Formula car upright orientation and visual balance

`public/rb22-viewer.html` rotates the GLB's original geometry +90° around X, matching its authored local coordinate system. The prior -90° rotation was upside-down. The viewer is a non-interactive `iframe` behind the text; a dedicated transparent hover zone sends interaction messages. `src/refinements.css` dims the car opacity further and darkens the formerly bright hero region without modifying the model or the original UI effects. The static mobile poster is still available.

## Original working UI effects vs complete application deployments

The seven cards under **Interactive UI studies** launch the actual supplied HTML/CSS/JavaScript effects inside individual iframes. The UI files retain their original colors, layout and scripts. The React overlay supplies only a title, accessibility controls and an authorship notice. Each interaction also has an Open Full Size link. Their visual thumbnails on the card are labelled illustrations, not captured screenshots.

The six main GitHub application cards still point to your actual repositories. Their embedded mini-panels are **simplified UI previews**, not full copies of the deployed projects or backend-connected systems. To make those exact apps work within the portfolio, use the applications' complete source code and their own production APIs, or link genuine deployments via the `demo` property in `src/data/portfolio.ts`.

The floating F1 wheel acts as a back-to-top control and rotates with page scroll; it contains no arrow. The internship availability indicator is green.

## Source rights

Your supplied `Projects(2).zip` explicitly allows using the *effects* in personal and commercial websites but forbids repackaging/reselling/redistributing the original pack as a separate product or claiming it as your own. Here, only the effect code needed to run inside the portfolio is placed in `public/ui-effects`; there are no independent resale/promotion pages for the pack. Verify its authorship attribution and any additional conditions before making the full portfolio repository public, because a public source repository would expose these original files for download. If necessary, host these effects separately with the creator's permission or replace them with independently written adaptations.

The 3D model has its own licensing requirements; see the model rights note above. The source includes a restyled model for local portfolio use but this alone does not grant redistribution rights.


## Real GitHub project screenshots (automatic capture)

This project now includes `npm run capture:projects`. It downloads *your real public GitHub project code*, runs each Vite frontend locally, and uses Chromium to capture real 1440×900 browser output directly into the correct project image paths. **The ZIP intentionally does not include fabricated or generated screenshots.** Until you run capture, uncaptured cards display branded title artwork.

Run these commands **on your computer with internet access**, from the portfolio folder:

```bash
npm install
npx playwright install chromium
npm run capture:projects
npm run dev
```

Requirements: Git, recent Node.js (22.16+), and internet access to GitHub/npm. On first execution the script clones each project into `.local-project-captures/` (excluded from Git). It checks out the five browser-based repositories: Classroom Dashboard (`client/`), QuickDine (`Client/`), Personal Portfolio, Lumi Movie App, and Habit Tracker. It runs `npm install` in each repo, starts its actual Vite frontend, and captures screenshots in `public/images/projects/` only after the page renders. The ZIP contains no local clones of those repositories.

These are **real pages from the code**, not simulated project thumbnails. Some pages may show login/loading/empty states until their optional API services or TMDB credentials are configured. Review the captured results before publishing, and retake screenshots after setting up any needed backend/demo data. The capture script will skip obviously blank/error pages; it doesn't claim they are working app demonstrations.

Your Python/Tkinter Flappy Bird desktop game cannot be screenshotted by a headless web browser. Run it locally, capture the actual game window, and save the image as `public/images/projects/flappybird.png` (the matching project path is already configured). No synthetic game screenshot is provided.

The existing live Personal Portfolio deployment is connected as a genuine demo at `https://linkhantv1.netlify.app/` and has an embedded preview in its project detail dialog. The embedded preview depends on external-site iframe policy; the external Live Demo link works independently.

Screenshot paths and live demo URLs are editable in `src/data/portfolio.ts`. To keep images small, optionally convert captured PNGs to WebP and update the file extensions there before deployment. Do not commit `.local-project-captures/`.

## Interactive car parts

The homepage uses the supplied Formula-style RB22 GLB as a rotating background. Hover over the car to disassemble it, then click a visible part to read a short explanation and highlight that exterior region. You can also choose a part from the labeled selector using the keyboard. Escaping the hover area reassembles the car. The component descriptions are explanatory, and the mesh partitioning is approximate: the uploaded 3D model does not contain modeled internals or individually named mechanical assemblies.

On small screens or with reduced-motion enabled, the 3D render is replaced by a static car poster; the selector remains usable as a part guide. Neither the car nor its controls hijack wheel scrolling.

**Screenshots:** The `capture:projects` script from the previous edition is unchanged. Run it to obtain actual project screenshots; if a screenshot does not exist, the card displays styled project title artwork instead of a misleading fake screenshot.

## V7 — live applications and car-part mapping fixes

Three verified user-supplied deployed URLs are configured in `src/data/portfolio.ts`:

- Habit Tracker → https://habitotraka.netlify.app/
- QuickDine → https://quickodinos.netlify.app/
- Lumi Movie App → https://lumimovieapp.netlify.app/

Each project card and detail view now prioritizes **Launch Live App** while retaining **GitHub** for source code. These live sites open in a new tab, rather than an iframe that may be blocked by the destination site's security policy. The smaller React panels are labelled local interactive previews.

The previous Habit Tracker (and movie preview) blank-dialog bug was a missing `useEffect` import in `src/components/LiveProjectPreview.tsx`. That hook import has been corrected. If any deployed site itself displays a blank screen, troubleshoot that deployment separately; the portfolio does not control external applications.

The provided GLB faces its local **+Y direction**, and its rear light is located toward **−Y**. The F1 viewer previously inverted its rear/front mapping. `public/rb22-viewer.html` now maps front wing/nose/wheels to +Y and rear wing/body/wheels to −Y, with corresponding explosion pivots and camera targets. Choosing an exterior part still zooms to it; rotation slows while selected. These are approximate geometry zones, not named mechanical parts within the original GLB.


## V8: Neon red and centered wheels

The header Home wheel and floating back-to-top wheel now share the same **centered square asset** (`public/images/f1-wheel.png`). The scroll-to-top tyre has no arrow and still rotates as the page moves. Its rotation is disabled under reduced-motion preferences.

`src/neon.css` is the final CSS layer: edit `--neon-red`, `--neon-hot` and `--neon-deep` there to adjust the red lighting without touching the original layout or the green internship-available indicator. The GitHub capture script, interactive UI effects, live project links and F1 part-inspection features are unchanged.

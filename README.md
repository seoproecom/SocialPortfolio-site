# Patricia — Social Media Portfolio

Complete editable React + TypeScript project for VS Code. Includes all 34 artwork assets, eight brand chapters, animated opening scenes, artwork gallery and contact sections.

This edition applies the approved hero design throughout the page: one Manrope type system, emerald backgrounds, ivory text and artwork frames, lime accents, matching clipped-gradient action buttons, and consistent spacing. Brand-book copy and artwork colours remain specific to each collection. Decorative rings and the handwritten contact accent have been removed. The GSAP opening sequence and Framer Motion brand-book spread transitions are preserved.

The hero uses the supplied perspective-ring reference with 37 artwork frames, a centered social-media headline, a clipped citron-gradient CTA, and unobstructed artwork frames. It adapts to a flow column on phones and freezes when animations are paused or reduced motion is enabled. The existing selected-work and discovery scroll scenes follow the new hero.

The gallery adapts the supplied 3D gallery reference into a draggable sphere of 21 selected posts, with a centered headline and a grid of all 34 artworks. Drag horizontally or use the arrows to rotate; click a post to open its brand story. Complete artwork is shown without cropping across the featured frames. The image-left / story-right viewer, animated contact section, opening scenes, and brand books are preserved. The Creative with intent section has been removed. Counts reflect the actual collection; no performance metrics are invented.

## Open in VS Code

1. Extract the ZIP.
2. In VS Code, choose File > Open Folder and select `patricia-social-portfolio` (the folder containing `package.json`).
3. Use Node.js 22.12 or newer. Node.js 20.19 is also supported by this Vite version.
4. Open Terminal > New Terminal and run:

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:4180/ in your browser. Keep the terminal running while editing; changes update automatically. Press Ctrl+C to stop.

If PowerShell blocks `npm.ps1`, use `npm.cmd ci` and `npm.cmd run dev` instead.
If port 4180 is already in use, stop the existing preview or run `npm run dev -- --port 4181` and open the URL shown in the terminal.

## Production build

```sh
npm run build
npm run preview
```

The generated website is in `dist/`. A built copy is included in the ZIP. Serve it through a web server rather than opening index.html directly. The source project supports hosting at the domain root; image paths use `/assets/work/`.

## Main files

- `src/App.tsx`: opening scenes, navigation, artwork modal, Fiverr links.
- `src/BrandBook.tsx`: brand tabs, story copy, captions, and spread transitions.
- `src/EndSections.tsx`: artwork gallery and animated contact section.
- `src/HeroRing.tsx`: hero ring geometry, resize handling, visible-card culling, and motion controls.
- `src/hero-ring.css`: responsive hero composition.
- `src/portfolio-system.css`: shared palette, typography, controls, artwork frames, viewer, and responsive styling; loaded last.
- `src/PostSphere.tsx`: 3D post sphere, drag inertia, keyboard rotation, grid view, and artwork selection.
- `src/post-sphere.css`: sphere layout, complete-artwork frames, and responsive refinements; loaded before hero-ring.css.
- `src/index.css`: base visual styling and responsive layouts.
- `src/refinements.css`: final book and ending-section styling; loaded after the base stylesheet.
- `src/studio-theme.css`: current emerald / ivory visual direction, brand colour treatments, rounded panels, and responsive overrides; loaded before the living studio refinements.
- `src/living-studio.css`: hero, gallery, sculptural motion, and responsive refinements; loaded before post-sphere.css.
- `src/collections.json`: brand groups and artwork order.
- `public/assets/work/`: all 34 optimized WebP artwork files.
- `public/favicon.svg`: favicon.
- `index.html`: page title and metadata.
- `vite.config.ts`: development and build configuration.

## Content and behavior

The site uses the supplied Fiverr profile for identity and experience. Editorial notes describe the provided artwork and are editable; they do not claim campaign performance. Google Fonts requires an internet connection. Artwork is stored locally. The site respects reduced-motion preferences and includes an animation pause control.

No backend, API keys, or Sites platform account is required. Contact buttons link to Fiverr. Dependencies are pinned by `package-lock.json`; `npm ci` installs the matching versions.

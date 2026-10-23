# Developer Portfolio

A responsive, accessible developer portfolio built with plain HTML5, CSS3 and JavaScript (ES6+). No build step required.

## Features
- Semantic structure: header, hero, about, skills grid, featured projects, resume, contact
- Mobile-first layout using CSS Grid and Flexbox
- Dark/light theme toggle (remembers your choice, respects system preference)
- Smooth-scrolling navigation with active-section highlighting
- Mobile hamburger menu
- Project detail modals using the native `<dialog>` element
- Keyboard accessible, with reduced-motion support

## Project structure
```
index.html
css/style.css
js/script.js
```

## Customize
1. Replace "Your Name", email and social links in `index.html`.
2. Edit the `projects` array in `js/script.js` with your real projects and links.
3. Add your `resume.pdf` to the project root.

## Run locally
Open `index.html` in a browser, or run `npx serve .`

## Deploy
**GitHub Pages:** push to GitHub, then Settings → Pages → Deploy from branch → `main` / root.
**Netlify / Vercel:** import the repo; no build command, publish directory is `/`.

## Live site
https://your-username.github.io/portfolio/

## License
MIT

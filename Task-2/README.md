# Dynamic Task Manager & Productivity Tracker

A responsive task management app built with vanilla HTML5, CSS3 and JavaScript (ES6+). It has **zero server dependencies**: all data lives in the browser's `localStorage`, so tasks survive page reloads.

## Features
- **Create** tasks with a title, category (Work, Personal, Study) and optional due date
- **Read** tasks in a list with category colours, overdue highlighting and live counts
- **Update** tasks: edit title, category and due date in a dialog, or tick the checkbox to complete
- **Delete** a single task or clear all completed tasks
- **Filter** by status (All, Active, Completed) and by category
- **Search** tasks by title
- **Drag-and-drop** reordering
- **Animations** for adding, completing (strike-through and pulse) and removing tasks
- **Persistence** through `saveToLocalStorage()` and `loadFromLocalStorage()`
- Accessible: labelled controls, keyboard focus styles, ARIA live summary, reduced-motion support
- Automatic dark mode based on system preference

## State management
```js
let tasks = []; // { id, title, category, due, completed }
```
Every change updates the array, saves it to `localStorage`, then re-renders the list.

## Project structure
```
index.html
css/style.css
js/app.js
```

## Run locally
Open `index.html` in a browser. No install or build step.

## Deploy
Upload to GitHub Pages, Netlify or Vercel (no build command, publish directory `/`).

## Reference
[MDN localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

## License
MIT

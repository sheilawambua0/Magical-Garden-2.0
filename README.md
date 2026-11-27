# Magical Garden

Browser-based HCI project for children aged 8-10: three short activities (Flower Match, Help the Bee, Butterfly Garden) bring a colourless garden back to life. HTML, CSS and vanilla JavaScript; no backend or install.

## Run
Open `index.html` in a modern browser (double-click it), or run `python3 -m http.server` in this folder and visit http://localhost:8000.

## Structure
- `index.html` - page shell, intro, garden hub, activity container, completion panel
- `style.css` / `tokens.css` - shared styles and design tokens
- `script.js` - state, navigation, restart, activities
- `assets/` - SVG illustrations (see `assets/CREDITS.md`)
- `integration-notes.md` - contract every activity must follow
- `garden-state-map.md`, `completion-notes.md` - garden visuals and HCI notes (Member 4)

## Workflow
`main` is stable; never push to it directly. Work on `feature/<name>` branches and open a pull request for review.

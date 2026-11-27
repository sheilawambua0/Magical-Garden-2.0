# Integration Notes (Member 1)

## Screens
`currentScreen`: `intro` | `garden` | `flowerMatch` | `helpBee` | `butterflyGarden` | `complete`

## Shared state (`window.appState`)
- `currentScreen`
- `completedActivities` `{ flowerMatch, helpBee, butterflyGarden }` (booleans)
- `progress` 0-3 (derived; never keep your own counter)
- `selectedItem` null or an id string

## How to add your activity (Members 2 and 3)
Do not create your own navigation or progress counter. In `script.js`, in your own clearly marked block, register a render function:

```js
window.registerActivity('helpBee', function renderHelpBee(root, api) {
  // build your UI inside `root`
  // api.showFeedback('message', 'good' | 'try-again')
  // api.state  -> shared state
  // when the child finishes, call once:
  api.completeActivity('helpBee');
});
```
Activity ids: `flowerMatch`, `helpBee`, `butterflyGarden`. Title/instructions are set in the `ACTIVITIES` table at the top of the Member 1 block (edit the `instructions` string for your activity).

## What `completeActivity(id)` does
Marks the activity done, recomputes progress, calls Member 4's `onActivityComplete(id)` (colours the garden section, updates the progress text, shows the completion panel at 3/3), then returns the child to the garden hub.

## Restart
`window.resetApp()` clears state and selections, calls Member 4's `resetGarden()`, and returns to the intro. The header Restart button and Member 4's Play Again both use it.

## Other helpers
`window.showFeedback(msg, kind)` writes to the shared status area.

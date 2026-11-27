# Garden Visual State Mapping

## Muted (default) state
Garden sections start desaturated (CSS `filter: saturate(0.3)`).
Intro message explains the garden needs help.

## Station → garden element mapping
| Activity         | Data key         | Garden element   | Trigger |
|------------------|------------------|------------------|---------|
| Flower Match     | flowerMatch      | #flower-patch    | onActivityComplete('flowerMatch') |
| Help the Bee     | helpBee          | #bee-area        | onActivityComplete('helpBee') |
| Butterfly Garden | butterflyGarden  | #butterfly-area  | onActivityComplete('butterflyGarden') |

## State rules
- Not started: muted, station shows label + Play button
- Completed: full colour, station shows ✓ Done badge (icon + text, not colour alone)
- All 3 complete: #completion-panel shown, Play Again button focused

## Implementation
- Each section: `.garden-section`; add `.is-complete` to colour it.
- `.is-complete` sets `filter: saturate(1)`.
- Play Again (Member 1's reset) removes `.is-complete` from all sections.
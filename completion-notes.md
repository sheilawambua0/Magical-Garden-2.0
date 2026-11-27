# Member 4 — HCI Notes and Test Checklist

## HCI rationale
**Signifiers:** each garden station is a real `<button>` with a visible text label
and a "Play" affordance, so children can tell it is interactive. Decorative SVGs
use `aria-hidden="true"`.

**Mapping:** each activity maps to a distinct garden section (left / centre / right),
so progress is spatially predictable. Completing an activity visibly colours its
matching section — direct visual feedback linking action to consequence.

**Visual feedback:** the muted→colourful transition communicates success without
relying on text alone. The ✓ Done badge uses an icon **and** text so correctness is
not signalled by colour alone (accessibility).

## Test checklist
- [ ] Garden hub shows 3 stations with visible labels
- [ ] Completing Flower Match colours #flower-patch only
- [ ] Completing all 3 shows completion panel
- [ ] Play Again resets all sections to muted and progress to 0
- [ ] Stations reachable and activatable by keyboard (Tab/Enter)
- [ ] Focus ring visible on stations and Play Again
- [ ] Assets scale on narrow screen; no layout jump
- [ ] Decorative SVGs marked aria-hidden
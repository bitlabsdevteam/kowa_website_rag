# Hero Visual Integration (v9)

## Visual Source
- Primary runtime asset: `public/images/kowa-business-visual.svg`
- Source intent: company business relationship visual positioned beside the hero narrative.
- Fallback strategy:
  - If a user-provided transparent PNG/SVG replaces this file, keep the same path contract for UI stability.

## Intended Placement
- Target route: `/` (main landing page).
- Component region: hero top row next to `Kowa Trade & Commerce` title/lead copy.
- desktop:
  - Two-column hero row (text left, visual right).
  - Visual constrained in a framed figure area; no overlap with title block.
- mobile:
  - Single-column stack, visual placed below narrative block.
  - No horizontal overflow; maintain readable spacing before next section.

## Blend Constraints
- The visual should feel integrated into the hero panel surface, not pasted as a sticker.
- Hard requirement: **no harsh white rectangle** around the asset.
- Preferred treatment:
  - transparent-background asset where possible
  - subtle blend/contain styling (`mix-blend-mode`/surface-matched framing) when source has non-transparent regions
  - edge-safe radius and soft border consistent with panel tokens
- Accessibility:
  - meaningful alt text for the visual
  - avoid decorative-only imagery without context labels

## Runtime Notes
- Docker runner must include `public/` copy step so this asset resolves in production.
- Any path changes must update both markup and this artifact to preserve traceability.

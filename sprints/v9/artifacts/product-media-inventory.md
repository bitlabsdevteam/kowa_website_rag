# Product Media Inventory (v9)

## Source Folder
- Absolute path: `/Users/davidbong/Documents/kowa_repo/kowa_rag/kowa_website_rag/images`
- Relative path: `images/`
- Total files inventoried: `13`

## Inventory Table
| File name | Normalized display name | Suggested group | Suggested caption seed |
| --- | --- | --- | --- |
| `81801_0.jpg` | Resin Material Batch 01 | Resin Materials | Bulk resin feedstock for stable sourcing |
| `86969_0_0.jpg` | Resin Material Batch 02 | Resin Materials | Classified resin lot for recycling workflow |
| `86970_0_0.jpg` | Resin Material Batch 03 | Resin Materials | Sorted material ready for downstream processing |
| `COP ペレット.jpg` | COP Pellet | Pellets and Reprocessed Output | COP pellet output for industrial reuse |
| `DSC_0011.JPG` | Facility Line 01 | Factory and Operations | Production-line context in Kowa operations |
| `DSC_0016_0.JPG` | Facility Line 02 | Factory and Operations | Material-handling setup for stable throughput |
| `DSC_0019_0.JPG` | Facility Line 03 | Factory and Operations | On-site processing environment snapshot |
| `DSC_0028.JPG` | Facility Line 04 | Factory and Operations | Equipment zone supporting recycle operations |
| `IMG_2592.jpg` | Product Shot 01 | Commerce and Distribution | Product-facing distribution visual |
| `PEダンゴ１.jpg` | PE Dango 1 | Pellets and Reprocessed Output | PE reprocessed material sample |
| `PE粉砕.jpg` | PE Crushing | Recycling Process | PE crushing stage in recycle flow |
| `Plastic Scrap.jpg` | Plastic Scrap | Recycling Process | Incoming scrap for sorting and regeneration |
| `ミクサー.JPG` | Mixer Machine | Machinery and Equipment | Mixer equipment used for blending/material prep |

## Suggested Grouping
- `Resin Materials`
  - early-stage source material visuals for procurement/trade narrative
- `Recycling Process`
  - process-step visuals (scrap, crushing, preparation)
- `Pellets and Reprocessed Output`
  - output/result visuals suitable for quality and reuse messaging
- `Factory and Operations`
  - environment and capability context for trust building
- `Machinery and Equipment`
  - equipment closeups for engineering/industrial audience
- `Commerce and Distribution`
  - outbound/catalog-style visuals for buyer-facing journeys

## Caption Style
- Keep captions short (8-14 words), concrete, and operational.
- Use present-tense, factual phrasing (avoid marketing fluff).
- Prefer function-focused wording:
  - what material/equipment is shown
  - where in process it belongs
  - why it matters to quality or continuity

## Notes for Task 10-12 Implementation
- During manifest generation, map source files to web-safe static paths under `public/images/products/`.
- Preserve original source file names in metadata for traceability.
- Include optional locale-ready caption fields (`en`, `ja`, `zh`) with English baseline first.

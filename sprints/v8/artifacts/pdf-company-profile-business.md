# PDF Company Profile - Curated Business Content

## Source files
- `pdfs/Kowa Company profile.pdf`
- `pdfs/広和通商会社案内.pdf`
- Extraction bundles:
  - `sprints/v8/artifacts/pdf-extraction/Kowa_Company_profile/`
  - `sprints/v8/artifacts/pdf-extraction/広和通商会社案内/`

## WHAT IS KOWA'S BUSINESS? (Homepage summary)
Kowa operates a resource-circulation trading model centered on plastics and industrial support. The company purchases and collects post-industrial and waste plastic, sorts and processes materials (including crushing, blending, and pelletization), and manages domestic/overseas sales with export and customs handling. The business scope also includes synthetic resin raw materials, recycled plastics processing, battery-pack development support, machinery import/export, and cross-border distribution of selected Japanese products.

## Structured company profile content (for `/company_profile`)
### Business domains
- Synthetic resin raw materials and recycled plastics trading.
- Recycled plastics processing: sorting, crushing, blending, pelletization, and transshipment.
- Battery-pack development, design, and manufacturing support.
- Import/export of processing equipment, food-processing machines, crushers, and machine tools.
- Distribution of Japanese consumer products to overseas markets.

### Process model (resource circulation)
1. Purchase and collection of production-loss and waste plastic.
2. Sorting and dismantling by resin/material characteristics.
3. Crushing, blending, and regeneration into reusable raw material.
4. Export/domestic sales and downstream product manufacturing.

### Corporate baseline facts
- Established: 1994
- Address: Reoma Bldg. 5F, 2-10-6, Mita, Minato-Ku, Tokyo 108-0073, Japan
- Main line: +81-3-3455-1699
- Related companies: G.P. Polymer Co.,Ltd.; Green-Eco-Technology Co.,Ltd.

## Evidence mapping
- **Resource-circulation mission**:
  - `Kowa_Company_profile/text_pypdf.txt` page 1-2: "TO RESOURCES AGAIN ... plastic recycle business"; domestic collection + overseas export + reprocessing narrative.
  - `広和通商会社案内/text_ocr.txt` page 1-2: Japanese mission copy about plastic recycling and social contribution.
- **Business introduction scope**:
  - `Kowa_Company_profile/text_pypdf.txt` page 3: "Business introduction" including synthetic resin/recycled plastics, battery packs, and machinery import/export.
  - `広和通商会社案内/text_ocr.txt` page 3: matching Japanese business introduction list.
- **Process flow**:
  - `Kowa_Company_profile/text_pypdf.txt` page 4: recycle flow terms (purchase, collection, sorting, crushing, regeneration, export, domestic sales).
- **WHAT IS KOWA'S BUSINESS? section heading and themes**:
  - `Kowa_Company_profile/text_pypdf.txt` page 5: explicit heading and feature themes (resource reuse, environmental protection, triangular trade, Japanese product introduction).
- **Company facts**:
  - `Kowa_Company_profile/text_pypdf.txt` page 5 and `広和通商会社案内/text_ocr.txt` page 5.

## Claim-to-source matrix
| Claim used in UI copy | Primary source |
| --- | --- |
| Kowa runs a plastics-centered resource-circulation model. | `Kowa_Company_profile/text_pypdf.txt` page 1-2; `広和通商会社案内/text_ocr.txt` page 1-2 |
| Business scope includes resin/recycled plastics trade and processing. | `Kowa_Company_profile/text_pypdf.txt` page 3; `広和通商会社案内/text_ocr.txt` page 3 |
| Business scope includes battery-pack development support and machinery import/export. | `Kowa_Company_profile/text_pypdf.txt` page 3; `広和通商会社案内/text_ocr.txt` page 3 |
| Operational flow covers purchase/collection, sorting, crushing, regeneration, and export/domestic sales. | `Kowa_Company_profile/text_pypdf.txt` page 4 |
| Corporate baseline facts (established/address/main line) are 1994, Mita address, and +81-3-3455-1699. | `Kowa_Company_profile/text_pypdf.txt` page 5; `広和通商会社案内/text_ocr.txt` page 5 |

## Extraction limitations
- OCR text quality for scanned Japanese pages contains spacing and occasional character noise.
- Final UI copy normalizes grammar and formatting while preserving factual meaning from source passages above.

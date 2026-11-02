# Valve user manual PDFs — rename table

**What to do:** put the 18 DALUI user-manual PDFs into *this* folder
(`public/manuals/`), each renamed exactly as the last column says. Nothing else
is needed — no code change, no list to update. The "Download PDF" button on
`/manuals/<slug>` picks the file up automatically on the next deploy.

Until a file is in this folder, that page shows a **Print Manual** button
(print / save-as-PDF of the on-page manual) instead of a broken download link.
That is intentional — a missing page is never offered as a download.

Source of the PDFs: Google Drive folder
<https://drive.google.com/drive/folders/19Mzo3x3-ruSHcQmaBJ_PdtuT-zfi_oMU>

## Rules for the new filename

1. Copy the name from the **Save the file as** column *character for character*,
   including the hyphens. Do not add a date, a version or a copy suffix.
2. All lower case. No spaces, no capitals, no underscores, no brackets.
3. The extension must be `.pdf` (lower case). On Windows, turn on
   *View → File name extensions* in Explorer first, otherwise you can end up
   with `butterfly.pdf.pdf`, which will not work.
4. One PDF per row. Do not put the files in a sub-folder.

## The 18 files

The Drive filenames are not reproduced here on purpose — identify each PDF by
what is written on its cover page (the **Manual title** column), which is also
the heading shown on the website page. Row order is the order the cards appear
on <https://gmdalui.co.in/manuals>, top-left to bottom-right.

| # | Card on the /manuals page | Manual title (on the PDF cover) | Save the file as |
|---|---|---|---|
| 1 | Butterfly Valve | MANUAL OF BUTTERFLY VALVES | `butterfly.pdf` |
| 2 | Sluice Gate Valve / Gate Valve | MANUAL OF SLUICE VALVES | `sluice-gate.pdf` |
| 3 | Dual Plate Check Valve | MANUAL OF CHECK VALVES | `dual-check.pdf` |
| 4 | Non Return Valve (Reflux Valve) | MANUAL OF NON-RETURN VALVES (NRV) | `non-return.pdf` |
| 5 | Air Valve (Kinetic/Double Act) | MANUAL OF AIR VALVES | `air-valve.pdf` |
| 6 | Globe Valve | MANUAL OF GLOBE VALVES | `globe-valve.pdf` |
| 7 | Ball Valve (Floating/Trunnion) | MANUAL OF BALL VALVES (FLOATING & TRUNNION MOUNTED) | `ball-valve.pdf` |
| 8 | Pressure Reducing Valve (PRV) | MANUAL OF PRESSURE REDUCING VALVES (PRV) | `prv.pdf` |
| 9 | Foot Valve (with Strainer) | MANUAL OF FOOT VALVES (WITH STRAINER) | `foot-valve.pdf` |
| 10 | Pressure Relief Valve (Safety Valve) | MANUAL OF PRESSURE RELIEF VALVES (SAFETY VALVES) | `safety-relief.pdf` |
| 11 | Tamper Proof / Air Valve | MANUAL OF TAMPER PROOF AIR VALVES | `tamper-proof.pdf` |
| 12 | Zero Velocity (Non-Slam) | MANUAL OF ZERO VELOCITY VALVES | `zero-velocity-valve.pdf` |
| 13 | Control Valve | MANUAL OF CONTROL VALVES | `control-valve.pdf` |
| 14 | Flow Control Valve (Plunger Type) | MANUAL OF FLOW CONTROL VALVES (PLUNGER TYPE) | `flow-control-plunger.pdf` |
| 15 | Wide Type Strainer | MANUAL OF WIDE TYPE STRAINERS | `wide-type-strainer.pdf` |
| 16 | Plug Valve | MANUAL OF PLUG VALVES | `plug-valve.pdf` |
| 17 | Needle Valve | MANUAL OF NEEDLE VALVES | `needle-valve.pdf` |
| 18 | Pressure Release Valve | MANUAL OF PRESSURE RELEASE VALVES | `pressure-release-valve.pdf` |

### A 19th manual exists on the site, with no PDF

`MANUAL OF Y STRAINERS` is in `data/manuals.ts` and renders at
`/manuals/y-strainer`, but there is no Y-strainer card on `/manuals` (no entry
in `data/valves.ts`), so nothing on the site links to it. It is not part of the
18-PDF Drive set. If the client ever supplies one, it must be saved as
`y-strainer.pdf`; the page will then offer it, but the page still has to be
reached by its URL directly.

## Checking the drop-in

After copying the files in, run from the project root:

```
node scripts/check-manuals.mjs
```

It lists every manual with its PDF status and exits non-zero while any PDF is
missing. With all 18 in place it should report only `y-strainer` as missing.

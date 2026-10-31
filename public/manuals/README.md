# Valve user manual PDFs

Drop the 18 DALUI user-manual PDFs in this folder, renamed exactly as listed below.
Each file is served at `/manuals/<slug>.pdf` and is picked up automatically by the
"Download PDF" button on `/manuals/<slug>` — no code change is needed.

Until a file is present, that page shows a "Print Manual" button (browser print /
save-as-PDF of the on-page manual) instead of a broken download link.

Source: Google Drive folder
https://drive.google.com/drive/folders/19Mzo3x3-ruSHcQmaBJ_PdtuT-zfi_oMU

| Source PDF from Drive | Rename to (drop in this folder) |
|---|---|
| GMD_User_Manual_01_Butterfly_Valves.pdf | butterfly.pdf |
| GMD_User_Manual_02_Sluice_Gate_Valves.pdf | sluice-gate.pdf |
| GMD_User_Manual_03_Dual_Plate_Check_Valves.pdf | dual-check.pdf |
| GMD_User_Manual_04_Non_Return_Reflux_Valves.pdf | non-return.pdf |
| GMD_User_Manual_05_Air_Valves_Kinetic_Double_Acting.pdf | air-valve.pdf |
| GMD_User_Manual_06_Globe_Valves.pdf | globe-valve.pdf |
| GMD_User_Manual_07_Ball_Valves_Floating_Trunnion_Mounted.pdf | ball-valve.pdf |
| GMD_User_Manual_08_Pressure_Reducing_Valves_PRV.pdf | prv.pdf |
| GMD_User_Manual_09_Foot_Valves_with_Strainer.pdf | foot-valve.pdf |
| GMD_User_Manual_10_Pressure_Relief_Valves_Safety_Valves.pdf | safety-relief.pdf |
| GMD_User_Manual_11_Tamper_Proof_Air_Valves.pdf | tamper-proof.pdf |
| GMD_User_Manual_12_Zero_Velocity_Non_Slam_Valves.pdf | zero-velocity-valve.pdf |
| GMD_User_Manual_13_Control_Valves.pdf | control-valve.pdf |
| GMD_User_Manual_14_Flow_Control_Valves_Plunger_Type.pdf | flow-control-plunger.pdf |
| GMD_User_Manual_15_Wide_Type_Strainers.pdf | wide-type-strainer.pdf |
| GMD_User_Manual_16_Plug_Valves.pdf | plug-valve.pdf |
| GMD_User_Manual_17_Needle_Valves.pdf | needle-valve.pdf |
| GMD_User_Manual_18_Pressure_Release_Valves.pdf | pressure-release-valve.pdf |

Note: `data/manuals.ts` also contains a `y-strainer` manual. It has no matching
entry in `data/valves.ts`, so it is not linked from `/manuals` and has no PDF in
the Drive set.

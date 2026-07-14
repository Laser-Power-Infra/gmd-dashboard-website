import os

public_dir = r"c:\Users\Alok Das\Desktop\gmdalui\public"

images = [
    "/uploads/2025/06/logistics-transportation-container-cargo-ship-cargo-plane-with-working-crane-bridge-shipyard-sunrise-logistic-import-export-transport-industry-background-ai-generative-scaled.jpg",
    "/uploads/2025/06/54a382b8-fa1e-4110-b69d-c67f142bbf5c.jpg",
    "/uploads/2025/06/male-asian-engineer-professional-having-discussion-standing-by-machine-factory-two-asian-coworker-brainstorm-explaining-solves-process-curcuit-mother-board-machine-scaled.jpg",
    "/uploads/2025/06/construction-site-inspector-making-report-scaled.jpg",
    "/uploads/2025/06/view-male-engineer-work-engineers-day-celebration-scaled.jpg",
    "/uploads/2025/06/futuristic-industry-engineering-concept-scaled.jpg",
    "/uploads/2025/06/portrait-male-engineer-working-field-engineers-day-celebration-scaled.jpg",
    "/uploads/2025/06/engineer-working-factory-maintenance-evening-shift-with-focused-expression-scaled.jpg",
    "/uploads/2025/05/asian-engineer-wearing-safety-helmet-with-checking-train-maintenance_33794-229.avif",
    "/uploads/2025/05/GettyImages-886057348.webp",
    "/uploads/2025/06/industrial-pipes-and-valves-controlling-flow-in-a-processing-plant-photo.jpg",
    "/uploads/2025/06/colleagues-with-safety-equipment-working-with-blueprints.jpg"
]

print("Checking manual image assets in public directory:")
for img in images:
    full_path = os.path.join(public_dir, img.lstrip("/"))
    exists = os.path.exists(full_path)
    print(f"File: {os.path.basename(img)} -> {'Exists' if exists else 'MISSING'} ({img})")

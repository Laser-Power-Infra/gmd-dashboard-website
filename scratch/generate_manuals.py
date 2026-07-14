import json
import re
import copy

with open('scratch/manuals_longest.json', 'r', encoding='utf-8') as f:
    extracted = json.load(f)

slug_to_id = {
  'manual-of-butterfly-valve': 'butterfly-valve',
  'manual-of-dual-plate': 'dual-check', 
  'manual-of-sluice-valve': 'sluice-valve',
  'manual-of-non-return': 'non-return',
  'manual-of-globe-valve': 'globe-valve',
  'manual-of-check-valve': 'check-valve',
  'manual-of-check-valve-2': 'air-valve',
  'manual-of-check-valve-3': 'manual-valve',
  'manual-of-tamper-proof-valve': 'tamper-proof',
  'manual-of-control-valve': 'control-valve'
}

butterfly_html = """
<div style="text-align:left; padding: 20px;">
  <h2>1. Transportation and Storage</h2>
  
  <h3>1.1 Transportation</h3>
  <ul>
    <li>Handle the valve carefully to prevent damage to the body, disc, or actuator.</li>
    <li>Use lifting lugs or slings to lift large valves. Do not lift by actuator or handwheel.</li>
    <li>Keep valve in the closed or slightly open position during transport to protect the sealing surfaces.</li>
  </ul>
  
  <h3>1.2 Storage</h3>
  <ul>
    <li>Store valves indoors in a clean, dry environment.</li>
    <li>Protect from moisture, dust, and chemical exposure.</li>
    <li>Plug or cap all open ends to prevent entry of foreign matter.</li>
    <li>For long-term storage (more than 6 months), operate the valve periodically and apply anti-corrosion oil to metal surfaces</li>
  </ul>

  <h2>2. Installation</h2>
  
  <h3>2.1 Pre-Installation Checks</h3>
  <ul>
    <li>Confirm valve type, pressure rating, and material are suitable for the intended service.</li>
    <li>Check for shipping damage or missing parts.</li>
    <li>Clean pipe ends and remove debris or foreign materials</li>
  </ul>

  <h3>2.2 Installation Guidelines</h3>
  <ul>
    <li>Install the valve with the disc in a slightly open position to avoid damage.</li>
    <li>Butterfly valves can be installed in any orientation (horizontal or vertical) unless otherwise specified.</li>
    <li>Align flanges accurately; avoid pipe strain.</li>
    <li>Do not use the valve body to pull the piping into alignment.</li>
    <li>Ensure proper gasket and flange compatibility.</li>
    <li>Tighten flange bolts in a crisscross pattern evenly to avoid leakage or distortion</li>
  </ul>

  <h2>3. Troubleshooting</h2>
  <ul>
    <li><b>Issue: Valve leaks when closed</b><br>Possible Cause: Worn seat, damaged disc or debris inside<br>Solution: Clean internals; replace seat if needed</li>
    <li><b>Issue: Hard to operate</b><br>Possible Cause: Corrosion, dry stem, actuator malfunction<br>Solution: Lubricate stem; inspect actuator</li>
    <li><b>Issue: Leakage at flange</b><br>Possible Cause: Improper gasket, loose bolts, misalignment<br>Solution: Check gasket, retighten or realign flange</li>
    <li><b>Issue: Vibrations or noise</b><br>Possible Cause: Improper installation, cavitation, turbulence<br>Solution: Ensure proper sizing and flow condition</li>
  </ul>

  <h2>4. Maintenance</h2>
  
  <h3>4.1 Periodic Inspection</h3>
  <ul>
    <li>Visually inspect for corrosion, wear, or leakage.</li>
    <li>Check for actuator performance (if automated).</li>
    <li>Inspect flange bolts and gaskets for tightness and integrity</li>
  </ul>

  <h3>4.2 Routine Maintenance</h3>
  <table border="1" cellpadding="5" cellspacing="0" style="width:100%; max-width: 600px; margin-bottom:20px;">
    <tr><th>Maintenance Task</th><th>Recommended Frequency</th></tr>
    <tr><td>Visual Inspection</td><td>Every 3–6 months</td></tr>
    <tr><td>Seat & Disc Inspection</td><td>Every 6–12 months</td></tr>
    <tr><td>Shaft Seal & O-ring Check</td><td>Every 6–12 months</td></tr>
    <tr><td>Lubrication (if applicable)</td><td>Every 6–12 months</td></tr>
    <tr><td>Actuator/Handle Function Test</td><td>Every 6 months</td></tr>
    <tr><td>Leakage Test</td><td>Annually or as per plant schedule</td></tr>
    <tr><td>Full Disassembly & Overhaul</td><td>Every 3–5 years (or as needed)</td></tr>
  </table>

  <h3>4.3 Replacement of Seals or Seats</h3>
  <ul>
    <li>Isolate the valve from line pressure.</li>
    <li>Remove the valve from the pipeline if necessary.</li>
    <li>Disassemble following manufacturer's guidance.</li>
    <li>Replace worn parts with genuine spare parts.</li>
    <li>Reassemble and pressure-test before reinstallation</li>
  </ul>

  <h2>4. Safety And Precautions</h2>
  <ul>
    <li>Always depressurize the line before working on the valve.</li>
    <li>Use appropriate personal protective equipment (PPE).</li>
    <li>Ensure actuator power supply is disconnected before servicing</li>
  </ul>
</div>
"""

allIds = [
  'butterfly-valve',
  'sluice-valve',
  'check-valve',
  'air-valve',
  'non-return',
  'manual-valve',
  'tamper-proof',
  'control-valve',
  'regulating-valve',
  'automated-valve',
  'pressure-relief',
  'speciality-valve'
]

template = {
    'title': '',
    'transportation': {
      'items': [
        'Handle the valve carefully to prevent damage to the body, disc, or actuator.',
        'Use lifting lugs or slings to lift large valves. Do not lift by actuator or handwheel.',
        'Keep valve in the closed or slightly open position during transport to protect the sealing surfaces.'
      ],
      'storageItems': [
        'Store in a dry, well-ventilated area to prevent rust or corrosion.',
        'Keep the valve covered to protect against dust, dirt, and direct sunlight.',
        'If storing for extended periods, apply a rust-preventative coating to machined surfaces.'
      ]
    },
    'installation': {
      'preInstallation': [
        'Verify valve matches system specifications (pressure, temperature, material).',
        'Clean piping and valve flanges to remove dirt, scale, and welding slag.',
        'Check that the valve operates smoothly by opening and closing it completely.'
      ],
      'guidelines': [
        'Install the valve with the stem in a vertical or horizontal position (vertical is preferred).',
        'Ensure the flow direction matches the arrow on the valve body (if applicable).',
        'Use appropriate gaskets and tighten flange bolts evenly in a crisscross pattern.',
        'Do not use the valve to pull misaligned pipes together.'
      ]
    },
    'troubleshooting': [
      {
        'num': 1,
        'issue': 'Valve leaking when closed',
        'cause': 'Worn or damaged seat or gate.',
        'solution': 'Inspect sealing surfaces; repair or replace parts as needed.',
        'image': '/uploads/2025/06/view-male-engineer-work-engineers-day-celebration-scaled.jpg'
      },
      {
        'num': 2,
        'issue': 'Valve difficult to operate',
        'cause': 'Corrosion or debris on stem/gate.',
        'solution': 'Clean components; lubricate stem; check for actuator faults.',
        'image': '/uploads/2025/06/futuristic-industry-engineering-concept-scaled.jpg'
      },
      {
        'num': 3,
        'issue': 'Leakage at bonnet or flanges',
        'cause': 'Gasket failure or loose bolts.',
        'solution': 'Replace gasket; tighten or replace bolt.',
        'image': '/uploads/2025/06/portrait-male-engineer-working-field-engineers-day-celebration-scaled.jpg'
      },
      {
        'num': 4,
        'issue': 'No flow despite valve being open',
        'cause': 'Gate jammed or disconnected stem.',
        'solution': 'Inspect internals; check stem connection and gate movement.',
        'image': '/uploads/2025/06/engineer-working-factory-maintenance-evening-shift-with-focused-expression-scaled.jpg'
      }
    ],
    'maintenance': {
      'schedule': [
        { 'type': 'Visual Inspection', 'frequency': 'Monthly' },
        { 'type': 'Operational Check', 'frequency': 'Quarterly (every 3 months)' },
        { 'type': 'Full Functional Test', 'frequency': 'Annually (1x per year)' },
        { 'type': 'Lubrication/Servicing', 'frequency': 'Annually' },
        { 'type': 'Leakage Test', 'frequency': 'Annually' }
      ]
    },
    'safety': [
      'Ensure the pipeline is completely depressurized before performing any maintenance.',
      'Always wear appropriate Personal Protective Equipment (PPE) such as gloves, safety goggles, and hard hats.',
      'Follow proper Lockout/Tagout (LOTO) procedures when servicing automated or motorized valves.',
      'Never exceed the rated pressure and temperature limits of the valve.',
      'Use proper lifting equipment and techniques when handling heavy valves to avoid injury or damage.'
    ]
}

def formatTitle(id):
    return 'Manual Of ' + ' '.join(w.capitalize() for w in id.split('-'))

output = {}

for vid in allIds:
    item = copy.deepcopy(template)
    item['title'] = formatTitle(vid)
    output[vid] = item

for slug, data in extracted.items():
    if slug in slug_to_id:
        vid = slug_to_id[slug]
        if vid in output:
            output[vid]['rawHtml'] = data['rawHtml']

output['butterfly-valve']['title'] = 'Manual Of Butterfly Valves'
output['butterfly-valve']['rawHtml'] = butterfly_html

js_content = 'export const manualsData = ' + json.dumps(output, indent=2) + ';\n'
with open('src/components/manualsData.js', 'w', encoding='utf-8') as f:
    f.write(js_content)
print('Successfully generated manualsData.js')

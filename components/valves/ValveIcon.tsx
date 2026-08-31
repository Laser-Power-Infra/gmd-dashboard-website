// Customized Valve Blueprint SVG Icons
export default function ValveIcon({ type }: { type: string }) {
  const strokeColor = 'var(--color-primary)';
  const accentColor = 'var(--color-accent)';

  switch (type) {
    case 'butterfly':
      return (
        <svg viewBox="0 0 100 100" className="valve-svg-icon">
          {/* Valve Body Outer Ring */}
          <circle cx="50" cy="50" r="42" fill="none" stroke={strokeColor} strokeWidth="3" />
          <circle cx="50" cy="50" r="34" fill="none" stroke={strokeColor} strokeWidth="1" strokeDasharray="3 3" />
          {/* Flange Bolt Holes */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const x = 50 + 38 * Math.cos(rad);
            const y = 50 + 38 * Math.sin(rad);
            return <circle key={angle} cx={x} cy={y} r="2.5" fill={strokeColor} />;
          })}
          {/* Valve Disc & Shaft */}
          <line x1="50" y1="8" x2="50" y2="92" stroke={accentColor} strokeWidth="4" />
          {/* Angled Disc Flap */}
          <ellipse cx="50" cy="50" rx="14" ry="34" fill="none" stroke={strokeColor} strokeWidth="2.5" transform="rotate(20 50 50)" />
          {/* Center Hub */}
          <circle cx="50" cy="50" r="6" fill={accentColor} />
        </svg>
      );
    case 'gate':
      return (
        <svg viewBox="0 0 100 100" className="valve-svg-icon">
          {/* Pipe Flanges */}
          <rect x="8" y="35" width="8" height="30" rx="1" fill="none" stroke={strokeColor} strokeWidth="3" />
          <rect x="84" y="35" width="8" height="30" rx="1" fill="none" stroke={strokeColor} strokeWidth="3" />
          {/* Main Body block */}
          <path d="M 16 50 L 32 30 L 68 30 L 84 50 L 68 70 L 32 70 Z" fill="none" stroke={strokeColor} strokeWidth="3" />
          {/* Bonnet Stem Tower */}
          <rect x="44" y="15" width="12" height="20" fill="none" stroke={strokeColor} strokeWidth="2" />
          {/* Stem Threaded Bar */}
          <line x1="50" y1="10" x2="50" y2="48" stroke={accentColor} strokeWidth="3.5" />
          {/* Gate Wedge inside */}
          <polygon points="40,48 60,48 50,65" fill="none" stroke={accentColor} strokeWidth="2.5" />
          {/* Handwheel */}
          <ellipse cx="50" cy="10" rx="16" ry="4" fill="none" stroke={strokeColor} strokeWidth="3" />
        </svg>
      );
    case 'check-dual':
      return (
        <svg viewBox="0 0 100 100" className="valve-svg-icon">
          {/* Outer Wafer Body */}
          <circle cx="50" cy="50" r="40" fill="none" stroke={strokeColor} strokeWidth="3" />
          <circle cx="50" cy="50" r="32" fill="none" stroke={strokeColor} strokeWidth="1" />
          {/* Hinge Pin */}
          <line x1="50" y1="14" x2="50" y2="86" stroke={strokeColor} strokeWidth="3" />
          {/* Dual D-Plates */}
          <path d="M 46 20 A 30 30 0 0 0 46 80 Z" fill="none" stroke={accentColor} strokeWidth="2.5" />
          <path d="M 54 20 A 30 30 0 0 1 54 80 Z" fill="none" stroke={accentColor} strokeWidth="2.5" />
          {/* Torsion Springs */}
          <circle cx="50" cy="38" r="4.5" fill="none" stroke={strokeColor} strokeWidth="2.5" />
          <circle cx="50" cy="62" r="4.5" fill="none" stroke={strokeColor} strokeWidth="2.5" />
        </svg>
      );
    case 'check-reflux':
      return (
        <svg viewBox="0 0 100 100" className="valve-svg-icon">
          {/* Main Body chamber */}
          <path d="M 12 60 L 25 35 L 75 35 L 88 60 L 70 76 L 30 76 Z" fill="none" stroke={strokeColor} strokeWidth="3" />
          {/* Pipe Flanges */}
          <line x1="12" y1="45" x2="12" y2="70" stroke={strokeColor} strokeWidth="4" />
          <line x1="88" y1="45" x2="88" y2="70" stroke={strokeColor} strokeWidth="4" />
          {/* Pivot Hinge */}
          <circle cx="36" cy="42" r="4" fill={strokeColor} />
          {/* Hanger Arm & Disc */}
          <line x1="36" y1="42" x2="55" y2="58" stroke={strokeColor} strokeWidth="3.5" />
          <rect x="50" y="52" width="6" height="18" rx="1" fill={accentColor} stroke={accentColor} strokeWidth="1" transform="rotate(-30 53 61)" />
          {/* Seat ring */}
          <line x1="62" y1="40" x2="62" y2="70" stroke={strokeColor} strokeWidth="2.5" strokeDasharray="3 3" />
        </svg>
      );
    case 'air':
      return (
        <svg viewBox="0 0 100 100" className="valve-svg-icon">
          {/* Outer Dome / Air Chamber */}
          <path d="M 24 75 L 24 40 A 26 26 0 0 1 76 40 L 76 75 Z" fill="none" stroke={strokeColor} strokeWidth="3" />
          <line x1="16" y1="75" x2="84" y2="75" stroke={strokeColor} strokeWidth="3" />
          {/* Inlet Base */}
          <rect x="38" y="75" width="24" height="16" fill="none" stroke={strokeColor} strokeWidth="2" />
          <line x1="32" y1="91" x2="68" y2="91" stroke={strokeColor} strokeWidth="3" />
          {/* Float Ball Inside */}
          <circle cx="50" cy="52" r="16" fill="none" stroke={accentColor} strokeWidth="2.5" />
          <circle cx="50" cy="52" r="8" fill="none" stroke={accentColor} strokeWidth="1" strokeDasharray="2 2" />
          {/* Air Release Orifice top */}
          <rect x="46" y="10" width="8" height="8" fill="none" stroke={strokeColor} strokeWidth="2.5" />
        </svg>
      );
    case 'globe':
      return (
        <svg viewBox="0 0 100 100" className="valve-svg-icon">
          {/* S-shaped flow chamber walls */}
          <path d="M 12 50 C 35 50, 32 32, 50 32 C 68 32, 65 68, 88 68" fill="none" stroke={strokeColor} strokeWidth="3" />
          <rect x="10" y="38" width="6" height="24" fill="none" stroke={strokeColor} strokeWidth="3.5" />
          <rect x="84" y="56" width="6" height="24" fill="none" stroke={strokeColor} strokeWidth="3.5" />
          {/* Center Bridge & Seat */}
          <line x1="40" y1="50" x2="60" y2="50" stroke={strokeColor} strokeWidth="3" />
          {/* Valve Plug */}
          <rect x="45" y="38" width="10" height="11" rx="1" fill={accentColor} stroke={accentColor} />
          {/* Operating Stem */}
          <line x1="50" y1="18" x2="50" y2="38" stroke={strokeColor} strokeWidth="2.5" />
          {/* Handwheel */}
          <ellipse cx="50" cy="18" rx="16" ry="4" fill="none" stroke={strokeColor} strokeWidth="3" />
        </svg>
      );
    case 'ball':
      return (
        <svg viewBox="0 0 100 100" className="valve-svg-icon">
          {/* Horizontal Pipe Connection */}
          <line x1="5" y1="50" x2="95" y2="50" stroke={strokeColor} strokeWidth="1.5" strokeDasharray="4 4" />
          {/* Outer Housing */}
          <rect x="15" y="32" width="10" height="36" fill="none" stroke={strokeColor} strokeWidth="3" />
          <rect x="75" y="32" width="10" height="36" fill="none" stroke={strokeColor} strokeWidth="3" />
          <path d="M 25 38 L 40 28 L 60 28 L 75 38 L 75 62 L 60 72 L 40 72 L 25 62 Z" fill="none" stroke={strokeColor} strokeWidth="2.5" />
          {/* Rotary Ball Globe */}
          <circle cx="50" cy="50" r="22" fill="none" stroke={strokeColor} strokeWidth="3" />
          {/* Central Bore Hole */}
          <rect x="36" y="44" width="28" height="12" rx="2" fill="none" stroke={accentColor} strokeWidth="3.5" />
          {/* Stem & Lever */}
          <line x1="50" y1="16" x2="50" y2="28" stroke={strokeColor} strokeWidth="3" />
          <path d="M 50 16 L 85 10" stroke={accentColor} strokeWidth="4.5" strokeLinecap="round" />
        </svg>
      );
    case 'prv':
      return (
        <svg viewBox="0 0 100 100" className="valve-svg-icon">
          {/* Flow path */}
          <path d="M 12 65 L 42 65 L 50 54 L 58 65 L 88 65" fill="none" stroke={strokeColor} strokeWidth="3" />
          <line x1="12" y1="55" x2="12" y2="75" stroke={strokeColor} strokeWidth="4" />
          <line x1="88" y1="55" x2="88" y2="75" stroke={strokeColor} strokeWidth="4" />
          {/* Upper Diaphragm Actuator Chamber */}
          <ellipse cx="50" cy="35" rx="24" ry="7" fill="none" stroke={strokeColor} strokeWidth="3" />
          <line x1="26" y1="35" x2="74" y2="35" stroke={strokeColor} strokeWidth="1.5" />
          {/* Actuator spring casing */}
          <rect x="42" y="12" width="16" height="16" fill="none" stroke={strokeColor} strokeWidth="2" />
          {/* Adjustment Bolt */}
          <line x1="50" y1="6" x2="50" y2="12" stroke={accentColor} strokeWidth="3" />
          {/* Control Pilot Tube (Feedback Line) */}
          <path d="M 72 65 L 72 48 L 58 42" fill="none" stroke={accentColor} strokeWidth="2.5" strokeDasharray="2 2" />
          <circle cx="72" cy="65" r="3" fill={accentColor} />
        </svg>
      );
    case 'foot':
      return (
        <svg viewBox="0 0 100 100" className="valve-svg-icon">
          {/* Upper Body Flange */}
          <rect x="22" y="10" width="56" height="10" fill="none" stroke={strokeColor} strokeWidth="3.5" />
          {/* Valve Chamber */}
          <path d="M 28 20 L 22 55 L 78 55 L 72 20 Z" fill="none" stroke={strokeColor} strokeWidth="3" />
          {/* Internal Plunger Disc */}
          <line x1="32" y1="38" x2="68" y2="38" stroke={accentColor} strokeWidth="4" />
          <line x1="50" y1="20" x2="50" y2="45" stroke={strokeColor} strokeWidth="2.5" />
          {/* Strainer Grid Basket Bottom */}
          <path d="M 24 55 L 34 88 L 66 88 L 76 55" fill="none" stroke={strokeColor} strokeWidth="2.5" />
          {/* Mesh Grid Lines */}
          <line x1="36" y1="55" x2="42" y2="88" stroke={strokeColor} strokeWidth="1.5" />
          <line x1="50" y1="55" x2="50" y2="88" stroke={strokeColor} strokeWidth="1.5" />
          <line x1="64" y1="55" x2="58" y2="88" stroke={strokeColor} strokeWidth="1.5" />
          <line x1="26" y1="66" x2="74" y2="66" stroke={strokeColor} strokeWidth="1.5" strokeDasharray="2 2" />
          <line x1="29" y1="77" x2="71" y2="77" stroke={strokeColor} strokeWidth="1.5" strokeDasharray="2 2" />
        </svg>
      );
    case 'safety':
      return (
        <svg viewBox="0 0 100 100" className="valve-svg-icon">
          {/* Angle Body layout (Inlet bottom, outlet right) */}
          <path d="M 38 90 L 38 65 L 56 65 A 12 12 0 0 0 68 53 L 88 53" fill="none" stroke={strokeColor} strokeWidth="3" />
          <line x1="26" y1="90" x2="50" y2="90" stroke={strokeColor} strokeWidth="4" />
          <line x1="88" y1="41" x2="88" y2="65" stroke={strokeColor} strokeWidth="4" />
          {/* Internal Seating disc */}
          <line x1="32" y1="65" x2="48" y2="65" stroke={strokeColor} strokeWidth="3.5" />
          {/* Spindle Shaft */}
          <line x1="40" y1="32" x2="40" y2="65" stroke={accentColor} strokeWidth="3.5" />
          {/* Spring Chamber */}
          <rect x="28" y="16" width="24" height="32" fill="none" stroke={strokeColor} strokeWidth="2.5" />
          {/* Compressed Spring Graphic */}
          <path d="M 32 20 L 48 24 L 32 28 L 48 32 L 32 36 L 48 40 L 32 44" fill="none" stroke={strokeColor} strokeWidth="1.5" />
          {/* Cap on top */}
          <path d="M 34 16 L 40 8 L 46 16 Z" fill={strokeColor} />
        </svg>
      );
    case 'lock':
      return (
        <svg viewBox="0 0 100 100" className="valve-svg-icon">
          {/* Base Gate Valve silhouette */}
          <path d="M 20 65 L 35 48 L 65 48 L 80 65" fill="none" stroke={strokeColor} strokeWidth="2.5" />
          <line x1="50" y1="36" x2="50" y2="48" stroke={strokeColor} strokeWidth="2" />
          {/* Handwheel */}
          <ellipse cx="50" cy="36" rx="14" ry="4" fill="none" stroke={strokeColor} strokeWidth="2.5" />
          {/* Padlock Overlay */}
          <rect x="36" y="55" width="28" height="22" rx="4" fill="none" stroke={accentColor} strokeWidth="3.5" />
          {/* Padlock Shackle */}
          <path d="M 42 55 L 42 45 A 8 8 0 0 1 58 45 L 58 55" fill="none" stroke={accentColor} strokeWidth="2.5" />
          {/* Keyhole */}
          <circle cx="50" cy="64" r="2.5" fill={accentColor} />
          <polygon points="49,65 51,65 52,71 48,71" fill={accentColor} />
        </svg>
      );
    case 'strainer':
      return (
        <svg viewBox="0 0 100 100" className="valve-svg-icon">
          {/* Horizontal Pipe run */}
          <path d="M 12 40 L 88 40" stroke={strokeColor} strokeWidth="3" />
          <path d="M 12 60 L 34 60 L 66 60 L 88 60" stroke={strokeColor} strokeWidth="3" />
          <line x1="12" y1="34" x2="12" y2="66" stroke={strokeColor} strokeWidth="4" />
          <line x1="88" y1="34" x2="88" y2="66" stroke={strokeColor} strokeWidth="4" />
          {/* Slanted Strainer Chamber */}
          <path d="M 34 60 L 52 88 L 74 74 L 58 52" fill="none" stroke={strokeColor} strokeWidth="3" />
          {/* Strainer internal mesh grid (dotted) */}
          <line x1="38" y1="48" x2="60" y2="80" stroke={accentColor} strokeWidth="3.5" strokeDasharray="3 3" />
          {/* Drain plug at bottom */}
          <rect x="58" y="81" width="10" height="6" fill="none" stroke={strokeColor} strokeWidth="2" transform="rotate(-30 63 84)" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 100 100" className="valve-svg-icon">
          <circle cx="50" cy="50" r="40" fill="none" stroke={strokeColor} strokeWidth="3" />
          <line x1="20" y1="50" x2="80" y2="50" stroke={accentColor} strokeWidth="4" />
        </svg>
      );
  }
}

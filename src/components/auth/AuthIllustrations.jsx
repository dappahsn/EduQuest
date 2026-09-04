import React from 'react';

// 1. Ilustrasi Halaman Login (Traveler di halte bus dengan koper kuning & pegunungan)
export function LoginTravelerIllustration() {
  return (
    <div style={{ width: '100%', height: '220px', position: 'relative', overflow: 'hidden' }}>
      <svg
        viewBox="0 0 400 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', display: 'block' }}
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Sky Background */}
        <rect width="400" height="220" fill="#BAE6FD" />
        <path d="M0 0H400V180C340 195 260 170 180 185C100 200 40 180 0 190V0Z" fill="#93C5FD" opacity="0.35" />

        {/* Distant Mountains */}
        <path d="M-20 180L60 70L140 180H-20Z" fill="#64748B" opacity="0.45" />
        <path d="M50 180L160 50L270 180H50Z" fill="#475569" opacity="0.55" />
        <path d="M220 180L300 80L380 180H220Z" fill="#64748B" opacity="0.4" />
        <path d="M290 180L370 60L450 180H290Z" fill="#334155" opacity="0.5" />

        {/* Soft Hills & Trees */}
        <ellipse cx="60" cy="180" rx="90" ry="35" fill="#CBD5E1" />
        <ellipse cx="340" cy="175" rx="100" ry="40" fill="#94A3B8" opacity="0.6" />
        <ellipse cx="370" cy="120" rx="18" ry="40" fill="#64748B" opacity="0.5" />
        <ellipse cx="340" cy="135" rx="14" ry="30" fill="#475569" opacity="0.5" />
        <ellipse cx="30" cy="135" rx="16" ry="35" fill="#64748B" opacity="0.4" />

        {/* Ground / Platform */}
        <rect y="175" width="400" height="45" fill="#94A3B8" />
        <rect y="170" width="400" height="6" fill="#E2E8F0" opacity="0.8" />

        {/* Bus Stop Pole & Sign */}
        <rect x="295" y="60" width="4" height="115" fill="#475569" />
        <rect x="270" y="38" width="54" height="54" rx="8" fill="#F59E0B" />
        <rect x="274" y="42" width="46" height="46" rx="6" fill="#FDE68A" />
        {/* Bus Icon on sign */}
        <rect x="284" y="52" width="26" height="22" rx="4" fill="#0284C7" />
        <rect x="287" y="56" width="20" height="8" rx="2" fill="#FFFFFF" />
        <circle cx="289" cy="70" r="2.5" fill="#FFFFFF" />
        <circle cx="305" cy="70" r="2.5" fill="#FFFFFF" />

        {/* Yellow Suitcase */}
        <rect x="150" y="145" width="34" height="40" rx="6" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
        <rect x="156" y="152" width="22" height="2" fill="#EAB308" />
        <rect x="156" y="160" width="22" height="2" fill="#EAB308" />
        <rect x="156" y="168" width="22" height="2" fill="#EAB308" />
        {/* Wheels */}
        <circle cx="156" cy="186" r="3" fill="#1E293B" />
        <circle cx="178" cy="186" r="3" fill="#1E293B" />
        {/* Suitcase Handle */}
        <rect x="162" y="132" width="10" height="14" rx="2" fill="none" stroke="#475569" strokeWidth="2.5" />

        {/* Traveler Character */}
        {/* Legs */}
        <rect x="195" y="145" width="7" height="35" rx="3" fill="#FDE047" opacity="0.2" />
        <rect x="193" y="145" width="6" height="36" rx="2" fill="#BAE6FD" />
        <rect x="207" y="145" width="6" height="36" rx="2" fill="#BAE6FD" />
        <ellipse cx="195" cy="182" rx="6" ry="3" fill="#0284C7" />
        <ellipse cx="209" cy="182" rx="6" ry="3" fill="#0284C7" />

        {/* Skirt/Shorts */}
        <path d="M188 135H218L215 152H191L188 135Z" fill="#0284C7" />

        {/* Torso / Clothes */}
        <rect x="189" y="98" width="24" height="38" rx="4" fill="#0369A1" />

        {/* Yellow Backpack */}
        <rect x="178" y="95" width="14" height="30" rx="5" fill="#FACC15" stroke="#EAB308" strokeWidth="1.5" />
        <rect x="180" y="112" width="10" height="9" rx="2" fill="#EAB308" />

        {/* Left Arm holding suitcase */}
        <path d="M190 102L172 135" stroke="#FDE047" strokeWidth="4.5" strokeLinecap="round" />

        {/* Right Arm waving / hailing bus */}
        <path d="M213 105L248 108" stroke="#FDE047" strokeWidth="4.5" strokeLinecap="round" />

        {/* Head & Hair */}
        <circle cx="204" cy="78" r="9" fill="#FDE047" />
        <path d="M194 76C194 67 202 65 212 67C218 69 220 78 217 86C215 88 206 90 200 88C195 86 194 82 194 76Z" fill="#0F172A" />
        <path d="M195 72C198 68 205 67 212 70" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" />

        {/* Soft Fluffy Clouds in Sky */}
        <ellipse cx="90" cy="40" rx="35" ry="14" fill="#FFFFFF" opacity="0.8" />
        <ellipse cx="110" cy="35" rx="25" ry="16" fill="#FFFFFF" opacity="0.9" />
        <ellipse cx="75" cy="42" rx="20" ry="12" fill="#FFFFFF" opacity="0.75" />

        <ellipse cx="310" cy="25" rx="30" ry="12" fill="#FFFFFF" opacity="0.7" />
        <ellipse cx="330" cy="22" rx="22" ry="14" fill="#FFFFFF" opacity="0.85" />
      </svg>
    </div>
  );
}

// 2. Ilustrasi Halaman Sign Up (Awan lembut di langit biru dengan nuansa petualangan)
export function SignUpCloudsIllustration() {
  return (
    <div style={{ width: '100%', height: '140px', position: 'relative', overflow: 'hidden' }}>
      <svg
        viewBox="0 0 400 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', display: 'block' }}
        preserveAspectRatio="xMidYMid slice"
      >
        <rect width="400" height="140" fill="#BAE6FD" />
        <path d="M0 0H400V110C320 125 240 95 160 115C80 130 30 110 0 120V0Z" fill="#93C5FD" opacity="0.3" />

        {/* Fluffy Layered Clouds */}
        <ellipse cx="80" cy="90" rx="55" ry="24" fill="#FFFFFF" opacity="0.85" />
        <ellipse cx="115" cy="80" rx="40" ry="26" fill="#FFFFFF" opacity="0.95" />
        <ellipse cx="50" cy="95" rx="35" ry="20" fill="#FFFFFF" opacity="0.8" />

        <ellipse cx="280" cy="75" rx="65" ry="28" fill="#FFFFFF" opacity="0.85" />
        <ellipse cx="320" cy="65" rx="48" ry="30" fill="#FFFFFF" opacity="0.95" />
        <ellipse cx="240" cy="82" rx="40" ry="22" fill="#FFFFFF" opacity="0.8" />

        <ellipse cx="190" cy="60" rx="35" ry="16" fill="#FFFFFF" opacity="0.65" />
        <ellipse cx="210" cy="55" rx="25" ry="18" fill="#FFFFFF" opacity="0.75" />

        {/* Tiny Birds in distance */}
        <path d="M150 35C153 32 156 34 159 36C162 34 165 32 168 35" stroke="#0284C7" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.6" />
        <path d="M165 42C167 40 169 41 171 43C173 41 175 40 177 42" stroke="#0284C7" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.5" />
      </svg>
    </div>
  );
}

// 3. Ilustrasi Halaman Forgot Password (Traveler dengan topi, koper kuning, dan pesawat terbang dengan jejak lengkung)
export function ForgotTravelerIllustration() {
  return (
    <div style={{ width: '100%', height: '220px', position: 'relative', overflow: 'hidden' }}>
      <svg
        viewBox="0 0 400 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', display: 'block' }}
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Sky Background */}
        <rect width="400" height="220" fill="#BAE6FD" />
        <path d="M0 0H400V170C310 185 220 155 140 175C60 190 20 170 0 180V0Z" fill="#93C5FD" opacity="0.3" />

        {/* Contrail Dotted Trail for Airplane */}
        <path
          d="M200 185C220 140 260 100 325 55"
          stroke="#0284C7"
          strokeWidth="1.8"
          strokeDasharray="4 4"
          fill="none"
          opacity="0.6"
        />

        {/* Airplane Flying High */}
        <g transform="translate(325, 45) rotate(-35) scale(0.9)">
          <path d="M0 12L28 0L24 12L38 15L24 18L28 30L0 18L-12 24L-8 15L-12 6L0 12Z" fill="#0284C7" />
          <path d="M2 12L20 4L18 12H2Z" fill="#38BDF8" />
        </g>

        {/* Soft Fluffy Clouds */}
        <ellipse cx="60" cy="55" rx="35" ry="14" fill="#FFFFFF" opacity="0.75" />
        <ellipse cx="80" cy="50" rx="25" ry="16" fill="#FFFFFF" opacity="0.9" />
        <ellipse cx="340" cy="80" rx="40" ry="16" fill="#FFFFFF" opacity="0.8" />

        {/* Gentle Ground */}
        <ellipse cx="200" cy="225" rx="220" ry="45" fill="#E2E8F0" opacity="0.7" />

        {/* Traveler Character */}
        {/* Suitcase */}
        <rect x="225" y="125" width="34" height="48" rx="6" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
        <rect x="231" y="135" width="22" height="2" fill="#EAB308" />
        <rect x="231" y="145" width="22" height="2" fill="#EAB308" />
        <rect x="231" y="155" width="22" height="2" fill="#EAB308" />
        <circle cx="232" cy="174" r="3" fill="#1E293B" />
        <circle cx="252" cy="174" r="3" fill="#1E293B" />
        {/* Suitcase Handle */}
        <rect x="237" y="105" width="10" height="22" rx="2" fill="none" stroke="#475569" strokeWidth="2.5" />

        {/* Traveler Legs */}
        <rect x="175" y="130" width="8" height="42" rx="3" fill="#0284C7" />
        <rect x="190" y="130" width="8" height="42" rx="3" fill="#0369A1" />
        <ellipse cx="178" cy="173" rx="7" ry="3.5" fill="#0F172A" />
        <ellipse cx="193" cy="173" rx="7" ry="3.5" fill="#0F172A" />

        {/* Torso & Long Sleeves */}
        <rect x="172" y="85" width="28" height="48" rx="5" fill="#0369A1" />

        {/* Yellow Backpack */}
        <rect x="162" y="86" width="14" height="34" rx="5" fill="#FACC15" stroke="#EAB308" strokeWidth="1.5" />

        {/* Right Arm holding luggage handle */}
        <path d="M198 92L238 112" stroke="#FDE047" strokeWidth="4.5" strokeLinecap="round" />

        {/* Head, Sun Hat & Hair */}
        <circle cx="186" cy="68" r="9" fill="#FDE047" />
        <path d="M178 68C178 59 184 57 194 59C199 61 201 69 198 77C196 79 188 80 183 78C179 76 178 72 178 68Z" fill="#0F172A" />
        {/* Sun Hat */}
        <ellipse cx="186" cy="62" rx="18" ry="4.5" fill="#FACC15" stroke="#CA8A04" strokeWidth="1" />
        <path d="M176 61C176 53 181 50 186 50C191 50 196 53 196 61H176Z" fill="#FDE047" />
        <rect x="176" y="58" width="20" height="3" fill="#0284C7" />
      </svg>
    </div>
  );
}

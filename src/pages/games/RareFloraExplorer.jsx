import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { useAudio } from '../../context/AudioContext';
import styles from './RareFloraExplorer.module.css';

// ---------------------------------------------------------------------------
// 1. KANTONG SEMAR (NEPENTHES) BOTANICAL ILLUSTRATION
// Rich SVG with multi-stop gradients, peristome ridges, translucent digestive pool,
// realistic mottled spots, and interactive crawling/sliding ant animation.
// ---------------------------------------------------------------------------
function AnimatedPitcherPlant({
  step,
  isAntMoving,
  isDigesting,
  nitrogenLevel,
  nectarSpots = [false, false, false]
}) {
  return (
    <svg viewBox="0 0 240 210" width="100%" height="100%" style={{ overflow: 'visible' }}>
      <defs>
        {/* Leaf blade gradient */}
        <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="35%" stopColor="#22c55e" />
          <stop offset="80%" stopColor="#15803d" />
          <stop offset="100%" stopColor="#14532d" />
        </linearGradient>

        {/* Tendril rope gradient */}
        <linearGradient id="tendrilGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="50%" stopColor="#16a34a" />
          <stop offset="100%" stopColor="#854d0e" />
        </linearGradient>

        {/* Pitcher outer body gradient (Green to Carmine Red) */}
        <radialGradient id="pitcherBodyGrad" cx="38%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#fca5a5" />
          <stop offset="25%" stopColor="#ef4444" />
          <stop offset="60%" stopColor="#b91c1c" />
          <stop offset="88%" stopColor="#7f1d1d" />
          <stop offset="100%" stopColor="#450a0a" />
        </radialGradient>

        {/* Pitcher rim/peristome radial gradient */}
        <linearGradient id="peristomeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fecaca" />
          <stop offset="30%" stopColor="#f87171" />
          <stop offset="70%" stopColor="#991b1b" />
          <stop offset="100%" stopColor="#450a0a" />
        </linearGradient>

        {/* Operculum (Lid) Gradient */}
        <linearGradient id="lidGrad" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#fca5a5" />
          <stop offset="40%" stopColor="#dc2626" />
          <stop offset="85%" stopColor="#991b1b" />
          <stop offset="100%" stopColor="#450a0a" />
        </linearGradient>

        {/* Digestive fluid pool (Acidic enzyme amber glow) */}
        <linearGradient id="fluidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fde047" stopOpacity="0.85" />
          <stop offset="45%" stopColor="#ca8a04" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#713f12" stopOpacity="0.95" />
        </linearGradient>

        {/* Glassy liquid shine overlay */}
        <linearGradient id="fluidShine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.4" />
        </linearGradient>

        {/* Nectar droplet glow */}
        <radialGradient id="nectarGlow" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#fef08a" />
          <stop offset="80%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#a16207" />
        </radialGradient>

        {/* Ant Chitin Gradient */}
        <linearGradient id="antChitin" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#52525b" />
          <stop offset="50%" stopColor="#27272a" />
          <stop offset="100%" stopColor="#09090b" />
        </linearGradient>
      </defs>

      {/* 1. TOP SUPPORTING VINE & LEAF */}
      <path
        d="M 10,25 Q 60,18 110,38 Q 130,46 145,70"
        fill="none"
        stroke="url(#leafGrad)"
        strokeWidth="10"
        strokeLinecap="round"
      />
      {/* Leaf Central Midrib */}
      <path
        d="M 10,25 Q 60,18 110,38"
        fill="none"
        stroke="#14532d"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Coiled Tendril descending to pitcher base */}
      <path
        d="M 145,70 C 158,95 152,145 135,175 C 122,198 108,198 102,185"
        fill="none"
        stroke="url(#tendrilGrad)"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* 2. PITCHER BACK WALL SHADOW */}
      <path
        d="M 80,72 C 60,100 62,145 78,175 C 92,198 115,198 126,175 C 142,142 140,100 120,72 Z"
        fill="#2b0303"
      />

      {/* 3. ACIDIC DIGESTIVE FLUID POOL (Cutaway Bottom) */}
      <path
        d="M 72,138 C 70,162 76,182 90,192 C 104,200 116,192 128,180 C 136,164 136,145 132,138 Z"
        fill="url(#fluidGrad)"
      />
      <ellipse cx="103" cy="138" rx="29" ry="7" fill="url(#fluidShine)" />

      {/* Fluid Digestive Bubbles */}
      {isDigesting && (
        <g>
          <circle cx="95" cy="155" r="3" fill="#ffffff" opacity="0.85" className={styles.bubbleAnim1} />
          <circle cx="112" cy="165" r="4.5" fill="#fef08a" opacity="0.9" className={styles.bubbleAnim2} />
          <circle cx="102" cy="175" r="2.5" fill="#ffffff" opacity="0.8" className={styles.bubbleAnim1} />
          <circle cx="120" cy="150" r="3.5" fill="#fde047" opacity="0.85" className={styles.bubbleAnim2} />
        </g>
      )}

      {/* 4. PITCHER MAIN FRONT BODY */}
      <path
        d="M 76,72 C 55,102 58,150 75,180 C 90,202 116,202 130,178 C 146,145 145,102 124,72 Z"
        fill="url(#pitcherBodyGrad)"
        stroke="#450a0a"
        strokeWidth="2"
      />

      {/* Pitcher Mottled Speckles (Maculae) */}
      <circle cx="82" cy="110" r="4" fill="#450a0a" opacity="0.75" />
      <circle cx="92" cy="95" r="3.2" fill="#450a0a" opacity="0.65" />
      <circle cx="116" cy="105" r="5" fill="#450a0a" opacity="0.7" />
      <circle cx="124" cy="130" r="4.2" fill="#450a0a" opacity="0.6" />
      <circle cx="88" cy="145" r="4.8" fill="#450a0a" opacity="0.8" />
      <circle cx="110" cy="150" r="3.6" fill="#450a0a" opacity="0.75" />
      <circle cx="98" cy="125" r="5.5" fill="#450a0a" opacity="0.8" />

      {/* 3D Longitudinal Wings (Vertical ridges on front) */}
      <path
        d="M 88,85 Q 82,130 92,175"
        fill="none"
        stroke="#fca5a5"
        strokeWidth="2"
        strokeDasharray="2 3"
        opacity="0.85"
      />
      <path
        d="M 112,85 Q 118,130 112,175"
        fill="none"
        stroke="#fca5a5"
        strokeWidth="2"
        strokeDasharray="2 3"
        opacity="0.85"
      />

      {/* 5. PERISTOME (FLUTED SLICK COLLAR RIM) */}
      <ellipse
        cx="100"
        cy="72"
        rx="26"
        ry="10"
        fill="url(#peristomeGrad)"
        stroke="#270202"
        strokeWidth="2.5"
      />
      <ellipse cx="100" cy="72" rx="20" ry="6.5" fill="#1f0202" />

      {/* Peristome Fine Fluted Rib Lines */}
      {[-20, -15, -10, -5, 0, 5, 10, 15, 20].map((dx, idx) => (
        <line
          key={idx}
          x1={100 + dx}
          y1={65 + Math.abs(dx) * 0.15}
          x2={100 + dx * 1.15}
          y2={78 - Math.abs(dx) * 0.12}
          stroke="#fecaca"
          strokeWidth="1.2"
          opacity="0.75"
        />
      ))}

      {/* Glossy Peristome Rim Highlight */}
      <path
        d="M 80,72 C 86,76 114,76 120,72"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.6"
        opacity="0.65"
      />

      {/* 6. OPERCULUM (RAIN LID OVERHANG) */}
      <g transform="translate(100, 55)">
        {/* Lid joint hinge */}
        <circle cx="18" cy="4" r="3.5" fill="#7f1d1d" stroke="#450a0a" strokeWidth="1" />
        {/* Slanted protective lid */}
        <path
          d="M 18,4 C 12,-18 -18,-24 -36,-10 C -42,-4 -32,8 -14,6 C 4,5 12,5 18,4 Z"
          fill="url(#lidGrad)"
          stroke="#450a0a"
          strokeWidth="2"
        />
        {/* Under-lid Nectar Glands */}
        <circle cx="-16" cy="-4" r="2" fill="#fef08a" opacity="0.9" />
        <circle cx="-8" cy="-6" r="1.8" fill="#fde047" opacity="0.85" />
        <circle cx="-24" cy="-3" r="1.6" fill="#fef08a" opacity="0.8" />
      </g>

      {/* 7. DYNAMIC NECTAR DROPS ON PERISTOME */}
      {nectarSpots[0] && (
        <g>
          <circle cx="86" cy="74" r="3.6" fill="url(#nectarGlow)" stroke="#78350f" strokeWidth="0.6" />
          <circle cx="85.2" cy="73" r="1.1" fill="#ffffff" />
        </g>
      )}
      {nectarSpots[1] && (
        <g>
          <circle cx="100" cy="77" r="4.2" fill="url(#nectarGlow)" stroke="#78350f" strokeWidth="0.6" />
          <circle cx="99.2" cy="75.8" r="1.3" fill="#ffffff" />
        </g>
      )}
      {nectarSpots[2] && (
        <g>
          <circle cx="114" cy="74" r="3.6" fill="url(#nectarGlow)" stroke="#78350f" strokeWidth="0.6" />
          <circle cx="113.3" cy="73" r="1.1" fill="#ffffff" />
        </g>
      )}

      {/* 8. FORAGING ANT (Crawls to peristome, slips, and falls inside) */}
      {isAntMoving && (
        <g className={styles.antWalking}>
          {/* Ant Head */}
          <ellipse cx="6" cy="0" rx="3" ry="2.2" fill="url(#antChitin)" />
          {/* Ant Thorax */}
          <ellipse cx="0" cy="0" rx="3.5" ry="2" fill="url(#antChitin)" />
          {/* Ant Abdomen */}
          <ellipse cx="-7" cy="0" rx="4.8" ry="3" fill="url(#antChitin)" />
          {/* Legs */}
          <line x1="1" y1="0" x2="3" y2="-4" stroke="#18181b" strokeWidth="0.8" />
          <line x1="-1" y1="0" x2="-2" y2="-4" stroke="#18181b" strokeWidth="0.8" />
          <line x1="1" y1="0" x2="3" y2="4" stroke="#18181b" strokeWidth="0.8" />
          <line x1="-1" y1="0" x2="-2" y2="4" stroke="#18181b" strokeWidth="0.8" />
          {/* Antenna */}
          <path d="M 8,-1 Q 12,-3 14,-2" stroke="#18181b" strokeWidth="0.7" fill="none" />
        </g>
      )}

      {/* 9. NITROGEN SPARKS (+N) RISING (When Digested) */}
      {nitrogenLevel >= 40 && (
        <g style={{ filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.65))' }}>
          <text x="64" y="132" fill="#4ade80" fontSize="11" fontWeight="900" opacity="0.95">
            +N
          </text>
          <text x="124" y="128" fill="#fde047" fontSize="11" fontWeight="900" opacity="0.95">
            +N
          </text>
          <text x="96" y="112" fill="#38bdf8" fontSize="12" fontWeight="900" opacity="0.95">
            +N
          </text>
        </g>
      )}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// 2. PADMA RAKSASA (RAFFLESIA ARNOLDII) BOTANICAL ILLUSTRATION
// Massive 5-lobed fleshy flower with raised white warts (pustules),
// central cup aperture, spiked ramenta processes, carrion scent waves, and pollinator fly.
// ---------------------------------------------------------------------------
function AnimatedRafflesia({
  step,
  isBlooming,
  isScenting,
  isFlyPollinating,
  unfoldedPetalsCount = 0,
  flyPosition = 0,
  isPumping = false
}) {
  const isFullBloom = isBlooming || unfoldedPetalsCount >= 5 || step >= 1;

  return (
    <svg viewBox="0 0 240 210" width="100%" height="100%" style={{ overflow: 'visible' }}>
      <defs>
        {/* Forest Humus & Tetrastigma Vine Ground */}
        <radialGradient id="groundSoilGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3f2314" />
          <stop offset="60%" stopColor="#221208" />
          <stop offset="100%" stopColor="#120904" />
        </radialGradient>

        {/* Massive Petal (Perigone Lobe) Gradient */}
        <radialGradient id="petalGrad" cx="45%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="30%" stopColor="#ef4444" />
          <stop offset="70%" stopColor="#b91c1c" />
          <stop offset="90%" stopColor="#7f1d1d" />
          <stop offset="100%" stopColor="#450a0a" />
        </radialGradient>

        {/* Central Diaphragm & Cup Depth */}
        <radialGradient id="centralApertureGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1a0202" />
          <stop offset="45%" stopColor="#3a0404" />
          <stop offset="75%" stopColor="#7f1d1d" />
          <stop offset="100%" stopColor="#991b1b" />
        </radialGradient>

        {/* White Warts / Pustules 3D Gradient */}
        <radialGradient id="wartGrad" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#fef3c7" />
          <stop offset="85%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#d97706" />
        </radialGradient>

        {/* Scent Ring Waves */}
        <radialGradient id="scentAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0" />
          <stop offset="50%" stopColor="#9333ea" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#7e22ce" stopOpacity="0" />
        </radialGradient>

        {/* Carrion Fly Metallic Chitin */}
        <linearGradient id="flyBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="45%" stopColor="#06b6d4" />
          <stop offset="85%" stopColor="#0e7490" />
          <stop offset="100%" stopColor="#164e63" />
        </linearGradient>
      </defs>

      {/* 1. FOREST FLOOR SOIL & HOST TETRASTIGMA ROOT */}
      <ellipse cx="120" cy="155" rx="105" ry="38" fill="url(#groundSoilGrad)" opacity="0.85" />
      {/* Tetrastigma woody vine creeping through */}
      <path
        d="M 15,160 Q 60,175 110,165 Q 165,155 225,170"
        fill="none"
        stroke="#78350f"
        strokeWidth="11"
        strokeLinecap="round"
      />
      <path
        d="M 20,162 Q 62,176 112,166 Q 166,156 222,171"
        fill="none"
        stroke="#451a03"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* 2. SCENT WAVES (When Scent is active or during pumping) */}
      {(isScenting || isPumping) && (
        <g>
          <circle cx="120" cy="115" r="68" fill="url(#scentAura)" className={styles.scentPulse} />
          <circle cx="120" cy="115" r="95" fill="url(#scentAura)" className={styles.scentPulse} style={{ animationDelay: '0.7s' }} />
        </g>
      )}

      {/* 3. FLOWER BODY (KNOP CABBAGE OR UNFOLDING PETALS) */}
      {!isFullBloom && unfoldedPetalsCount === 0 ? (
        /* STAGE 0: CLOSED CABBAGE BUD (KNOP) */
        <g transform="translate(120, 125)">
          <ellipse cx="0" cy="10" rx="42" ry="34" fill="#450a0a" />
          {/* Overlapping dark scales */}
          <path d="M -38,5 C -25,-25 25,-25 38,5 C 25,30 -25,30 -38,5 Z" fill="#7f1d1d" stroke="#2a0404" strokeWidth="2" />
          <path d="M -30,-5 C -15,-32 15,-32 30,-5 C 18,22 -18,22 -30,-5 Z" fill="#991b1b" stroke="#2a0404" strokeWidth="2" />
          <path d="M -18,-15 C -8,-36 8,-36 18,-15 C 10,12 -10,12 -18,-15 Z" fill="#b91c1c" stroke="#2a0404" strokeWidth="1.8" />
          <text x="0" y="4" fill="#fef08a" fontSize="10" fontWeight="900" textAnchor="middle">
            Knop Kuncup
          </text>
        </g>
      ) : (
        /* STAGE 1+: UNFOLDING / FULL BLOOMING 5-LOBED GIANT FLOWER */
        <g
          transform="translate(120, 115)"
          className={isPumping ? styles.pumpingFlowerBounce : ''}
          style={{ transformOrigin: '120px 115px' }}
        >
          {/* Petal 1: Top Right */}
          {(isFullBloom || unfoldedPetalsCount >= 1) && (
            <g transform="rotate(22)">
              <path
                d="M -22,-32 C -32,-78 32,-78 22,-32 C 12,-18 -12,-18 -22,-32 Z"
                fill="url(#petalGrad)"
                stroke="#450a0a"
                strokeWidth="2.5"
              />
              <circle cx="-12" cy="-60" r="4.2" fill="url(#wartGrad)" />
              <circle cx="10" cy="-62" r="3.5" fill="url(#wartGrad)" />
              <circle cx="0" cy="-48" r="5" fill="url(#wartGrad)" />
              <circle cx="-16" cy="-40" r="3.2" fill="url(#wartGrad)" />
              <circle cx="14" cy="-42" r="3.8" fill="url(#wartGrad)" />
            </g>
          )}

          {/* Petal 2: Far Right */}
          {(isFullBloom || unfoldedPetalsCount >= 2) && (
            <g transform="rotate(94)">
              <path
                d="M -22,-32 C -32,-78 32,-78 22,-32 C 12,-18 -12,-18 -22,-32 Z"
                fill="url(#petalGrad)"
                stroke="#450a0a"
                strokeWidth="2.5"
              />
              <circle cx="-10" cy="-58" r="4.5" fill="url(#wartGrad)" />
              <circle cx="12" cy="-60" r="3.6" fill="url(#wartGrad)" />
              <circle cx="2" cy="-46" r="4.8" fill="url(#wartGrad)" />
              <circle cx="-14" cy="-42" r="3.4" fill="url(#wartGrad)" />
            </g>
          )}

          {/* Petal 3: Bottom Right */}
          {(isFullBloom || unfoldedPetalsCount >= 3) && (
            <g transform="rotate(166)">
              <path
                d="M -22,-32 C -32,-78 32,-78 22,-32 C 12,-18 -12,-18 -22,-32 Z"
                fill="url(#petalGrad)"
                stroke="#450a0a"
                strokeWidth="2.5"
              />
              <circle cx="-8" cy="-58" r="4" fill="url(#wartGrad)" />
              <circle cx="10" cy="-62" r="4.5" fill="url(#wartGrad)" />
              <circle cx="0" cy="-48" r="5.2" fill="url(#wartGrad)" />
              <circle cx="14" cy="-40" r="3.2" fill="url(#wartGrad)" />
            </g>
          )}

          {/* Petal 4: Bottom Left */}
          {(isFullBloom || unfoldedPetalsCount >= 4) && (
            <g transform="rotate(238)">
              <path
                d="M -22,-32 C -32,-78 32,-78 22,-32 C 12,-18 -12,-18 -22,-32 Z"
                fill="url(#petalGrad)"
                stroke="#450a0a"
                strokeWidth="2.5"
              />
              <circle cx="-12" cy="-58" r="4.8" fill="url(#wartGrad)" />
              <circle cx="10" cy="-60" r="3.8" fill="url(#wartGrad)" />
              <circle cx="0" cy="-48" r="5" fill="url(#wartGrad)" />
              <circle cx="-14" cy="-42" r="3.2" fill="url(#wartGrad)" />
            </g>
          )}

          {/* Petal 5: Top Left */}
          {(isFullBloom || unfoldedPetalsCount >= 5) && (
            <g transform="rotate(310)">
              <path
                d="M -22,-32 C -32,-78 32,-78 22,-32 C 12,-18 -12,-18 -22,-32 Z"
                fill="url(#petalGrad)"
                stroke="#450a0a"
                strokeWidth="2.5"
              />
              <circle cx="-10" cy="-60" r="4.2" fill="url(#wartGrad)" />
              <circle cx="12" cy="-62" r="3.8" fill="url(#wartGrad)" />
              <circle cx="0" cy="-48" r="5" fill="url(#wartGrad)" />
              <circle cx="14" cy="-42" r="3.5" fill="url(#wartGrad)" />
            </g>
          )}

          {/* 4. CENTRAL CUP / DIAPHRAGM COLLAR */}
          {(isFullBloom || unfoldedPetalsCount >= 3) && (
            <>
              <circle cx="0" cy="0" r="36" fill="url(#centralApertureGrad)" stroke="#270202" strokeWidth="3" />
              <circle cx="0" cy="0" r="28" fill="#180101" />

              {/* Diaphragm Pustules Ring */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => {
                const rad = (angle * Math.PI) / 180;
                const x = Math.cos(rad) * 31;
                const y = Math.sin(rad) * 31;
                return <circle key={idx} cx={x} cy={y} r="2.2" fill="url(#wartGrad)" />;
              })}

              {/* 5. CENTRAL DISC WITH SPICY RAMENTA PROCESSES */}
              <circle cx="0" cy="0" r="18" fill="#500707" stroke="#250202" strokeWidth="1.5" />
              {/* Spikes / Ramenta */}
              <polygon points="-8,-4 -5,-12 -2,-4" fill="#fde047" stroke="#78350f" strokeWidth="0.8" />
              <polygon points="2,-4 5,-12 8,-4" fill="#fde047" stroke="#78350f" strokeWidth="0.8" />
              <polygon points="-10,4 -7,12 -4,4" fill="#fde047" stroke="#78350f" strokeWidth="0.8" />
              <polygon points="4,4 7,12 10,4" fill="#fde047" stroke="#78350f" strokeWidth="0.8" />
              <polygon points="-3,-2 0,-9 3,-2" fill="#facc15" stroke="#78350f" strokeWidth="0.8" />
            </>
          )}
        </g>
      )}

      {/* 6. CARRION FLY (LUCILIA) POLLINATOR */}
      {isFlyPollinating && (
        <g
          transform={
            flyPosition === 1
              ? 'translate(112, 110)'
              : flyPosition === 2
              ? 'translate(125, 118)'
              : flyPosition === 3
              ? 'translate(120, 108)'
              : 'translate(145, 85)'
          }
          className={flyPosition === 0 ? styles.flyBuzzing : ''}
          style={{ transition: 'transform 0.4s ease-in-out' }}
        >
          {/* Transparent buzzing wings */}
          <ellipse cx="-8" cy="-8" rx="10" ry="4" fill="#ffffff" opacity="0.65" transform="rotate(-30)" />
          <ellipse cx="8" cy="-8" rx="10" ry="4" fill="#ffffff" opacity="0.65" transform="rotate(30)" />
          {/* Fly Thorax & Abdomen */}
          <ellipse cx="0" cy="0" rx="5" ry="7" fill="url(#flyBodyGrad)" stroke="#083344" strokeWidth="1.2" />
          {/* Red Compound Eyes */}
          <circle cx="-3" cy="-6" r="2.5" fill="#dc2626" />
          <circle cx="3" cy="-6" r="2.5" fill="#dc2626" />
          {/* Pollen Dust on Back */}
          <circle cx="0" cy="2" r="2.5" fill="#fef08a" opacity="0.95" />
        </g>
      )}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// MAIN GAME COMPONENT: RareFloraExplorer
// ---------------------------------------------------------------------------
export default function RareFloraExplorer({ questId: propQuestId }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetQuestId = propQuestId || searchParams.get('questId') || 'quest-hs-3';
  const { completeQuest } = useGame();
  const { playSfx } = useAudio();

  // Primary game stage: 'kantongSemar' | 'rafflesia' | 'kuis'
  const [activeTab, setActiveTab] = useState('kantongSemar');

  // --- KANTONG SEMAR INTERACTIVE STATES ---
  // Sub-step: 0 (Oles Nektar 3 Titik) -> 1 (Timing Trap Semut) -> 2 (Tangkap 5 Gelembung Nitrogen) -> 3 (Selesai)
  const [pitcherStep, setPitcherStep] = useState(0);
  const [nectarSpotsDone, setNectarSpotsDone] = useState([false, false, false]);
  const [isAntMoving, setIsAntMoving] = useState(false);
  const [antInSlipperyZone, setAntInSlipperyZone] = useState(false);
  const [isDigesting, setIsDigesting] = useState(false);
  const [nitrogenLevel, setNitrogenLevel] = useState(0);
  const [caughtBubbles, setCaughtBubbles] = useState([]);

  // --- RAFFLESIA INTERACTIVE STATES ---
  // Sub-step: 0 (Mekarkan 5 Kelopak) -> 1 (Pompa Aroma 3x) -> 2 (Polinasi 3 Titik Ramenta) -> 3 (Selesai)
  const [rafflesiaStep, setRafflesiaStep] = useState(0);
  const [unfoldedPetals, setUnfoldedPetals] = useState([false, false, false, false, false]);
  const [isBlooming, setIsBlooming] = useState(false);
  const [scentPumpCount, setScentPumpCount] = useState(0);
  const [isScenting, setIsScenting] = useState(false);
  const [isPumpingScent, setIsPumpingScent] = useState(false);
  const [isFlyPollinating, setIsFlyPollinating] = useState(false);
  const [flyPollenTargets, setFlyPollenTargets] = useState([false, false, false]);
  const [flyPosition, setFlyPosition] = useState(0);

  // Field Notes Quiz State
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [showVictory, setShowVictory] = useState(false);
  const [showBriefingModal, setShowBriefingModal] = useState(false);
  const [lockToast, setLockToast] = useState(null);

  // Level Progression & Unlock Logic
  const isPitcherCompleted = pitcherStep >= 3;
  const isRafflesiaUnlocked = isPitcherCompleted;
  const isRafflesiaCompleted = rafflesiaStep >= 3;
  const isQuizUnlocked = isPitcherCompleted && isRafflesiaCompleted;

  function handleSwitchTab(targetTab) {
    if (targetTab === 'rafflesia' && !isRafflesiaUnlocked) {
      triggerSound('wrong');
      setLockToast('🔒 Selesaikan observasi Kantong Semar terlebih dahulu!');
      setTimeout(() => setLockToast(null), 2400);
      return;
    }
    if (targetTab === 'kuis' && !isQuizUnlocked) {
      triggerSound('wrong');
      const msg = !isPitcherCompleted
        ? '🔒 Selesaikan observasi Kantong Semar terlebih dahulu!'
        : '🔒 Selesaikan observasi Padma Raksasa terlebih dahulu!';
      setLockToast(msg);
      setTimeout(() => setLockToast(null), 2400);
      return;
    }

    triggerSound('button-click');
    setActiveTab(targetTab);
  }

  // Sound helper
  function triggerSound(sfxName) {
    if (playSfx) {
      try {
        playSfx(sfxName);
      } catch (e) {
        /* ignore */
      }
    }
  }

  // ---------------------------------------------------------------------------
  // KANTONG SEMAR INTERACTIVE ACTIONS
  // ---------------------------------------------------------------------------

  // 1. Tapping 3 Nectar Spots on Peristome
  function handleTapNectarSpot(index) {
    if (nectarSpotsDone[index]) return;
    triggerSound('pop');
    const nextSpots = [...nectarSpotsDone];
    nextSpots[index] = true;
    setNectarSpotsDone(nextSpots);

    const count = nextSpots.filter(Boolean).length;
    if (count === 3) {
      triggerSound('reward');
      setTimeout(() => {
        setPitcherStep(1);
        startAntWalk();
      }, 600);
    }
  }

  // 2. Ant Walking & Timing Slip
  function startAntWalk() {
    setIsAntMoving(true);
    // After 1.2s, ant reaches slippery zone
    setTimeout(() => {
      setAntInSlipperyZone(true);
    }, 1200);
    // Auto slip fallback after 3s if player didn't tap
    setTimeout(() => {
      triggerAntSlip();
    }, 3200);
  }

  function triggerAntSlip() {
    if (pitcherStep >= 2) return;
    triggerSound('whoosh');
    setAntInSlipperyZone(false);
    setTimeout(() => {
      triggerSound('splash');
      setPitcherStep(2);
      setIsDigesting(true);
    }, 800);
  }

  // 3. Catching Nitrogen Bubbles
  const NITROGEN_BUBBLE_POSITIONS = [
    { id: 1, top: '48%', left: '32%' },
    { id: 2, top: '38%', left: '60%' },
    { id: 3, top: '56%', left: '46%' },
    { id: 4, top: '28%', left: '40%' },
    { id: 5, top: '32%', left: '68%' }
  ];

  function handleCatchBubble(id) {
    if (caughtBubbles.includes(id)) return;
    triggerSound('coin');
    const nextCaught = [...caughtBubbles, id];
    setCaughtBubbles(nextCaught);
    const newLevel = Math.min(100, nextCaught.length * 20);
    setNitrogenLevel(newLevel);

    if (nextCaught.length === 5) {
      triggerSound('fanfare');
      setPitcherStep(3);
      setTimeout(() => {
        setActiveTab('rafflesia');
      }, 1200);
    }
  }

  // ---------------------------------------------------------------------------
  // RAFFLESIA INTERACTIVE ACTIONS
  // ---------------------------------------------------------------------------

  // 1. Unfolding 5 Giant Petals One-by-One
  const PETAL_BADGE_POSITIONS = [
    { id: 0, top: '22%', left: '62%', label: '1' },
    { id: 1, top: '50%', left: '78%', label: '2' },
    { id: 2, top: '78%', left: '64%', label: '3' },
    { id: 3, top: '74%', left: '26%', label: '4' },
    { id: 4, top: '30%', left: '28%', label: '5' }
  ];

  function handleUnfoldPetal(idx) {
    if (unfoldedPetals[idx]) return;
    triggerSound('hint');
    const nextPetals = [...unfoldedPetals];
    nextPetals[idx] = true;
    setUnfoldedPetals(nextPetals);

    const count = nextPetals.filter(Boolean).length;
    if (count === 5) {
      triggerSound('fanfare');
      setIsBlooming(true);
      setTimeout(() => {
        setRafflesiaStep(1);
      }, 700);
    }
  }

  // 2. Pumping Carrion Scent (3 Pumps) - Clicked directly on the plant
  function handlePumpScent() {
    if (scentPumpCount >= 3) return;
    triggerSound('magic');
    setIsPumpingScent(true);
    setTimeout(() => setIsPumpingScent(false), 300);
    const nextCount = scentPumpCount + 1;
    setScentPumpCount(nextCount);
    setIsScenting(true);

    if (nextCount === 3) {
      triggerSound('reward');
      setIsFlyPollinating(true);
      setTimeout(() => {
        setRafflesiaStep(2);
      }, 800);
    }
  }

  // 3. Guiding Fly to Ramenta Spikes (3 Pollen Spots)
  const FLY_RAMENTA_TARGETS = [
    { id: 0, top: '48%', left: '46%', label: 'Duri 1' },
    { id: 1, top: '56%', left: '54%', label: 'Duri 2' },
    { id: 2, top: '46%', left: '52%', label: 'Duri 3' }
  ];

  function handleFlyLanding(idx) {
    if (flyPollenTargets[idx]) return;
    triggerSound('correct');
    const nextTargets = [...flyPollenTargets];
    nextTargets[idx] = true;
    setFlyPollenTargets(nextTargets);
    setFlyPosition(idx + 1);

    const count = nextTargets.filter(Boolean).length;
    if (count === 3) {
      triggerSound('fanfare');
      setTimeout(() => {
        setRafflesiaStep(3);
        setTimeout(() => {
          setActiveTab('kuis');
        }, 1200);
      }, 700);
    }
  }

  // ---------------------------------------------------------------------------
  // BOTANICAL FIELD QUIZ QUESTIONS
  // ---------------------------------------------------------------------------
  const QUIZ_QUESTIONS = [
    {
      q: 'Mengapa tanaman kantong semar menjebak dan mencerna serangga?',
      options: [
        { label: 'A', text: 'Karena tidak menyukai sinar matahari' },
        { label: 'B', text: 'Untuk menyerap unsur Nitrogen (N) di tanah miskin hara', isCorrect: true },
        { label: 'C', text: 'Untuk melindungi diri dari hewan pemangsa rumput' }
      ],
      explanation: 'Tanah rawa gambut sangat miskin nutrisi nitrogen. Kantong semar berevolusi memangsa serangga untuk memenuhi kebutuhan nitrogennya!'
    },
    {
      q: 'Apa fungsi utama tutup (operculum) di bagian atas kantong semar?',
      options: [
        { label: 'A', text: 'Mencegah air hujan mengencerkan enzim pencerna di dalam kantong', isCorrect: true },
        { label: 'B', text: 'Mengunyah serangga yang terperangkap' },
        { label: 'C', text: 'Menyerap air embun untuk diminum daun' }
      ],
      explanation: 'Operculum berfungsi seperti payung alami agar cairan asam enzim pencerna tidak luber atau encer saat hujan deras turun!'
    },
    {
      q: 'Mengapa bunga Padma Raksasa (Rafflesia arnoldii) mengeluarkan aroma busuk seperti bangkai?',
      options: [
        { label: 'A', text: 'Untuk mengusir satwa hutan agar tidak menginjaknya' },
        { label: 'B', text: 'Untuk memikat lalat bangkai membantu penyerbukan silang', isCorrect: true },
        { label: 'C', text: 'Karena kelopaknya langsung membusuk saat mekar' }
      ],
      explanation: 'Rafflesia tidak menghasilkan nektar manis. Ia memikat lalat bangkai dengan aroma khas untuk membawa serbuk sari ke bunga lain!'
    }
  ];

  function handleAnswerOption(optIndex) {
    if (selectedOption !== null) return;
    setSelectedOption(optIndex);

    const isRight = QUIZ_QUESTIONS[currentQuestionIdx].options[optIndex].isCorrect;
    if (isRight) {
      triggerSound('correct');
      setQuizScore((prev) => prev + 1);
    } else {
      triggerSound('wrong');
    }

    setTimeout(() => {
      if (currentQuestionIdx + 1 < QUIZ_QUESTIONS.length) {
        setCurrentQuestionIdx((prev) => prev + 1);
        setSelectedOption(null);
      } else {
        triggerSound('fanfare');
        setShowVictory(true);
      }
    }, 1200);
  }

  // ---------------------------------------------------------------------------
  // CLAIM REWARDS & COMPLETE QUEST
  // ---------------------------------------------------------------------------
  function handleClaimReward() {
    triggerSound('fanfare');
    if (completeQuest) {
      completeQuest(targetQuestId, 100, 160, 45, 'card-rare-flora');
    }
    navigate('/world/hutan-sains');
  }

  return (
    <div className={styles.gameContainer}>
      {/* 1. TOP BAR */}
      <header className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <div className={styles.badgeIcon}>🌿</div>
          <div className={styles.titleGroup}>
            <span className={styles.tagline}>Misi 03 • Hutan Sains</span>
            <h1 className={styles.mainTitle}>Penjelajah Flora Langka</h1>
          </div>
        </div>

        <div className={styles.topBarRight}>
          <button
            type="button"
            className={styles.helpBtn}
            onClick={() => setShowBriefingModal(true)}
            title="Klik untuk panduan misi lengkap"
          >
            <span>❓ Panduan</span>
          </button>
          <div className={styles.scorePill}>
            <span>⭐ +160 XP</span>
          </div>
        </div>
      </header>

      {/* 2. TABS NAVIGATOR (LEVEL PROGRESSION GATED) */}
      <nav className={styles.tabsContainer}>
        <button
          type="button"
          onClick={() => handleSwitchTab('kantongSemar')}
          className={`${styles.tabBtn} ${activeTab === 'kantongSemar' ? styles.tabBtnActive : ''} ${isPitcherCompleted ? styles.tabBtnCompleted : ''}`}
        >
          <span>🌿 Kantong Semar</span>
          {isPitcherCompleted && <span className={styles.tabCheck}>✓</span>}
        </button>

        <button
          type="button"
          onClick={() => handleSwitchTab('rafflesia')}
          className={`${styles.tabBtn} ${activeTab === 'rafflesia' ? styles.tabBtnActive : ''} ${isRafflesiaCompleted ? styles.tabBtnCompleted : ''} ${!isRafflesiaUnlocked ? styles.tabBtnLocked : ''}`}
          title={!isRafflesiaUnlocked ? 'Terkunci: Selesaikan observasi Kantong Semar terlebih dahulu' : 'Buka Observasi Padma Raksasa'}
        >
          <span>🌺 Padma Raksasa</span>
          {isRafflesiaCompleted ? (
            <span className={styles.tabCheck}>✓</span>
          ) : !isRafflesiaUnlocked ? (
            <span className={styles.tabLockIcon}>🔒</span>
          ) : null}
        </button>

        <button
          type="button"
          onClick={() => handleSwitchTab('kuis')}
          className={`${styles.tabBtn} ${activeTab === 'kuis' ? styles.tabBtnActive : ''} ${!isQuizUnlocked ? styles.tabBtnLocked : ''}`}
          title={!isQuizUnlocked ? 'Terkunci: Selesaikan observasi Padma Raksasa terlebih dahulu' : 'Buka Kuis Lapangan'}
        >
          <span>📝 Kuis Lapangan</span>
          {showVictory ? (
            <span className={styles.tabCheck}>✓</span>
          ) : !isQuizUnlocked ? (
            <span className={styles.tabLockIcon}>🔒</span>
          ) : null}
        </button>
      </nav>

      {/* 3. CENTRAL SHOWCASE CANVAS (WITH INTERACTIVE OVERLAYS) */}
      <main className={styles.stageCanvasCard}>
        {/* Lock Notice Toast */}
        {lockToast && (
          <div className={styles.lockToast}>
            <span>{lockToast}</span>
          </div>
        )}

        {activeTab === 'kantongSemar' && (
          <>
            <div className={styles.floatingPromptBadge}>
              {pitcherStep === 0 && (
                <span>🍯 Oleskan 3 titik nektar ({nectarSpotsDone.filter(Boolean).length}/3)</span>
              )}
              {pitcherStep === 1 && (
                <span>{antInSlipperyZone ? '⚠️ Semut di bibir licin!' : '🐜 Tunggu semut di bibir licin...'}</span>
              )}
              {pitcherStep === 2 && (
                <span>🧪 Tangkap 5 molekul Nitrogen ({caughtBubbles.length}/5)</span>
              )}
              {pitcherStep >= 3 && (
                <>
                  <span>✨ Kantong Semar Tuntas!</span>
                  <button
                    type="button"
                    className={styles.floatingNextBtn}
                    onClick={() => handleSwitchTab('rafflesia')}
                  >
                    Padma 🌺 ➡️
                  </button>
                </>
              )}
            </div>

            <div className={styles.svgIllustrationWrap}>
              <AnimatedPitcherPlant
                step={pitcherStep}
                isAntMoving={isAntMoving}
                isDigesting={isDigesting}
                nitrogenLevel={nitrogenLevel}
                nectarSpots={nectarSpotsDone}
              />
            </div>

            {/* INTERACTION 1: 3 NECTAR SPOTS */}
            {pitcherStep === 0 && (
              <div className={styles.nectarSpotsOverlay}>
                <div
                  className={`${styles.interactiveSpot} ${nectarSpotsDone[0] ? styles.interactiveSpotDone : ''}`}
                  style={{ top: '35%', left: '42%' }}
                  onClick={() => handleTapNectarSpot(0)}
                  title="Ketuk untuk mengoles nektar di bibir kiri"
                >
                  {nectarSpotsDone[0] ? '✓' : '🍯'}
                </div>
                <div
                  className={`${styles.interactiveSpot} ${nectarSpotsDone[1] ? styles.interactiveSpotDone : ''}`}
                  style={{ top: '38%', left: '50%' }}
                  onClick={() => handleTapNectarSpot(1)}
                  title="Ketuk untuk mengoles nektar di bibir tengah"
                >
                  {nectarSpotsDone[1] ? '✓' : '🍯'}
                </div>
                <div
                  className={`${styles.interactiveSpot} ${nectarSpotsDone[2] ? styles.interactiveSpotDone : ''}`}
                  style={{ top: '35%', left: '58%' }}
                  onClick={() => handleTapNectarSpot(2)}
                  title="Ketuk untuk mengoles nektar di bibir kanan"
                >
                  {nectarSpotsDone[2] ? '✓' : '🍯'}
                </div>
              </div>
            )}

            {/* INTERACTION 2: TIMING SLIP TRIGGER */}
            {pitcherStep === 1 && (
              <div className={styles.miniActionStrip}>
                <p className={styles.stripPromptText}>
                  {antInSlipperyZone
                    ? '⚠️ SEMUT DI ZONA LICIN! TEKAN SEKARANG!'
                    : 'Semut merayap mendekati bibir peristome...'}
                </p>
                <button
                  type="button"
                  className={styles.stripActionBtn}
                  onClick={triggerAntSlip}
                >
                  <span>⚡ Picu Perangkap Licin!</span>
                </button>
              </div>
            )}

            {/* INTERACTION 3: NITROGEN BUBBLES FLOATING TO CATCH */}
            {pitcherStep === 2 && (
              <div className={styles.floatingBubblesLayer}>
                {NITROGEN_BUBBLE_POSITIONS.map((b) => {
                  const isCaught = caughtBubbles.includes(b.id);
                  if (isCaught) return null;
                  return (
                    <div
                      key={b.id}
                      className={styles.clickableNitrogenBubble}
                      style={{ top: b.top, left: b.left }}
                      onClick={() => handleCatchBubble(b.id)}
                      title="Ketuk untuk menangkap molekul Nitrogen (+N)!"
                    >
                      <span>+N</span>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {activeTab === 'rafflesia' && (
          <>
            <div className={styles.floatingPromptBadge}>
              {rafflesiaStep === 0 && (
                <span>🌸 Buka 5 kelopak mekar ({unfoldedPetals.filter(Boolean).length}/5)</span>
              )}
              {rafflesiaStep === 1 && (
                <span>💨 Ketuk tanaman bunga Padma ({scentPumpCount}/3)</span>
              )}
              {rafflesiaStep === 2 && (
                <span>🪰 Tuntun lalat ke duri ramenta ({flyPollenTargets.filter(Boolean).length}/3)</span>
              )}
              {rafflesiaStep >= 3 && (
                <>
                  <span>✨ Penyerbukan Tuntas!</span>
                  <button
                    type="button"
                    className={styles.floatingNextBtn}
                    onClick={() => handleSwitchTab('kuis')}
                  >
                    Kuis 📝 ➡️
                  </button>
                </>
              )}
            </div>

            <div className={styles.svgIllustrationWrap}>
              <AnimatedRafflesia
                step={rafflesiaStep}
                isBlooming={isBlooming}
                isScenting={isScenting}
                isFlyPollinating={isFlyPollinating}
                unfoldedPetalsCount={unfoldedPetals.filter(Boolean).length}
                flyPosition={flyPosition}
                isPumping={isPumpingScent}
              />
            </div>

            {/* INTERACTION 1: 5 PETAL UNVEIL TARGETS */}
            {rafflesiaStep === 0 && (
              <div className={styles.nectarSpotsOverlay}>
                {PETAL_BADGE_POSITIONS.map((p, idx) => (
                  <div
                    key={p.id}
                    className={`${styles.petalBadgeBtn} ${unfoldedPetals[idx] ? styles.petalBadgeBtnDone : ''}`}
                    style={{ top: p.top, left: p.left }}
                    onClick={() => handleUnfoldPetal(idx)}
                    title={`Ketuk untuk membuka kelopak ${p.label}`}
                  >
                    <span>{unfoldedPetals[idx] ? '✓' : p.label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* INTERACTION 2: PUMP SCENT WAVES - CLICK PLANT DIRECTLY (NO BUTTON) */}
            {rafflesiaStep === 1 && (
              <>
                <div
                  className={styles.plantPumpOverlay}
                  onClick={handlePumpScent}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handlePumpScent();
                    }
                  }}
                  title="Ketuk tanaman untuk memompa aroma bangkai!"
                >
                  <div className={styles.plantPumpHotspot}>
                    <span className={styles.plantPumpIcon}>💨</span>
                    <span className={styles.plantPumpHint}>Ketuk!</span>
                  </div>
                </div>

                <div className={styles.miniActionStrip}>
                  <p className={styles.stripPromptText}>
                    {scentPumpCount === 0 && '👆 Ketuk tanaman bunga Padma untuk memompa aroma! (0/3)'}
                    {scentPumpCount === 1 && '💨 Aroma busuk mulai menyebar ke hutan rimba! Ketuk lagi! (1/3)'}
                    {scentPumpCount === 2 && '🌸 Satu ketukan lagi pada tanaman untuk memanggil lalat! (2/3)'}
                    {scentPumpCount >= 3 && '🪰 Lalat bangkai telah datang terpikat aroma! (3/3)'}
                  </p>
                  <div className={styles.scentProgressBadge}>
                    <span className={styles.scentProgressPill}>
                      💨 {scentPumpCount}/3
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* INTERACTION 3: FLY LANDING ON RAMENTA SPIKES */}
            {rafflesiaStep === 2 && (
              <div className={styles.nectarSpotsOverlay}>
                {FLY_RAMENTA_TARGETS.map((t, idx) => (
                  <div
                    key={t.id}
                    className={`${styles.flyTargetSpot} ${flyPollenTargets[idx] ? styles.flyTargetSpotDone : ''}`}
                    style={{ top: t.top, left: t.left }}
                    onClick={() => handleFlyLanding(idx)}
                    title={`Ketuk untuk menuntun lalat ke ${t.label}`}
                  >
                    <span>{flyPollenTargets[idx] ? '✓' : `🎯 ${idx + 1}`}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'kuis' && (
          <div className={styles.quizCard}>
            <div className={styles.quizHeader}>
              <span className={styles.quizTag}>Catatan Lapangan Botani</span>
              <span className={styles.quizCount}>
                Soal {currentQuestionIdx + 1} dari {QUIZ_QUESTIONS.length}
              </span>
            </div>

            {/* BOTANICAL QUIZ ILLUSTRATION */}
            <div className={styles.quizIllustrationWrapper}>
              <img
                src={
                  currentQuestionIdx === 0
                    ? '/images/quiz-flora-nitrogen.jpg'
                    : currentQuestionIdx === 1
                    ? '/images/quiz-flora-operculum.jpg'
                    : '/images/quiz-flora-rafflesia.jpg'
                }
                alt="Ilustrasi Botani Flora Langka"
                className={styles.quizImage}
              />
              <div className={styles.quizImageTag}>
                {currentQuestionIdx === 0 && '🧪 Absorpsi Nitrogen (+N)'}
                {currentQuestionIdx === 1 && '☂️ Operculum Payung Alami'}
                {currentQuestionIdx === 2 && '🪰 Pemikat Lalat Penyerbuk'}
              </div>
            </div>

            <div className={styles.questionBox}>
              <p className={styles.questionText}>
                {QUIZ_QUESTIONS[currentQuestionIdx].q}
              </p>
            </div>

            <div className={styles.optionsGrid}>
              {QUIZ_QUESTIONS[currentQuestionIdx].options.map((opt, oIdx) => {
                const isChosen = selectedOption === oIdx;
                let optClass = styles.optionBtn;
                if (selectedOption !== null) {
                  if (opt.isCorrect) optClass += ` ${styles.optionBtnCorrect}`;
                  else if (isChosen) optClass += ` ${styles.optionBtnWrong}`;
                }

                return (
                  <button
                    key={oIdx}
                    type="button"
                    onClick={() => handleAnswerOption(oIdx)}
                    disabled={selectedOption !== null}
                    className={optClass}
                  >
                    <span className={styles.optionLetter}>{opt.label}</span>
                    <span className={styles.optionText}>{opt.text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* 4. BOTTOM CONTROLS DOCK */}
      <footer className={styles.bottomDock}>
        {/* Global Progress Track */}
        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{
              width: `${((pitcherStep + rafflesiaStep + (activeTab === 'kuis' ? currentQuestionIdx + 1 : 0)) / 9) * 100}%`
            }}
          />
        </div>
      </footer>

      {/* 4B. PANDUAN MISI BRIEFING MODAL */}
      {showBriefingModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>🧭 Panduan Misi 03: Flora Langka</h3>
              <button
                type="button"
                className={styles.modalCloseIcon}
                onClick={() => setShowBriefingModal(false)}
              >
                ✕
              </button>
            </div>

            <div className={styles.targetChecklist}>
              <div className={`${styles.targetCard} ${pitcherStep >= 3 ? styles.targetCardDone : ''}`}>
                <div className={styles.targetNumCircle}>{pitcherStep >= 3 ? '✓' : '1'}</div>
                <div className={styles.targetTextGroup}>
                  <h4 className={styles.targetTitle}>Target 1: Kantong Semar (Nepenthes)</h4>
                  <p className={styles.targetDesc}>
                    Oleskan 3 tetes nektar di bibir peristome ➔ Picu perangkap licin saat semut lewat ➔ Tangkap 5 gelembung gas Nitrogen (+N) yang melayang.
                  </p>
                </div>
              </div>

              <div className={`${styles.targetCard} ${rafflesiaStep >= 3 ? styles.targetCardDone : ''}`}>
                <div className={styles.targetNumCircle}>{rafflesiaStep >= 3 ? '✓' : '2'}</div>
                <div className={styles.targetTextGroup}>
                  <h4 className={styles.targetTitle}>Target 2: Padma Raksasa (Rafflesia arnoldii)</h4>
                  <p className={styles.targetDesc}>
                    Buka 5 kelopak raksasa bertotol ➔ Pompa aroma bangkai 3x ➔ Tuntun lalat mendarat di 3 duri ramenta untuk serbuki bunga.
                  </p>
                </div>
              </div>

              <div className={`${styles.targetCard} ${showVictory ? styles.targetCardDone : ''}`}>
                <div className={styles.targetNumCircle}>{showVictory ? '✓' : '3'}</div>
                <div className={styles.targetTextGroup}>
                  <h4 className={styles.targetTitle}>Target 3: Catatan Lapangan & Kuis Botani</h4>
                  <p className={styles.targetDesc}>
                    Jawab 3 pertanyaan adaptasi tumbuhan endemik untuk mengklaim +160 XP, +45 Koin, dan Kartu Koleksi Legendaris!
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              className={styles.modalCloseBtn}
              onClick={() => setShowBriefingModal(false)}
            >
              <span>Paham, Ayo Jelajahi! 🚀</span>
            </button>
          </div>
        </div>
      )}

      {/* 5. VICTORY MODAL OVERLAY */}
      {showVictory && (
        <div className={styles.victoryOverlay}>
          <div className={styles.victoryCard}>
            <div className={styles.victoryStars}>⭐⭐⭐</div>
            <h2 className={styles.victoryTitle}>Ekspedisi Flora Sukses! 🎉</h2>
            <p className={styles.victorySubtitle}>
              Kamu berhasil mendokumentasikan adaptasi Kantong Semar karnivora dan Padma Raksasa holoparasit!
            </p>

            <div className={styles.rewardsRow}>
              <div className={styles.rewardItem}>
                <span className={styles.rewardIcon}>⚡</span>
                <span className={styles.rewardLabel}>Pengalaman</span>
                <span className={styles.rewardValue}>+160 XP</span>
              </div>
              <div className={styles.rewardItem}>
                <span className={styles.rewardIcon}>🪙</span>
                <span className={styles.rewardLabel}>Koin Rimba</span>
                <span className={styles.rewardValue}>+45 Koin</span>
              </div>
              <div className={styles.rewardItem}>
                <span className={styles.rewardIcon}>🔬</span>
                <span className={styles.rewardLabel}>Akurasi</span>
                <span className={styles.rewardValue}>{quizScore}/3 Benar</span>
              </div>
            </div>

            {/* Collectible Card Box */}
            <div className={styles.cardPreviewBox}>
              <div className={styles.cardIconCircle}>🌺</div>
              <div>
                <h3 className={styles.cardTitle}>Kartu Koleksi Terbuka!</h3>
                <p className={styles.cardDesc}>Padma Raksasa & Kantong Semar Rimba</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClaimReward}
              className={styles.claimBtn}
            >
              <span>Klaim Hadiah & Kembali ke Peta 🚀</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

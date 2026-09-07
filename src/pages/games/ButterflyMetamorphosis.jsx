import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { useAudio } from '../../context/AudioContext';
import styles from './ButterflyMetamorphosis.module.css';

// ---------------------------------------------------------------------------
// METAMORPHOSIS SVG GRAPHICS (Directly matching the textbook diagram)
// ---------------------------------------------------------------------------

// 1. TELUR DI DAUN (Leaf with Eggs - Realistic Shading, Botanical Vein Texture & Pearlescent Fluted Eggs)
function AnimatedLeafEggs({ isHatched, isWiggling }) {
  return (
    <svg viewBox="0 0 130 95" width="134" height="98" style={{ overflow: 'visible' }}>
      <defs>
        {/* Leaf 3D Body Gradient */}
        <linearGradient id="leafBladeGrad" x1="15%" y1="10%" x2="85%" y2="90%">
          <stop offset="0%" stopColor="#bbf7d0" />
          <stop offset="20%" stopColor="#4ade80" />
          <stop offset="55%" stopColor="#22c55e" />
          <stop offset="85%" stopColor="#16a34a" />
          <stop offset="100%" stopColor="#14532d" />
        </linearGradient>

        {/* Leaf Fold Shadow along Midrib Crease */}
        <linearGradient id="leafFoldShadow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#052e16" stopOpacity="0.55" />
          <stop offset="60%" stopColor="#14532d" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#15803d" stopOpacity="0" />
        </linearGradient>

        {/* Waxy Cuticle Sun Sheen */}
        <linearGradient id="leafSunSheen" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="40%" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        {/* Pearlescent 3D Egg Radial Gradient with Ambient Gold */}
        <radialGradient id="egg3DGrad" cx="35%" cy="30%" r="68%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="22%" stopColor="#fef9c3" />
          <stop offset="50%" stopColor="#fde047" />
          <stop offset="78%" stopColor="#eab308" />
          <stop offset="92%" stopColor="#a16207" />
          <stop offset="100%" stopColor="#713f12" />
        </radialGradient>

        {/* Egg Leaf Bounce Reflection (Green reflected light on egg bottom) */}
        <linearGradient id="eggBounceGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4ade80" stopOpacity="0" />
          <stop offset="75%" stopColor="#86efac" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0.65" />
        </linearGradient>

        {/* Egg Ambient Occlusion Shadow */}
        <radialGradient id="eggShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#052e16" stopOpacity="0.6" />
          <stop offset="70%" stopColor="#052e16" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#052e16" stopOpacity="0" />
        </radialGradient>

        {/* Stem Wood Texture Gradient */}
        <linearGradient id="leafStemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#166534" />
          <stop offset="40%" stopColor="#14532d" />
          <stop offset="80%" stopColor="#052e16" />
          <stop offset="100%" stopColor="#021f0e" />
        </linearGradient>

        {/* Dewdrop Caustic Gradient */}
        <radialGradient id="dewDropGrad" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#dcfce7" stopOpacity="0.6" />
          <stop offset="85%" stopColor="#86efac" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#15803d" stopOpacity="0.7" />
        </radialGradient>
      </defs>

      {/* Cast Shadow beneath leaf */}
      <path
        d="M22,70 C40,32 82,18 116,30 C122,50 106,80 72,84 C48,87 32,80 22,70 Z"
        fill="#052e16"
        opacity="0.18"
      />

      {/* Stem with 3D cylindrical stroke */}
      <path d="M14,72 Q32,58 55,48" stroke="url(#leafStemGrad)" strokeWidth="4.5" fill="none" strokeLinecap="round" />
      <path d="M14,71 Q32,57 55,47" stroke="#4ade80" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.4" />

      {/* Main Leaf Body with 3D Gradient */}
      <path
        d="M20,65 C38,24 82,8 116,22 C124,42 108,74 72,78 C50,82 32,76 20,65 Z"
        fill="url(#leafBladeGrad)"
        stroke="#15803d"
        strokeWidth="1.8"
      />

      {/* Leaf Specular Sheen (Glossy highlight on upper waxy cuticle curvature) */}
      <path
        d="M28,60 C44,28 78,16 108,24 C88,18 52,26 34,54 Z"
        fill="url(#leafSunSheen)"
      />

      {/* Shaded Lower Half of Leaf Blade (Volumetric fold shadow) */}
      <path
        d="M22,65 Q70,44 114,24 C116,40 104,72 72,78 C50,82 32,76 22,65 Z"
        fill="url(#leafFoldShadow)"
      />

      {/* Reticulate Tertiary Vein Mesh Texture (Realistic botanical leaf micro-texture) */}
      <g stroke="#16a34a" strokeWidth="0.6" fill="none" opacity="0.4" strokeLinecap="round">
        <path d="M38,50 Q42,44 48,46" />
        <path d="M52,43 Q56,38 64,40" />
        <path d="M68,36 Q74,32 80,34" />
        <path d="M84,30 Q90,26 96,28" />
        <path d="M46,62 Q52,66 58,63" />
        <path d="M64,57 Q70,62 76,58" />
        <path d="M80,51 Q86,56 94,52" />
      </g>

      {/* Secondary Lateral Veins */}
      <path d="M46,55 Q58,41 74,38" stroke="#16a34a" strokeWidth="1.4" fill="none" opacity="0.85" />
      <path d="M64,48 Q78,36 94,33" stroke="#16a34a" strokeWidth="1.4" fill="none" opacity="0.85" />
      <path d="M84,40 Q96,30 106,28" stroke="#16a34a" strokeWidth="1.2" fill="none" opacity="0.85" />
      <path d="M52,62 Q66,70 84,65" stroke="#14532d" strokeWidth="1.4" fill="none" opacity="0.75" />
      <path d="M70,55 Q84,62 100,56" stroke="#14532d" strokeWidth="1.4" fill="none" opacity="0.75" />

      {/* Main Central Vein (Midrib) with 3D Depth Ridge */}
      <path d="M22,65 Q70,44 114,24" stroke="#14532d" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d="M22,64 Q70,43 114,23" stroke="#bbf7d0" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.9" />

      {/* Morning Dewdrops with Refractive Caustic & Catchlight */}
      {/* Drop 1 */}
      <ellipse cx="38" cy="46" rx="3.5" ry="2.6" fill="#052e16" opacity="0.25" />
      <ellipse cx="37" cy="45" rx="3.2" ry="2.4" fill="url(#dewDropGrad)" stroke="#86efac" strokeWidth="0.5" />
      <circle cx="36" cy="44.2" r="0.9" fill="#ffffff" />
      <circle cx="38.5" cy="46" r="0.5" fill="#ffffff" opacity="0.6" />

      {/* Drop 2 (Near leaf edge) */}
      <ellipse cx="102" cy="62" rx="2.5" ry="1.8" fill="url(#dewDropGrad)" stroke="#86efac" strokeWidth="0.4" />
      <circle cx="101.3" cy="61.4" r="0.6" fill="#ffffff" />

      {/* Cluster of 3D Fluted Butterfly Eggs */}
      <g className={`${styles.eggGleam} ${isWiggling ? styles.eggHatching : ''}`}>
        {!isHatched ? (
          <>
            {/* Egg 1 */}
            <g>
              <ellipse cx="63" cy="43" rx="5.2" ry="2.6" fill="url(#eggShadow)" />
              <ellipse cx="62" cy="39.5" rx="4.8" ry="5.8" fill="url(#egg3DGrad)" stroke="#713f12" strokeWidth="0.8" />
              {/* Green leaf bounce light */}
              <ellipse cx="62" cy="39.5" rx="4.8" ry="5.8" fill="url(#eggBounceGrad)" />
              {/* Chorion Fluted Rib Textures */}
              <path d="M59.5,36 Q61.5,39.5 59.5,43" stroke="#ca8a04" strokeWidth="0.7" fill="none" opacity="0.5" />
              <path d="M64.5,36 Q62.5,39.5 64.5,43" stroke="#ca8a04" strokeWidth="0.7" fill="none" opacity="0.5" />
              <line x1="62" y1="34" x2="62" y2="44.5" stroke="#facc15" strokeWidth="0.6" opacity="0.6" />
              {/* Micropyle Crown & Specular Highlights */}
              <circle cx="62" cy="34.2" r="1.1" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.4" />
              <circle cx="60.2" cy="37.2" r="1.4" fill="#ffffff" />
              <circle cx="63.8" cy="42" r="0.7" fill="#ffffff" opacity="0.6" />
            </g>

            {/* Egg 2 */}
            <g>
              <ellipse cx="74" cy="37" rx="5.2" ry="2.6" fill="url(#eggShadow)" />
              <ellipse cx="73" cy="33.5" rx="4.8" ry="5.8" fill="url(#egg3DGrad)" stroke="#713f12" strokeWidth="0.8" />
              <ellipse cx="73" cy="33.5" rx="4.8" ry="5.8" fill="url(#eggBounceGrad)" />
              <path d="M70.5,30 Q72.5,33.5 70.5,37" stroke="#ca8a04" strokeWidth="0.7" fill="none" opacity="0.5" />
              <path d="M75.5,30 Q73.5,33.5 75.5,37" stroke="#ca8a04" strokeWidth="0.7" fill="none" opacity="0.5" />
              <line x1="73" y1="28" x2="73" y2="38.5" stroke="#facc15" strokeWidth="0.6" opacity="0.6" />
              <circle cx="73" cy="28.2" r="1.1" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.4" />
              <circle cx="71.2" cy="31.2" r="1.4" fill="#ffffff" />
              <circle cx="74.8" cy="36" r="0.7" fill="#ffffff" opacity="0.6" />
            </g>

            {/* Egg 3 */}
            <g>
              <ellipse cx="69" cy="51" rx="4.8" ry="2.5" fill="url(#eggShadow)" />
              <ellipse cx="68" cy="47.5" rx="4.5" ry="5.4" fill="url(#egg3DGrad)" stroke="#713f12" strokeWidth="0.8" />
              <ellipse cx="68" cy="47.5" rx="4.5" ry="5.4" fill="url(#eggBounceGrad)" />
              <path d="M65.8,44 Q67.5,47.5 65.8,51" stroke="#ca8a04" strokeWidth="0.7" fill="none" opacity="0.5" />
              <path d="M70.2,44 Q68.5,47.5 70.2,51" stroke="#ca8a04" strokeWidth="0.7" fill="none" opacity="0.5" />
              <circle cx="68" cy="42.5" r="1" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.4" />
              <circle cx="66.3" cy="45.2" r="1.3" fill="#ffffff" />
            </g>

            {/* Egg 4 */}
            <g>
              <ellipse cx="81" cy="45" rx="4.6" ry="2.4" fill="url(#eggShadow)" />
              <ellipse cx="80" cy="41.5" rx="4.3" ry="5.2" fill="url(#egg3DGrad)" stroke="#713f12" strokeWidth="0.8" />
              <ellipse cx="80" cy="41.5" rx="4.3" ry="5.2" fill="url(#eggBounceGrad)" />
              <path d="M78,38 Q79.5,41.5 78,45" stroke="#ca8a04" strokeWidth="0.6" fill="none" opacity="0.5" />
              <path d="M82,38 Q80.5,41.5 82,45" stroke="#ca8a04" strokeWidth="0.6" fill="none" opacity="0.5" />
              <circle cx="80" cy="36.5" r="1" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.4" />
              <circle cx="78.3" cy="39.2" r="1.3" fill="#ffffff" />
            </g>

            {/* Egg 5 */}
            <g>
              <ellipse cx="89" cy="39" rx="4.3" ry="2.2" fill="url(#eggShadow)" />
              <ellipse cx="88" cy="35.5" rx="4" ry="4.8" fill="url(#egg3DGrad)" stroke="#713f12" strokeWidth="0.8" />
              <ellipse cx="88" cy="35.5" rx="4" ry="4.8" fill="url(#eggBounceGrad)" />
              <circle cx="88" cy="31" r="0.9" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.4" />
              <circle cx="86.5" cy="33.8" r="1.2" fill="#ffffff" />
            </g>
          </>
        ) : (
          <>
            {/* Realistic cracked egg shells with interior depth */}
            <ellipse cx="74" cy="38" rx="5.5" ry="3.2" fill="#451a03" opacity="0.75" />
            <path d="M57,43 L61,38 L65,43 L69,38 L73,43 L76,39" stroke="#713f12" strokeWidth="2" fill="none" strokeLinecap="round" />
            {/* Baby caterpillar emerging with 3D volumetric shading */}
            <g style={{ animation: 'babyWiggle 0.8s infinite alternate' }}>
              <circle cx="74" cy="32" r="8" fill="url(#egg3DGrad)" stroke="#713f12" strokeWidth="1.6" />
              {/* Highlight on head */}
              <ellipse cx="72" cy="28.5" rx="3.5" ry="1.8" fill="#ffffff" opacity="0.6" />
              <circle cx="71.5" cy="30" r="2" fill="#18181b" />
              <circle cx="70.8" cy="29.2" r="0.8" fill="#ffffff" />
              <circle cx="76.5" cy="30" r="2" fill="#18181b" />
              <circle cx="75.8" cy="29.2" r="0.8" fill="#ffffff" />
              <path d="M71.5,34 Q74,37 76.5,34" stroke="#9a3412" strokeWidth="1.8" fill="none" strokeLinecap="round" />
              <path d="M71,26 L68.5,20.5" stroke="#713f12" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M77,26 L79.5,20.5" stroke="#713f12" strokeWidth="1.8" strokeLinecap="round" />
            </g>
          </>
        )}
      </g>
    </svg>
  );
}

// 2. ULAT DI RANTING MEMAKAN DAUN (Twig with Caterpillar & Bite Mark - Bark Texture, Cylindrical Shading & Bite Scars)
function AnimatedCaterpillarTwig({ isCrawling, isChewing, biteCount = 1 }) {
  return (
    <svg viewBox="0 0 140 100" width="140" height="100" style={{ overflow: 'visible' }}>
      <defs>
        {/* Realistic Bark Wood Gradient */}
        <linearGradient id="barkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#b45309" />
          <stop offset="25%" stopColor="#854d0e" />
          <stop offset="55%" stopColor="#713f12" />
          <stop offset="85%" stopColor="#451a03" />
          <stop offset="100%" stopColor="#1c0a00" />
        </linearGradient>

        {/* Chewed Leaf Body Gradient */}
        <linearGradient id="caterpillarLeafGrad" x1="10%" y1="10%" x2="90%" y2="90%">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="35%" stopColor="#4ade80" />
          <stop offset="75%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#14532d" />
        </linearGradient>

        {/* Caterpillar Segment 3D Shading (Cylindrical volume with deep crease shadows) */}
        <radialGradient id="catSegGrad" cx="35%" cy="28%" r="72%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="22%" stopColor="#ecfccb" />
          <stop offset="55%" stopColor="#84cc16" />
          <stop offset="82%" stopColor="#4d7c0f" />
          <stop offset="100%" stopColor="#1a2e05" />
        </radialGradient>

        {/* Caterpillar Head 3D Sphere Capsule */}
        <radialGradient id="catHeadGrad" cx="35%" cy="28%" r="70%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="25%" stopColor="#fef08a" />
          <stop offset="58%" stopColor="#eab308" />
          <stop offset="85%" stopColor="#a16207" />
          <stop offset="100%" stopColor="#451a03" />
        </radialGradient>

        {/* Chewed Bite Mark Oxidized Rim */}
        <linearGradient id="biteBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ca8a04" />
          <stop offset="50%" stopColor="#854d0e" />
          <stop offset="100%" stopColor="#451a03" />
        </linearGradient>
      </defs>

      {/* Cast shadow of branch */}
      <path d="M125,87 Q105,54 86,34 Q70,18 48,12" stroke="#14532d" strokeWidth="5.5" fill="none" opacity="0.25" />

      {/* Brown Twig Branch with Bark Striations */}
      <path d="M125,85 Q105,52 86,32 Q70,16 48,10" stroke="url(#barkGrad)" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M92,40 Q108,22 120,12" stroke="url(#barkGrad)" strokeWidth="4.2" fill="none" strokeLinecap="round" />

      {/* Bark highlights & lenticels texture */}
      <path d="M124,84 Q104,51 86,31" stroke="#fef08a" strokeWidth="0.9" fill="none" opacity="0.3" />
      <line x1="110" y1="60" x2="114" y2="62" stroke="#1c0a00" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="104" y1="52" x2="108" y2="54" stroke="#1c0a00" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="97" y1="44" x2="101" y2="46" stroke="#1c0a00" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="88" y1="34" x2="92" y2="36" stroke="#1c0a00" strokeWidth="1.4" strokeLinecap="round" />

      {/* Top Background Leaf */}
      <path d="M106,24 C122,12 134,2 128,26 C122,36 106,34 106,24 Z" fill="url(#caterpillarLeafGrad)" stroke="#15803d" strokeWidth="1.5" />
      <path d="M106,24 Q118,22 128,26" stroke="#14532d" strokeWidth="1" fill="none" opacity="0.7" />

      {/* Main Foreground Leaf with 3D Shading & Veins */}
      <path
        d="M84,36 C64,42 38,52 26,68 C20,82 36,92 64,86 C72,84 76,78 78,73 C76,68 80,64 82,60 C84,52 86,44 84,36 Z"
        fill="url(#caterpillarLeafGrad)"
        stroke="#15803d"
        strokeWidth="2"
      />
      {/* Vein lines on chewed leaf */}
      <path d="M82,40 Q55,60 30,75" stroke="#14532d" strokeWidth="1.8" fill="none" opacity="0.75" />
      <path d="M82,39 Q55,59 30,74" stroke="#86efac" strokeWidth="0.7" fill="none" opacity="0.6" />
      <path d="M60,55 Q50,70 42,78" stroke="#14532d" strokeWidth="1.2" fill="none" opacity="0.65" />
      <path d="M72,48 Q65,60 62,72" stroke="#14532d" strokeWidth="1.2" fill="none" opacity="0.65" />

      {/* Realistic Crescent Bite Marks on Leaf with Browned Oxidized Cell Rim */}
      {biteCount >= 1 && (
        <g>
          <circle cx="28" cy="65" r="8.5" fill="#ffffff" />
          <path d="M20,59 C26,64 26,69 20,74" stroke="url(#biteBorderGrad)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <circle cx="23" cy="66" r="0.8" fill="#713f12" opacity="0.7" />
        </g>
      )}
      {biteCount >= 2 && (
        <g>
          <circle cx="36" cy="76" r="9.5" fill="#ffffff" />
          <path d="M28,70 C34,75 34,81 28,85" stroke="url(#biteBorderGrad)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <circle cx="31" cy="78" r="0.8" fill="#713f12" opacity="0.7" />
        </g>
      )}
      {biteCount >= 3 && (
        <g>
          <circle cx="48" cy="84" r="9" fill="#ffffff" />
          <path d="M40,78 C46,83 46,89 40,93" stroke="url(#biteBorderGrad)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <circle cx="43" cy="86" r="0.8" fill="#713f12" opacity="0.7" />
        </g>
      )}

      {/* Caterpillar Body (Volumetric Cylindrical Shading, Crease Shadows, & Spiracles) */}
      <g
        className={`${isCrawling ? styles.caterpillarCrawling : ''} ${isChewing ? styles.caterpillarChewing : ''}`}
        style={{ transformOrigin: '55px 45px' }}
      >
        {/* Continuous Dorsal Spine Highlight Curve */}
        <path d="M102,26 Q75,34 46,57" stroke="#ffffff" strokeWidth="1.2" fill="none" opacity="0.4" strokeLinecap="round" />

        {/* Segment 6 (Anal Plate / Tail) */}
        <g>
          <circle cx="102" cy="28" r="7" fill="url(#catSegGrad)" stroke="#1a2e05" strokeWidth="1.2" />
          <circle cx="100.2" cy="25.8" r="1.2" fill="#ffffff" opacity="0.85" />
          {/* Velvety Black Spot & Orange Breathing Spiracle */}
          <circle cx="98.5" cy="28" r="1.4" fill="#18181b" />
          <circle cx="103" cy="29" r="0.9" fill="#ea580c" stroke="#18181b" strokeWidth="0.4" />
        </g>

        {/* Segment 5 */}
        <g>
          <circle cx="92" cy="31" r="7.8" fill="url(#catSegGrad)" stroke="#1a2e05" strokeWidth="1.2" />
          <circle cx="90" cy="28.5" r="1.3" fill="#ffffff" opacity="0.85" />
          <circle cx="88.5" cy="31" r="1.5" fill="#18181b" />
          <circle cx="93.5" cy="32" r="0.9" fill="#ea580c" stroke="#18181b" strokeWidth="0.4" />
        </g>

        {/* Segment 4 */}
        <g>
          <circle cx="81" cy="36" r="8.5" fill="url(#catSegGrad)" stroke="#1a2e05" strokeWidth="1.2" />
          <circle cx="78.5" cy="33.2" r="1.4" fill="#ffffff" opacity="0.85" />
          <circle cx="77.5" cy="36" r="1.6" fill="#18181b" />
          <circle cx="82.8" cy="37.5" r="1" fill="#ea580c" stroke="#18181b" strokeWidth="0.4" />
        </g>

        {/* Segment 3 */}
        <g>
          <circle cx="70" cy="43" r="9.2" fill="url(#catSegGrad)" stroke="#1a2e05" strokeWidth="1.2" />
          <circle cx="67.2" cy="39.8" r="1.5" fill="#ffffff" opacity="0.85" />
          <circle cx="66.5" cy="43" r="1.7" fill="#18181b" />
          <circle cx="71.8" cy="44.5" r="1" fill="#ea580c" stroke="#18181b" strokeWidth="0.4" />
        </g>

        {/* Segment 2 */}
        <g>
          <circle cx="58" cy="51" r="9.8" fill="url(#catSegGrad)" stroke="#1a2e05" strokeWidth="1.2" />
          <circle cx="55" cy="47.5" r="1.6" fill="#ffffff" opacity="0.85" />
          <circle cx="54.5" cy="51" r="1.8" fill="#18181b" />
          <circle cx="59.8" cy="53" r="1.1" fill="#ea580c" stroke="#18181b" strokeWidth="0.4" />
        </g>

        {/* Segment 1 */}
        <g>
          <circle cx="46" cy="60" r="10.4" fill="url(#catSegGrad)" stroke="#1a2e05" strokeWidth="1.2" />
          <circle cx="42.8" cy="56.2" r="1.7" fill="#ffffff" opacity="0.85" />
          <circle cx="42.5" cy="60" r="1.9" fill="#18181b" />
          <circle cx="47.8" cy="62" r="1.1" fill="#ea580c" stroke="#18181b" strokeWidth="0.4" />
        </g>

        {/* Head Capsule with Epicranial Chitin Shading & Eye Catchlight */}
        <circle cx="35" cy="70" r="11.2" fill="url(#catHeadGrad)" stroke="#451a03" strokeWidth="1.8" />
        {/* Chitin highlight reflection */}
        <ellipse cx="31.5" cy="65.5" rx="5" ry="2.8" fill="#ffffff" opacity="0.55" transform="rotate(-30 31.5 65.5)" />
        {/* Epicranial Y-Suture */}
        <path d="M35,61 L35,66 M35,66 L31,70 M35,66 L39,70" stroke="#713f12" strokeWidth="0.9" fill="none" strokeLinecap="round" opacity="0.6" />
        
        {/* Shiny Black Stemmata (Eyes) with Specular Catchlights */}
        <circle cx="31" cy="67.5" r="2.9" fill="#18181b" />
        <circle cx="30" cy="66.2" r="1.1" fill="#ffffff" />
        <circle cx="32.5" cy="68.8" r="0.5" fill="#ffffff" opacity="0.6" />
        
        {/* Chewing Mandibles */}
        <path
          d={isChewing ? 'M27,77 Q34,70 41,77' : 'M28,76 Q34,80 40,75'}
          stroke="#451a03"
          strokeWidth="2.6"
          fill="none"
          strokeLinecap="round"
        />

        {/* Jointed Thoracic True Legs gripping the branch */}
        <path d="M82,43 L85,49" stroke="#451a03" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M71,51 L74,57" stroke="#451a03" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M59,60 L62,66" stroke="#451a03" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M47,69 L50,76" stroke="#451a03" strokeWidth="2.5" strokeLinecap="round" />
        {/* Leg tip claw points */}
        <circle cx="85" cy="49" r="1" fill="#b45309" />
        <circle cx="74" cy="57" r="1" fill="#b45309" />
        <circle cx="62" cy="66" r="1" fill="#b45309" />
        <circle cx="50" cy="76" r="1" fill="#b45309" />
      </g>
    </svg>
  );
}

// 3. KEPOMPONG BERGANTUNG DI DAHAN (Hanging Chrysalis - Translucent Jade Shell, Metallic Gold Studs & Silk Cremaster)
function AnimatedChrysalis({ isSwaying = true, isGlowing = false }) {
  return (
    <svg viewBox="0 0 130 105" width="130" height="104" style={{ overflow: 'visible' }}>
      <defs>
        {/* Chrysalis Translucent Jade Depth Gradient */}
        <linearGradient id="chrysalisBodyGrad" x1="15%" y1="10%" x2="85%" y2="90%">
          <stop offset="0%" stopColor="#fef9c3" />
          <stop offset="20%" stopColor="#d9f99d" />
          <stop offset="50%" stopColor="#86efac" />
          <stop offset="80%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#14532d" />
        </linearGradient>

        {/* Glowing Chrysalis Golden Metamorphosis Gradient */}
        <linearGradient id="chrysalisGlowingGrad" x1="10%" y1="10%" x2="90%" y2="90%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="25%" stopColor="#fef08a" />
          <stop offset="65%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>

        {/* Iconic Metallic Mirror Gold Stud Radial Reflection */}
        <radialGradient id="goldStudGrad" cx="30%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#fef08a" />
          <stop offset="65%" stopColor="#facc15" />
          <stop offset="88%" stopColor="#ca8a04" />
          <stop offset="100%" stopColor="#713f12" />
        </radialGradient>

        {/* Branch Gradient */}
        <linearGradient id="chrysalisBranchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#b45309" />
          <stop offset="45%" stopColor="#78350f" />
          <stop offset="100%" stopColor="#290e02" />
        </linearGradient>

        {/* Spun Silk Filament Gradient */}
        <linearGradient id="silkPadGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
      </defs>

      {/* Twig Branch with Bark Depth */}
      <path d="M15,22 Q60,26 115,42" stroke="url(#chrysalisBranchGrad)" strokeWidth="5.5" fill="none" strokeLinecap="round" />
      <path d="M15,21 Q60,25 115,41" stroke="#fef08a" strokeWidth="0.9" fill="none" strokeLinecap="round" opacity="0.3" />
      
      {/* Botanical leaves on branch */}
      <path d="M38,25 C32,5 54,-6 72,12 C78,20 62,29 38,25 Z" fill="#22c55e" stroke="#15803d" strokeWidth="1.8" />
      <path d="M38,25 Q56,12 72,12" stroke="#15803d" strokeWidth="1.2" fill="none" />
      <path d="M88,34 C98,20 120,30 114,52 C104,62 88,52 88,34 Z" fill="#22c55e" stroke="#15803d" strokeWidth="1.8" />
      <path d="M88,34 Q104,36 114,52" stroke="#15803d" strokeWidth="1.2" fill="none" />

      {/* Spun Silk Cremaster Anchor Pad (Spun silk fibers) */}
      <ellipse cx="66" cy="26" rx="6.5" ry="3.5" fill="url(#silkPadGrad)" stroke="#94a3b8" strokeWidth="0.9" />
      {/* Individual silk anchor filaments */}
      <path d="M62,26 L64,29 M65,26 L66,30 M68,26 L67,29 M70,26 L68,30" stroke="#ffffff" strokeWidth="0.8" opacity="0.8" />
      {/* Chitinous Cremaster Hook Shaft */}
      <path d="M66,28 L66,36" stroke="#1e293b" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M65.5,28 L65.5,36" stroke="#ffffff" strokeWidth="0.6" strokeLinecap="round" opacity="0.4" />

      {/* Hanging Chrysalis with Sway animation */}
      <g className={`${isSwaying ? styles.chrysalisSway : ''} ${isGlowing ? styles.chrysalisGlowing : ''}`}>
        {/* Soft Ambient Metamorphosis Glow */}
        {isGlowing && (
          <ellipse cx="66" cy="65" rx="22" ry="36" fill="#facc15" opacity="0.4" filter="blur(8px)" />
        )}

        {/* 3D Chrysalis Cuticle Shell */}
        <path
          d="M63,35 C58,42 49,56 51,74 C53,85 60,96 66,98 C72,96 79,85 80,74 C82,56 74,42 69,35 Z"
          fill={isGlowing ? 'url(#chrysalisGlowingGrad)' : 'url(#chrysalisBodyGrad)'}
          stroke={isGlowing ? '#ca8a04' : '#14532d'}
          strokeWidth="2.2"
        />

        {/* Glossy Specular Highlight Streak on Shell curvature */}
        <path
          d="M55,48 C53,60 55,75 58,82 C56,75 54,62 56,50 Z"
          fill="#ffffff"
          opacity="0.6"
        />

        {/* Folded Wing Pad Outlines inside Chrysalis (Translucent Pterotheca) */}
        <path
          d="M60,45 C55,56 57,70 64,76 C61,66 61,53 64,46 Z"
          fill="#14532d"
          opacity="0.25"
        />
        {/* Subtle silhouette of developing wing veins inside */}
        <path d="M58,54 Q61,64 64,72" stroke="#14532d" strokeWidth="0.9" fill="none" opacity="0.3" />

        {/* Sculpted Abdominal Segments with Beveled Shadow + Highlight */}
        <path d="M57,50 Q66,55 75,50" stroke="#14532d" strokeWidth="1.8" fill="none" opacity="0.65" />
        <path d="M57,51 Q66,56 75,51" stroke="#ffffff" strokeWidth="0.9" fill="none" opacity="0.75" />

        <path d="M54,61 Q66,66 78,61" stroke="#14532d" strokeWidth="1.8" fill="none" opacity="0.65" />
        <path d="M54,62 Q66,67 78,62" stroke="#ffffff" strokeWidth="0.9" fill="none" opacity="0.75" />

        <path d="M54,72 Q66,78 78,72" stroke="#14532d" strokeWidth="1.8" fill="none" opacity="0.65" />
        <path d="M54,73 Q66,79 78,73" stroke="#ffffff" strokeWidth="0.9" fill="none" opacity="0.75" />

        <path d="M56,83 Q66,88 76,83" stroke="#14532d" strokeWidth="1.8" fill="none" opacity="0.65" />
        <path d="M56,84 Q66,89 76,84" stroke="#ffffff" strokeWidth="0.9" fill="none" opacity="0.75" />

        {/* Iconic Metallic Gold Mirror Studs with Radiant Catchlights */}
        <g>
          {/* Stud 1 */}
          <circle cx="58" cy="50" r="2" fill="url(#goldStudGrad)" stroke="#713f12" strokeWidth="0.6" />
          <circle cx="57.3" cy="49.3" r="0.7" fill="#ffffff" />

          {/* Stud 2 (Center) */}
          <circle cx="66" cy="54" r="2.4" fill="url(#goldStudGrad)" stroke="#713f12" strokeWidth="0.6" />
          <circle cx="65.2" cy="53.2" r="0.9" fill="#ffffff" />

          {/* Stud 3 */}
          <circle cx="74" cy="50" r="2" fill="url(#goldStudGrad)" stroke="#713f12" strokeWidth="0.6" />
          <circle cx="73.3" cy="49.3" r="0.7" fill="#ffffff" />

          {/* Golden Pupa Apex Tip */}
          <circle cx="66" cy="94.5" r="2.4" fill="url(#goldStudGrad)" stroke="#713f12" strokeWidth="0.8" />
          <circle cx="65.3" cy="93.8" r="0.8" fill="#ffffff" />
        </g>

        {/* Lateral Spiracles (Breathing Pores) */}
        <circle cx="52.5" cy="66" r="0.8" fill="#14532d" />
        <circle cx="79.5" cy="66" r="0.8" fill="#14532d" />
      </g>
    </svg>
  );
}

// 4. KUPU-KUPU DENGAN SAYAP MENGEPAK (Butterfly - Realistic Layered Venation, Velvet Magenta-Gold Shading & Compound Eyes)
function AnimatedButterfly({ isFlappingFast = false, isFlying = false }) {
  return (
    <div className={`${styles.illustrationBox} ${isFlying ? styles.butterflyFlying : ''}`}>
      <svg
        viewBox="0 0 150 120"
        width="152"
        height="122"
        className={`${styles.butterflySvg} ${isFlappingFast ? styles.fastFlap : ''}`}
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Upper Forewing Velvety Gradient (Ruby/Magenta to Sunset Gold) */}
          <linearGradient id="forewingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9d174d" />
            <stop offset="30%" stopColor="#e11d48" />
            <stop offset="65%" stopColor="#f43f5e" />
            <stop offset="85%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#fde047" />
          </linearGradient>

          {/* Inner Wing Cell Luminous Sun Gold Glow */}
          <radialGradient id="innerWingGrad" cx="40%" cy="40%" r="68%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="30%" stopColor="#fef08a" />
            <stop offset="70%" stopColor="#facc15" />
            <stop offset="90%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#be123c" />
          </radialGradient>

          {/* Lower Hindwing Velvety Gradient */}
          <linearGradient id="hindwingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#831843" />
            <stop offset="35%" stopColor="#be185d" />
            <stop offset="70%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#fde047" />
          </linearGradient>

          {/* Forewing Drop Shadow onto Hindwing (Crucial 3D layered depth) */}
          <radialGradient id="wingUnderShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4c0519" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#4c0519" stopOpacity="0" />
          </radialGradient>

          {/* Butterfly Body 3D Velvety Gradient */}
          <linearGradient id="butterflyBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#25020c" />
            <stop offset="25%" stopColor="#881337" />
            <stop offset="50%" stopColor="#e11d48" />
            <stop offset="75%" stopColor="#881337" />
            <stop offset="100%" stopColor="#25020c" />
          </linearGradient>

          {/* Thorax 3D Furry Dome Gradient */}
          <radialGradient id="thoraxGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="45%" stopColor="#9f1239" />
            <stop offset="85%" stopColor="#4c0519" />
            <stop offset="100%" stopColor="#1f020a" />
          </radialGradient>

          {/* Compound Eye Chitin Gradient */}
          <radialGradient id="eyeChitinGrad" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#71717a" />
            <stop offset="35%" stopColor="#27272a" />
            <stop offset="100%" stopColor="#09090b" />
          </radialGradient>
        </defs>

        {/* LEFT WING (Anchored at x=70, y=52) */}
        <g transform="translate(70, 52)">
          <g className={styles.wingLeftWrapper}>
            {/* Lower Hindwing (Satin Pink & Gold) */}
            <path
              d="M 0,8 C -16,16 -40,18 -45,36 C -50,54 -28,68 -10,56 C -3,49 -1,30 0,8 Z"
              fill="url(#hindwingGrad)"
              stroke="#4c0519"
              strokeWidth="1.8"
            />
            {/* Lower Hindwing Inner Gold Cell */}
            <path
              d="M -2,10 C -14,16 -32,20 -36,33 C -40,47 -23,56 -9,47 C -4,42 -2,28 -2,10 Z"
              fill="url(#innerWingGrad)"
              stroke="#ca8a04"
              strokeWidth="1"
              opacity="0.95"
            />
            {/* Hindwing Venation */}
            <path d="M 0,10 C -12,22 -24,34 -30,46" stroke="#4c0519" strokeWidth="1.2" fill="none" opacity="0.6" />
            <path d="M -12,22 C -16,36 -18,48 -14,56" stroke="#4c0519" strokeWidth="1" fill="none" opacity="0.6" />

            {/* Submarginal Pearls along Hindwing border */}
            <circle cx="-40" cy="34" r="2.5" fill="#ffffff" stroke="#4c0519" strokeWidth="0.6" />
            <circle cx="-32" cy="50" r="2.5" fill="#ffffff" stroke="#4c0519" strokeWidth="0.6" />
            <circle cx="-16" cy="58" r="2.5" fill="#ffffff" stroke="#4c0519" strokeWidth="0.6" />

            {/* Cast Shadow under Forewing overlapping Hindwing */}
            <path
              d="M 0,4 C -12,14 -26,22 -38,24 C -22,25 -8,18 0,4 Z"
              fill="url(#wingUnderShadow)"
            />

            {/* Upper Forewing (Velvety Ruby/Magenta outer) */}
            <path
              d="M 0,0 C -16,-12 -46,-36 -62,-16 C -70,0 -54,26 -26,27 C -12,27 -3,16 0,0 Z"
              fill="url(#forewingGrad)"
              stroke="#4c0519"
              strokeWidth="2"
            />
            {/* Upper Forewing Inner Luminous Gold Cell */}
            <path
              d="M -3,-1 C -15,-10 -40,-29 -51,-14 C -57,0 -43,20 -24,21 C -12,21 -4,13 -3,-1 Z"
              fill="url(#innerWingGrad)"
              stroke="#ca8a04"
              strokeWidth="1.2"
              opacity="0.95"
            />

            {/* Anatomical Wing Veins (Medial & Radial venation) */}
            <path d="M 0,0 C -18,-6 -36,-18 -48,-16" stroke="#4c0519" strokeWidth="1.3" fill="none" opacity="0.7" />
            <path d="M -18,-6 C -32,-3 -46,2 -54,8" stroke="#4c0519" strokeWidth="1.1" fill="none" opacity="0.6" />
            <path d="M -16,4 C -28,10 -38,18 -40,24" stroke="#4c0519" strokeWidth="1.1" fill="none" opacity="0.6" />

            {/* Luminescent Pearls along Forewing border */}
            <circle cx="-54" cy="-18" r="2.5" fill="#ffffff" stroke="#4c0519" strokeWidth="0.6" />
            <circle cx="-60" cy="-4" r="2.5" fill="#ffffff" stroke="#4c0519" strokeWidth="0.6" />
            <circle cx="-56" cy="11" r="2.5" fill="#ffffff" stroke="#4c0519" strokeWidth="0.6" />
            <circle cx="-42" cy="23" r="2.5" fill="#ffffff" stroke="#4c0519" strokeWidth="0.6" />
            <circle cx="-28" cy="27" r="1.9" fill="#ffffff" stroke="#4c0519" strokeWidth="0.5" />
          </g>
        </g>

        {/* RIGHT WING (Anchored at x=70, y=52, exactly symmetrical) */}
        <g transform="translate(70, 52)">
          <g className={styles.wingRightWrapper}>
            {/* Lower Hindwing */}
            <path
              d="M 0,8 C 16,16 40,18 45,36 C 50,54 28,68 10,56 C 3,49 1,30 0,8 Z"
              fill="url(#hindwingGrad)"
              stroke="#4c0519"
              strokeWidth="1.8"
            />
            {/* Lower Hindwing Inner Gold Cell */}
            <path
              d="M 2,10 C 14,16 32,20 36,33 C 40,47 23,56 9,47 C 4,42 2,28 2,10 Z"
              fill="url(#innerWingGrad)"
              stroke="#ca8a04"
              strokeWidth="1"
              opacity="0.95"
            />
            {/* Hindwing Venation */}
            <path d="M 0,10 C 12,22 24,34 30,46" stroke="#4c0519" strokeWidth="1.2" fill="none" opacity="0.6" />
            <path d="M 12,22 C 16,36 18,48 14,56" stroke="#4c0519" strokeWidth="1" fill="none" opacity="0.6" />

            {/* Submarginal Pearls */}
            <circle cx="40" cy="34" r="2.5" fill="#ffffff" stroke="#4c0519" strokeWidth="0.6" />
            <circle cx="32" cy="50" r="2.5" fill="#ffffff" stroke="#4c0519" strokeWidth="0.6" />
            <circle cx="16" cy="58" r="2.5" fill="#ffffff" stroke="#4c0519" strokeWidth="0.6" />

            {/* Cast Shadow under Forewing overlapping Hindwing */}
            <path
              d="M 0,4 C 12,14 26,22 38,24 C 22,25 8,18 0,4 Z"
              fill="url(#wingUnderShadow)"
            />

            {/* Upper Forewing */}
            <path
              d="M 0,0 C 16,-12 46,-36 62,-16 C 70,0 54,26 26,27 C 12,27 3,16 0,0 Z"
              fill="url(#forewingGrad)"
              stroke="#4c0519"
              strokeWidth="2"
            />
            {/* Upper Forewing Inner Luminous Cell */}
            <path
              d="M 3,-1 C 15,-10 40,-29 51,-14 C 57,0 43,20 24,21 C 12,21 4,13 3,-1 Z"
              fill="url(#innerWingGrad)"
              stroke="#ca8a04"
              strokeWidth="1.2"
              opacity="0.95"
            />

            {/* Anatomical Wing Veins */}
            <path d="M 0,0 C 18,-6 36,-18 48,-16" stroke="#4c0519" strokeWidth="1.3" fill="none" opacity="0.7" />
            <path d="M 18,-6 C 32,-3 46,2 54,8" stroke="#4c0519" strokeWidth="1.1" fill="none" opacity="0.6" />
            <path d="M 16,4 C 28,10 38,18 40,24" stroke="#4c0519" strokeWidth="1.1" fill="none" opacity="0.6" />

            {/* Submarginal Pearls */}
            <circle cx="54" cy="-18" r="2.5" fill="#ffffff" stroke="#4c0519" strokeWidth="0.6" />
            <circle cx="60" cy="-4" r="2.5" fill="#ffffff" stroke="#4c0519" strokeWidth="0.6" />
            <circle cx="56" cy="11" r="2.5" fill="#ffffff" stroke="#4c0519" strokeWidth="0.6" />
            <circle cx="42" cy="23" r="2.5" fill="#ffffff" stroke="#4c0519" strokeWidth="0.6" />
            <circle cx="28" cy="27" r="1.9" fill="#ffffff" stroke="#4c0519" strokeWidth="0.5" />
          </g>
        </g>

        {/* BUTTERFLY BODY (Centered with 3D Velvety Shading & Compound Eyes) */}
        {/* Segmented Abdomen */}
        <ellipse cx="70" cy="71" rx="5.8" ry="19.5" fill="url(#butterflyBodyGrad)" stroke="#25020c" strokeWidth="1.6" />
        {/* Segment Ring Highlights */}
        <line x1="66" y1="62" x2="74" y2="62" stroke="#f43f5e" strokeWidth="1.1" opacity="0.7" />
        <line x1="65" y1="68" x2="75" y2="68" stroke="#f43f5e" strokeWidth="1.1" opacity="0.7" />
        <line x1="65.5" y1="74" x2="74.5" y2="74" stroke="#f43f5e" strokeWidth="1.1" opacity="0.7" />
        <line x1="66.5" y1="80" x2="73.5" y2="80" stroke="#f43f5e" strokeWidth="1.1" opacity="0.7" />
        <line x1="67.5" y1="85" x2="72.5" y2="85" stroke="#f43f5e" strokeWidth="1.1" opacity="0.7" />

        {/* Thorax with Velvety 3D Dome */}
        <ellipse cx="70" cy="49" rx="7.2" ry="8.8" fill="url(#thoraxGrad)" stroke="#25020c" strokeWidth="1.6" />
        <ellipse cx="69" cy="46.5" rx="3.8" ry="4.2" fill="#ffffff" opacity="0.3" />

        {/* Head */}
        <circle cx="70" cy="37" r="6.4" fill="url(#thoraxGrad)" stroke="#25020c" strokeWidth="1.6" />
        <circle cx="69" cy="35" r="2.2" fill="#ffffff" opacity="0.35" />
        
        {/* Glossy Compound Eyes with Dual Corneal Catchlights */}
        <circle cx="67" cy="36" r="2.5" fill="url(#eyeChitinGrad)" stroke="#18181b" strokeWidth="0.5" />
        <circle cx="66.2" cy="35.2" r="0.9" fill="#ffffff" />
        <circle cx="67.8" cy="36.8" r="0.4" fill="#ffffff" opacity="0.7" />

        <circle cx="73" cy="36" r="2.5" fill="url(#eyeChitinGrad)" stroke="#18181b" strokeWidth="0.5" />
        <circle cx="72.2" cy="35.2" r="0.9" fill="#ffffff" />
        <circle cx="73.8" cy="36.8" r="0.4" fill="#ffffff" opacity="0.7" />

        {/* Antennae with Smooth Curvature and Clubbed Tips */}
        <path d="M68,32 Q56,14 45,11" stroke="#25020c" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <circle cx="44.5" cy="11" r="2.8" fill="#be123c" stroke="#25020c" strokeWidth="0.9" />
        <circle cx="43.6" cy="10.2" r="0.9" fill="#ffffff" />

        <path d="M72,32 Q84,14 95,11" stroke="#25020c" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <circle cx="95.5" cy="11" r="2.8" fill="#be123c" stroke="#25020c" strokeWidth="0.9" />
        <circle cx="94.6" cy="10.2" r="0.9" fill="#ffffff" />
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MAIN GAME CONTROLLER
// ---------------------------------------------------------------------------

export default function ButterflyMetamorphosis({ onGameComplete = null, questId: propQuestId }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetQuestId = propQuestId || searchParams.get('questId') || 'quest-hs-2';
  const { completeQuest } = useGame();
  const { playSfx } = useAudio();

  // Game progression stage: 'telur' | 'ulat' | 'kepompong' | 'kupukupu' | 'completed'
  const [gameStage, setGameStage] = useState('telur');
  // Current active stage step progress (0 to 3)
  const [stageProgress, setStageProgress] = useState(0);
  // Unlocked phases array (for diagram visual locks)
  const [unlockedPhases, setUnlockedPhases] = useState(['telur']);
  // Completed phases array
  const [completedPhases, setCompletedPhases] = useState([]);
  
  const [score, setScore] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [showVictory, setShowVictory] = useState(false);

  // Individual Creature Animation & Interaction States
  const [eggHatched, setEggHatched] = useState(false);
  const [eggWiggling, setEggWiggling] = useState(false);
  
  const [caterpillarCrawling, setCaterpillarCrawling] = useState(false);
  const [caterpillarChewing, setCaterpillarChewing] = useState(false);
  const [biteCount, setBiteCount] = useState(0);

  const [chrysalisGlowing, setChrysalisGlowing] = useState(false);

  const [butterflyFlappingFast, setButterflyFlappingFast] = useState(false);
  const [butterflyFlying, setButterflyFlying] = useState(false);

  // Dynamic guidance / narration text
  const [bubbleText, setBubbleText] = useState('Ketuk telur di daun 3x untuk menetaskannya!');

  // Safe sound trigger
  function triggerSound(sfxName) {
    if (playSfx) {
      try { playSfx(sfxName); } catch (e) { /* ignore */ }
    }
  }

  // Stage configuration metadata
  const STAGE_CONFIG = {
    telur: {
      order: 1,
      name: 'Telur',
      icon: '🥚',
      badge: 'Tahap 1/4: Telur di Daun',
      prompt: 'Hangatkan telur 3x agar larva ulat kecil menetas keluar!',
      actionLabel: 'Hangatkan Telur',
      actionIcon: '🥚',
      target: 3,
    },
    ulat: {
      order: 2,
      name: 'Ulat',
      icon: '🐛',
      badge: 'Tahap 2/4: Ulat Makan Daun',
      prompt: 'Ulat lapar butuh banyak energi! Beri makan 3 gigitan daun.',
      actionLabel: 'Beri Makan Daun',
      actionIcon: '🍃',
      target: 3,
    },
    kepompong: {
      order: 3,
      name: 'Kepompong',
      icon: '🥥',
      badge: 'Tahap 3/4: Kepompong Ajaib',
      prompt: 'Ulat bermetamorfosis! Sinari kepompong 3x dengan hangat mentari.',
      actionLabel: 'Sinari Kepompong',
      actionIcon: '☀️',
      target: 3,
    },
    kupukupu: {
      order: 4,
      name: 'Kupu-Kupu',
      icon: '🦋',
      badge: 'Tahap 4/4: Kupu-Kupu Dewasa',
      prompt: 'Kupu-kupu cantik telah lahir! Kepakkan sayap 3x untuk terbang bebas.',
      actionLabel: 'Kepakkan Sayap',
      actionIcon: '🦋',
      target: 3,
    },
    completed: {
      order: 5,
      name: 'Selesai',
      icon: '🏆',
      badge: 'Siklus Sempurna Lengkap! 🎉',
      prompt: 'Hebat! Kupu-kupu dewasa kini siap bertelur kembali melanjutkan daur hidup.',
      actionLabel: 'Putar Siklus Penuh',
      actionIcon: '🔄',
      target: 3,
    }
  };

  const currentStageInfo = STAGE_CONFIG[gameStage] || STAGE_CONFIG.telur;

  // -------------------------------------------------------------------------
  // CORE PROGRESSION HANDLER: ADVANCES CURRENT STAGE STEP BY STEP
  // -------------------------------------------------------------------------
  function handleAdvanceCurrentStage() {
    if (gameStage === 'telur') {
      const next = stageProgress + 1;
      if (next === 1) {
        triggerSound('button-click');
        setEggWiggling(true);
        setStageProgress(1);
        setScore((s) => s + 10);
        setBubbleText('Krek... Telur mulai berdenyut hangat! (1/3) ✨');
      } else if (next === 2) {
        triggerSound('hint');
        setEggWiggling(true);
        setStageProgress(2);
        setScore((s) => s + 10);
        setBubbleText('Krek krek! Cangkang telur mulai retak! (2/3) ⚡');
      } else if (next >= 3) {
        triggerSound('correct');
        setEggHatched(true);
        setEggWiggling(false);
        setStageProgress(3);
        setScore((s) => s + 20);
        setCompletedPhases((prev) => Array.from(new Set([...prev, 'telur'])));
        setBubbleText('Hore! Ulat mungil berhasil keluar dari telur! 🐛');

        setTimeout(() => {
          setUnlockedPhases((prev) => Array.from(new Set([...prev, 'ulat'])));
          setGameStage('ulat');
          setStageProgress(0);
          setBubbleText('Tahap 2 Terbuka! Beri makan ulat daun segar! 🍃');
        }, 1300);
      }
    } else if (gameStage === 'ulat') {
      const next = stageProgress + 1;
      if (next === 1) {
        triggerSound('button-click');
        setCaterpillarCrawling(true);
        setCaterpillarChewing(true);
        setBiteCount(1);
        setStageProgress(1);
        setScore((s) => s + 10);
        setBubbleText('Kriuk! Gigitan daun pertama yang lezat! (1/3) 🍃');
        setTimeout(() => {
          setCaterpillarCrawling(false);
          setCaterpillarChewing(false);
        }, 700);
      } else if (next === 2) {
        triggerSound('button-click');
        setCaterpillarCrawling(true);
        setCaterpillarChewing(true);
        setBiteCount(2);
        setStageProgress(2);
        setScore((s) => s + 10);
        setBubbleText('Nyam nyam! Ulat makan lahap dan semakin gemuk! (2/3) 🐛');
        setTimeout(() => {
          setCaterpillarCrawling(false);
          setCaterpillarChewing(false);
        }, 700);
      } else if (next >= 3) {
        triggerSound('correct');
        setCaterpillarCrawling(false);
        setCaterpillarChewing(false);
        setBiteCount(3);
        setStageProgress(3);
        setScore((s) => s + 20);
        setCompletedPhases((prev) => Array.from(new Set([...prev, 'ulat'])));
        setBubbleText('Ulat kenyang dan siap membuat kepompong sutra! 🥥');

        setTimeout(() => {
          setUnlockedPhases((prev) => Array.from(new Set([...prev, 'kepompong'])));
          setGameStage('kepompong');
          setStageProgress(0);
          setBubbleText('Tahap 3 Terbuka! Sinari kepompong dengan hangat mentari! ☀️');
        }, 1300);
      }
    } else if (gameStage === 'kepompong') {
      const next = stageProgress + 1;
      if (next === 1) {
        triggerSound('button-click');
        setStageProgress(1);
        setScore((s) => s + 10);
        setBubbleText('Ssst... Di dalam kepompong ulat membungkus diri dengan sutra! (1/3) 🥥');
      } else if (next === 2) {
        triggerSound('hint');
        setStageProgress(2);
        setScore((s) => s + 10);
        setBubbleText('Perubahan ajaib terjadi! Bentuk sayap mulai berkembang! (2/3) ✨');
      } else if (next >= 3) {
        triggerSound('level-up');
        setChrysalisGlowing(true);
        setStageProgress(3);
        setScore((s) => s + 25);
        setCompletedPhases((prev) => Array.from(new Set([...prev, 'kepompong'])));
        setBubbleText('Kepompong bersinar emas! Sayap kupu-kupu siap keluar! 🌟');

        setTimeout(() => {
          setUnlockedPhases((prev) => Array.from(new Set([...prev, 'kupukupu'])));
          setGameStage('kupukupu');
          setStageProgress(0);
          setBubbleText('Tahap 4 Terbuka! Kepakkan sayap kupu-kupu yang baru lahir! 🦋');
        }, 1500);
      }
    } else if (gameStage === 'kupukupu') {
      const next = stageProgress + 1;
      if (next === 1) {
        triggerSound('button-click');
        setButterflyFlappingFast(true);
        setStageProgress(1);
        setScore((s) => s + 10);
        setBubbleText('Kepak kepak! Sayap merekah penuh warna indah! (1/3) 🦋');
        setTimeout(() => setButterflyFlappingFast(false), 900);
      } else if (next === 2) {
        triggerSound('button-click');
        setButterflyFlappingFast(true);
        setStageProgress(2);
        setScore((s) => s + 15);
        setBubbleText('Sayap mengepak kencang! Otot semakin kuat untuk terbang! (2/3) 💨');
        setTimeout(() => setButterflyFlappingFast(false), 900);
      } else if (next >= 3) {
        triggerSound('pet-unlock');
        setButterflyFlying(true);
        setButterflyFlappingFast(true);
        setStageProgress(3);
        setScore((s) => s + 35);
        setCompletedPhases((prev) => Array.from(new Set([...prev, 'kupukupu'])));
        setBubbleText('Luar biasa! Kupu-kupu terbang bebas menghisap nektar bunga! 🌸');

        setTimeout(() => {
          setGameStage('completed');
          triggerSound('quest-complete');
          setBubbleText('🏆 Siklus Metamorfosis Sempurna Lengkap! Klik tombol Selesai Misi untuk ambil hadiah!');
        }, 2000);
      }
    } else if (gameStage === 'completed') {
      handleAutoPlayCycle();
    }
  }

  // Direct creature tap on the circular diagram
  function handleCreatureClick(phaseKey) {
    if (!unlockedPhases.includes(phaseKey)) {
      triggerSound('wrong');
      setBubbleText(`Selesaikan tahap sebelumnya terlebih dahulu untuk membuka ${phaseKey}! 🔒`);
      return;
    }

    // If clicking current active stage, advance it!
    if (phaseKey === gameStage) {
      handleAdvanceCurrentStage();
      return;
    }

    // If clicking an already completed creature, replay its fun animation!
    triggerSound('button-click');
    if (phaseKey === 'telur') {
      setEggWiggling(true);
      setBubbleText('Krek krek! Ulat mungil tersenyum melambaikan tangan! 🐛');
      setTimeout(() => setEggWiggling(false), 800);
    } else if (phaseKey === 'ulat') {
      setCaterpillarCrawling(true);
      setCaterpillarChewing(true);
      setBubbleText('Kriuk nyam! Ulat gemuk sangat suka makan daun! 🍃');
      setTimeout(() => {
        setCaterpillarCrawling(false);
        setCaterpillarChewing(false);
      }, 900);
    } else if (phaseKey === 'kepompong') {
      setChrysalisGlowing(true);
      setBubbleText('Kepompong berayun dan berpendar kilau keemasan! ✨');
      setTimeout(() => setChrysalisGlowing(false), 1200);
    } else if (phaseKey === 'kupukupu') {
      setButterflyFlappingFast(true);
      setButterflyFlying(true);
      setBubbleText('Kepak kepak! Kupu-kupu terbang melayang dengan anggun! 🦋');
      setTimeout(() => {
        setButterflyFlappingFast(false);
        setButterflyFlying(false);
      }, 1600);
    }
  }

  // -------------------------------------------------------------------------
  // AUTO PLAY FULL CYCLE ANIMATION
  // -------------------------------------------------------------------------
  function handleAutoPlayCycle() {
    if (isAutoPlaying) return;
    setIsAutoPlaying(true);
    triggerSound('button-click');

    // Telur
    setBubbleText('1. Telur: Menempel di daun dan bersiap menetas!');
    setEggWiggling(true);

    // Ulat
    setTimeout(() => {
      setEggWiggling(false);
      setBubbleText('2. Ulat: Lahir dari telur dan rakus memakan daun segar!');
      setCaterpillarCrawling(true);
      setCaterpillarChewing(true);
      triggerSound('button-click');
    }, 2200);

    // Kepompong
    setTimeout(() => {
      setCaterpillarCrawling(false);
      setCaterpillarChewing(false);
      setBubbleText('3. Kepompong: Membungkus diri dengan sutra & bertransformasi total!');
      setChrysalisGlowing(true);
      triggerSound('level-up');
    }, 4500);

    // Kupu-kupu
    setTimeout(() => {
      setChrysalisGlowing(false);
      setBubbleText('4. Kupu-kupu: Keluar bersayap indah dan terbang bebas!');
      setButterflyFlappingFast(true);
      setButterflyFlying(true);
      triggerSound('pet-unlock');
    }, 6800);

    // Complete cycle
    setTimeout(() => {
      setButterflyFlappingFast(false);
      setButterflyFlying(false);
      setIsAutoPlaying(false);
      setBubbleText('Daur hidup berlanjut: Kupu-kupu bertelur kembali di daun! 🔄');
      triggerSound('quest-complete');
    }, 9400);
  }

  // Reset Game Progression
  function handleResetGame() {
    triggerSound('button-click');
    setGameStage('telur');
    setStageProgress(0);
    setUnlockedPhases(['telur']);
    setCompletedPhases([]);
    setScore(0);
    setEggHatched(false);
    setEggWiggling(false);
    setCaterpillarCrawling(false);
    setCaterpillarChewing(false);
    setBiteCount(0);
    setChrysalisGlowing(false);
    setButterflyFlappingFast(false);
    setButterflyFlying(false);
    setBubbleText('Misi diulang! Ketuk telur 3x untuk menetaskannya.');
  }

  // Finish Quest & Claim Rewards
  function handleFinish() {
    if (gameStage !== 'completed') {
      triggerSound('wrong');
      setBubbleText('Selesaikan seluruh 4 tahap metamorfosis untuk membuka hadiah! 🔒');
      return;
    }
    triggerSound('quest-complete');
    const finalScore = score + 140;
    setScore(finalScore);
    completeQuest(targetQuestId, finalScore, 140, 45, 'card-butterfly');
    setShowVictory(true);
  }

  function handleNavigateNext() {
    triggerSound('button-click');
    if (onGameComplete) {
      onGameComplete();
    } else {
      navigate(`/quest/${targetQuestId}/result`);
    }
  }

  const isStageDone = (phase) => completedPhases.includes(phase);
  const isStageActive = (phase) => gameStage === phase;
  const isStageUnlocked = (phase) => unlockedPhases.includes(phase);

  return (
    <div className={styles.gameContainer}>
      {/* 1. TOP BAR */}
      <header className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <div className={styles.badgeIcon}>🦋</div>
          <div className={styles.titleGroup}>
            <span className={styles.tagline}>Planet Hutan Sains • Misi 02</span>
            <h1 className={styles.mainTitle}>Siklus Metamorfosis Kupu-Kupu</h1>
          </div>
        </div>

        <div className={styles.topBarRight}>
          <div className={styles.scorePill}>
            <span>⭐</span>
            <span>{score} Poin</span>
          </div>
        </div>
      </header>

      {/* 2. UNIFIED CIRCULAR STAGE (FITS EXACT SCREEN SPACE) */}
      <section className={styles.circleStage}>
        {/* Clean, Spacious Mission Guidance Card (No Crowding / No Truncation) */}
        <div className={styles.missionCard}>
          <div className={styles.missionPrompt}>
            <span className={styles.missionPromptIcon}>🎯</span>
            <span>{bubbleText || currentStageInfo.prompt}</span>
          </div>

          {gameStage !== 'completed' ? (
            <button
              className={styles.missionActionBtn}
              onClick={handleAdvanceCurrentStage}
              title={currentStageInfo.prompt}
            >
              <span>{currentStageInfo.actionIcon}</span>
              <span>{currentStageInfo.actionLabel}</span>
              <span className={styles.progressChip}>
                {stageProgress}/{currentStageInfo.target}
              </span>
            </button>
          ) : (
            <button
              className={styles.missionActionBtn}
              onClick={handleAutoPlayCycle}
              disabled={isAutoPlaying}
              title="Putar daur hidup lengkap"
            >
              <span>{isAutoPlaying ? '⏳ Berputar...' : '▶ Putar Siklus'}</span>
            </button>
          )}
        </div>

        {/* The Circle Arena matching textbook diagram */}
        <div className={styles.circleArena}>
          {/* Orbit Guide */}
          <div className={styles.orbitGuideRing} />

          {/* Central Hub */}
          <div
            className={styles.centerHub}
            onClick={gameStage === 'completed' ? handleAutoPlayCycle : handleAdvanceCurrentStage}
            title={gameStage === 'completed' ? 'Klik untuk memutar animasi daur hidup' : 'Klik untuk memajukan tahap saat ini'}
          >
            <span className={styles.centerHubIcon}>
              {gameStage === 'completed' ? '🏆' : '🔄'}
            </span>
            <span className={styles.centerHubLabel}>
              {gameStage === 'completed' ? 'Siklus Lengkap!' : 'Metamorfosis Sempurna'}
            </span>
          </div>

          {/* Curved red arrows SVG (Clockwise cycle) */}
          <svg className={styles.arrowsSvg} viewBox="0 0 360 360">
            <defs>
              <marker
                id="redArrow"
                markerWidth="8"
                markerHeight="8"
                refX="6"
                refY="4"
                orient="auto"
              >
                <path d="M1,1 L7,4 L1,7 Z" fill="#dc2626" />
              </marker>
              <marker
                id="greenArrow"
                markerWidth="8"
                markerHeight="8"
                refX="6"
                refY="4"
                orient="auto"
              >
                <path d="M1,1 L7,4 L1,7 Z" fill="#16a34a" />
              </marker>
            </defs>

            {/* Arrow 1: Telur -> Ulat */}
            <path
              d="M225,65 C270,75 295,95 295,130"
              className={`${styles.arrowPath} ${isStageDone('telur') || isStageActive('telur') ? styles.arrowPathGlowing : ''}`}
              markerEnd={isStageDone('telur') || isStageActive('telur') ? 'url(#greenArrow)' : 'url(#redArrow)'}
            />

            {/* Arrow 2: Ulat -> Kepompong */}
            <path
              d="M295,225 C295,265 270,290 225,295"
              className={`${styles.arrowPath} ${isStageDone('ulat') || isStageActive('ulat') ? styles.arrowPathGlowing : ''}`}
              markerEnd={isStageDone('ulat') || isStageActive('ulat') ? 'url(#greenArrow)' : 'url(#redArrow)'}
            />

            {/* Arrow 3: Kepompong -> Kupu-kupu */}
            <path
              d="M135,295 C90,290 65,265 65,225"
              className={`${styles.arrowPath} ${isStageDone('kepompong') || isStageActive('kepompong') ? styles.arrowPathGlowing : ''}`}
              markerEnd={isStageDone('kepompong') || isStageActive('kepompong') ? 'url(#greenArrow)' : 'url(#redArrow)'}
            />

            {/* Arrow 4: Kupu-kupu -> Telur */}
            <path
              d="M65,130 C65,95 90,75 135,65"
              className={`${styles.arrowPath} ${isStageDone('kupukupu') || gameStage === 'completed' ? styles.arrowPathGlowing : ''}`}
              markerEnd={isStageDone('kupukupu') || gameStage === 'completed' ? 'url(#greenArrow)' : 'url(#redArrow)'}
            />
          </svg>

          {/* Node 1: TELUR (Top / 12 o'clock) */}
          <div
            role="button"
            tabIndex={0}
            className={`${styles.creatureNode} ${styles.nodeTelur} ${isStageActive('telur') ? styles.creatureNodeActive : ''}`}
            onClick={() => handleCreatureClick('telur')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCreatureClick('telur'); }}
            title="Tahap 1: Telur di Daun"
          >
            {isStageActive('telur') && <div className={styles.activeGlowRing} />}
            {isStageDone('telur') && <span className={styles.completedCheckBadge}>✓</span>}
            <div className={`${styles.pillBadge} ${styles.pillTelur}`}>
              <span>Telur</span>
            </div>
            <div className={styles.illustrationBox}>
              <AnimatedLeafEggs isHatched={eggHatched} isWiggling={eggWiggling} />
            </div>
          </div>

          {/* Node 2: ULAT (Right / 3 o'clock) */}
          <div
            role="button"
            tabIndex={0}
            className={`${styles.creatureNode} ${styles.nodeUlat} ${isStageActive('ulat') ? styles.creatureNodeActive : ''} ${!isStageUnlocked('ulat') ? styles.nodeLocked : ''}`}
            onClick={() => handleCreatureClick('ulat')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCreatureClick('ulat'); }}
            title={isStageUnlocked('ulat') ? 'Tahap 2: Ulat Makan Daun' : 'Terkunci: Selesaikan tahap telur'}
          >
            {isStageActive('ulat') && <div className={styles.activeGlowRing} />}
            {isStageDone('ulat') && <span className={styles.completedCheckBadge}>✓</span>}
            {!isStageUnlocked('ulat') && <span className={styles.lockBadge}>🔒</span>}
            <div className={`${styles.pillBadge} ${styles.pillUlat}`}>
              <span>Ulat</span>
            </div>
            <div className={styles.illustrationBox}>
              <AnimatedCaterpillarTwig
                isCrawling={caterpillarCrawling}
                isChewing={caterpillarChewing}
                biteCount={biteCount}
              />
            </div>
          </div>

          {/* Node 3: KEPOMPONG (Bottom / 6 o'clock) */}
          <div
            role="button"
            tabIndex={0}
            className={`${styles.creatureNode} ${styles.nodeKepompong} ${isStageActive('kepompong') ? styles.creatureNodeActive : ''} ${!isStageUnlocked('kepompong') ? styles.nodeLocked : ''}`}
            onClick={() => handleCreatureClick('kepompong')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCreatureClick('kepompong'); }}
            title={isStageUnlocked('kepompong') ? 'Tahap 3: Kepompong Pupa' : 'Terkunci: Selesaikan tahap ulat'}
          >
            {isStageActive('kepompong') && <div className={styles.activeGlowRing} />}
            {isStageDone('kepompong') && <span className={styles.completedCheckBadge}>✓</span>}
            {!isStageUnlocked('kepompong') && <span className={styles.lockBadge}>🔒</span>}
            <div className={`${styles.pillBadge} ${styles.pillKepompong}`}>
              <span>Kepompong</span>
            </div>
            <div className={styles.illustrationBox}>
              <AnimatedChrysalis isSwaying={true} isGlowing={chrysalisGlowing} />
            </div>
          </div>

          {/* Node 4: KUPU-KUPU (Left / 9 o'clock) */}
          <div
            role="button"
            tabIndex={0}
            className={`${styles.creatureNode} ${styles.nodeKupukupu} ${isStageActive('kupukupu') ? styles.creatureNodeActive : ''} ${!isStageUnlocked('kupukupu') ? styles.nodeLocked : ''}`}
            onClick={() => handleCreatureClick('kupukupu')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCreatureClick('kupukupu'); }}
            title={isStageUnlocked('kupukupu') ? 'Tahap 4: Kupu-Kupu Dewasa' : 'Terkunci: Selesaikan tahap kepompong'}
          >
            {isStageActive('kupukupu') && <div className={styles.activeGlowRing} />}
            {isStageDone('kupukupu') && <span className={styles.completedCheckBadge}>✓</span>}
            {!isStageUnlocked('kupukupu') && <span className={styles.lockBadge}>🔒</span>}
            <div className={`${styles.pillBadge} ${styles.pillKupukupu}`}>
              <span>Kupu-kupu</span>
            </div>
            <AnimatedButterfly
              isFlappingFast={butterflyFlappingFast}
              isFlying={butterflyFlying}
            />
          </div>
        </div>
      </section>

      {/* 3. CLEAN BOTTOM DOCK */}
      <footer className={styles.bottomDock}>
        <button
          className={styles.chipBtn}
          onClick={handleResetGame}
          title="Ulangi petualangan dari tahap 1"
        >
          <span>🔄</span>
          <span>Ulangi Misi</span>
        </button>

        <button
          className={`${styles.finishBtn} ${gameStage !== 'completed' ? styles.finishBtnDisabled : styles.finishBtnUnlocked}`}
          onClick={gameStage === 'completed' ? handleFinish : undefined}
          title={gameStage === 'completed' ? 'Klaim hadiah misi!' : 'Selesaikan seluruh 4 tahap untuk membuka hadiah'}
        >
          {gameStage === 'completed' ? (
            <span>Klaim Hadiah 🏆</span>
          ) : (
            <span>🔒 Tahap {completedPhases.length}/4 Selesai</span>
          )}
        </button>
      </footer>

      {/* 4. VICTORY OVERLAY */}
      {showVictory && (
        <div className={styles.victoryOverlay}>
          <div className={styles.victoryCard}>
            <div className={styles.victoryIconWrapper}>🦋</div>
            <h2 className={styles.victoryTitle}>Siklus Berhasil Dikuasai!</h2>
            <p className={styles.victorySubtitle}>
              Luar biasa! Kamu telah mengamati dan menggerakkan seluruh siklus hidup metamorfosis kupu-kupu: dari <strong>Telur</strong> ➔ <strong>Ulat</strong> ➔ <strong>Kepompong</strong> ➔ <strong>Kupu-kupu</strong>!
            </p>

            <div className={styles.rewardsRow}>
              <div className={styles.rewardBadge}>
                <span>⭐</span>
                <span>+140 XP</span>
              </div>
              <div className={styles.rewardBadge}>
                <span>🪙</span>
                <span>+45 Koin</span>
              </div>
            </div>

            <div className={styles.cardDropBadge}>
              <span className="material-symbols-outlined">style</span>
              <span>Kartu Koleksi: <strong>Kupu-Kupu Rimba Zamrud</strong></span>
            </div>

            <button className={styles.victoryActionBtn} onClick={handleNavigateNext}>
              Lanjutkan Petualangan Rimba 🚀
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

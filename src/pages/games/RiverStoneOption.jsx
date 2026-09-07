import React from 'react';
import styles from './NumberCatcher.module.css';

/**
 * 4 Unique Handcrafted 3D River Rock Variants
 * Each variant has realistic polygonal rock facets, craggy boundaries,
 * sunlit highlights, rock crevices/fissures, lush river moss,
 * and circular water ripples touching the river current.
 */
const stonePaths = [
  // Variant 0: Batu Granit Sungai (Craggy Granite River Boulder)
  {
    viewBox: '0 0 280 150',
    plateau: 'M 32,70 L 40,44 L 68,28 L 118,20 L 176,18 L 222,26 L 246,42 L 254,68 L 242,88 L 198,96 L 140,98 L 82,96 L 42,84 Z',
    cliff: 'M 32,70 L 22,100 C 26,124 72,138 140,138 C 208,138 254,124 258,100 L 254,68 L 242,88 L 198,96 L 140,98 L 82,96 L 42,84 Z',
    facets: [
      { d: 'M 32,70 L 22,100 L 72,122 L 82,96 Z', opacity: 0.7 },
      { d: 'M 82,96 L 72,122 L 140,138 L 140,98 Z', opacity: 0.4 },
      { d: 'M 140,98 L 140,138 L 212,124 L 198,96 Z', opacity: 0.5 },
      { d: 'M 198,96 L 212,124 L 258,100 L 254,68 Z', opacity: 0.8 },
    ],
    highlight: 'M 34,68 L 42,44 L 70,28 L 118,20 L 176,18 L 222,26',
    cracks: [
      'M 72,38 L 94,54 L 88,74',
      'M 190,32 L 180,50 L 194,68',
    ],
    moss: [
      { d: 'M 38,44 Q 56,36 64,48 Q 54,62 40,56 Z' },
      { d: 'M 218,52 Q 238,44 246,58 Q 234,70 222,62 Z' },
    ],
    ripple: { cx: 140, cy: 116, rx: 124, ry: 24 },
  },

  // Variant 1: Batu Lempeng Kali (Layered Flagstone Slab)
  {
    viewBox: '0 0 280 150',
    plateau: 'M 26,64 L 46,36 L 94,22 L 158,18 L 214,24 L 248,36 L 258,62 L 248,84 L 206,96 L 138,98 L 76,96 L 36,82 Z',
    cliff: 'M 26,64 L 18,94 C 22,120 70,136 138,136 C 206,136 254,120 258,94 L 258,62 L 248,84 L 206,96 L 138,98 L 76,96 L 36,82 Z',
    facets: [
      { d: 'M 26,64 L 18,94 L 66,118 L 76,96 Z', opacity: 0.75 },
      { d: 'M 76,96 L 66,118 L 138,136 L 138,98 Z', opacity: 0.4 },
      { d: 'M 138,98 L 138,136 L 214,120 L 206,96 Z', opacity: 0.5 },
      { d: 'M 206,96 L 214,120 L 258,94 L 258,62 Z', opacity: 0.8 },
    ],
    highlight: 'M 26,64 L 46,36 L 94,22 L 158,18 L 214,24 L 248,36',
    cracks: [
      'M 46,36 L 82,50 L 136,48 L 194,42 L 248,36',
      'M 98,54 L 108,76',
    ],
    moss: [
      { d: 'M 78,46 Q 96,40 106,52 Q 92,60 80,54 Z' },
      { d: 'M 160,42 Q 178,36 186,48 Q 172,56 162,50 Z' },
    ],
    ripple: { cx: 138, cy: 114, rx: 122, ry: 24 },
  },

  // Variant 2: Batu Andesit Kali (Weathered Volcanic Andesite Boulder)
  {
    viewBox: '0 0 280 150',
    plateau: 'M 36,68 L 32,42 L 72,24 L 132,16 L 192,18 L 236,28 L 252,50 L 246,74 L 234,90 L 186,98 L 134,100 L 80,94 L 44,82 Z',
    cliff: 'M 36,68 L 24,96 C 28,122 76,138 134,138 C 196,138 248,122 254,96 L 246,74 L 234,90 L 186,98 L 134,100 L 80,94 L 44,82 Z',
    facets: [
      { d: 'M 36,68 L 24,96 L 74,120 L 80,94 Z', opacity: 0.7 },
      { d: 'M 80,94 L 74,120 L 134,138 L 134,100 Z', opacity: 0.45 },
      { d: 'M 134,100 L 134,138 L 202,122 L 186,98 Z', opacity: 0.55 },
      { d: 'M 186,98 L 202,122 L 254,96 L 246,74 Z', opacity: 0.8 },
    ],
    highlight: 'M 36,68 L 32,42 L 72,24 L 132,16 L 192,18 L 236,28',
    cracks: [
      'M 124,20 L 118,44 L 136,64 L 130,92',
      'M 68,52 L 86,66',
    ],
    moss: [
      { d: 'M 184,20 Q 212,14 224,28 Q 214,40 190,32 Z' },
      { d: 'M 40,54 Q 58,48 64,62 Q 52,72 42,66 Z' },
    ],
    ripple: { cx: 134, cy: 115, rx: 124, ry: 24 },
  },

  // Variant 3: Batu Karang Purba (Ancient River Megalith)
  {
    viewBox: '0 0 280 150',
    plateau: 'M 30,66 L 48,34 L 88,20 L 144,16 L 200,20 L 240,32 L 256,64 L 242,88 L 196,98 L 140,100 L 84,98 L 38,84 Z',
    cliff: 'M 30,66 L 20,94 C 24,120 72,136 144,136 C 212,136 256,120 258,94 L 256,64 L 242,88 L 196,98 L 140,100 L 84,98 L 38,84 Z',
    facets: [
      { d: 'M 30,66 L 20,94 L 68,118 L 84,98 Z', opacity: 0.7 },
      { d: 'M 84,98 L 68,118 L 144,136 L 140,100 Z', opacity: 0.4 },
      { d: 'M 140,100 L 144,136 L 210,122 L 196,98 Z', opacity: 0.55 },
      { d: 'M 196,98 L 210,122 L 258,94 L 256,64 Z', opacity: 0.8 },
    ],
    highlight: 'M 30,66 L 48,34 L 88,20 L 144,16 L 200,20 L 240,32 L 256,64',
    cracks: [
      'M 56,42 L 86,30 L 140,24 L 194,30 L 230,40',
      'M 152,50 L 168,76',
    ],
    moss: [
      { d: 'M 34,62 Q 50,52 58,66 Q 46,76 36,70 Z' },
      { d: 'M 204,44 Q 224,36 232,50 Q 220,60 210,54 Z' },
    ],
    ripple: { cx: 140, cy: 115, rx: 122, ry: 24 },
  },
];

export default function RiverStoneOption({
  index,
  label,
  value,
  isCorrect,
  isWrong,
  disabled,
  onClick,
}) {
  const rock = stonePaths[index % stonePaths.length];

  // Palette definition depending on status
  let plateauGrad = {
    start: '#78716c',
    mid: '#57534e',
    end: '#44403c',
  };
  let cliffGrad = {
    start: '#44403c',
    end: '#1c1917',
  };
  let highlightColor = 'rgba(255, 255, 255, 0.45)';
  let crackColor = '#1c1917';
  let mossGrad = {
    start: '#4ade80',
    end: '#15803d',
  };

  if (isCorrect) {
    plateauGrad = { start: '#34d399', mid: '#059669', end: '#047857' };
    cliffGrad = { start: '#047857', end: '#064e3b' };
    highlightColor = '#a7f3d0';
    crackColor = '#064e3b';
    mossGrad = { start: '#a7f3d0', end: '#10b981' };
  } else if (isWrong) {
    plateauGrad = { start: '#f87171', mid: '#dc2626', end: '#991b1b' };
    cliffGrad = { start: '#991b1b', end: '#450a0a' };
    highlightColor = '#fca5a5';
    crackColor = '#450a0a';
  }

  const gradIdTop = `stone-plateau-grad-${index}`;
  const gradIdSide = `stone-cliff-grad-${index}`;
  const gradIdMoss = `stone-moss-grad-${index}`;

  let statusClassName = '';
  if (isCorrect) statusClassName = styles.stoneBtnCorrect;
  if (isWrong) statusClassName = styles.stoneBtnWrong;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${styles.realStoneOptionBtn} ${statusClassName} ${styles[`stoneFloatDelay${index % 4}`]}`}
      aria-label={`${label} dengan nilai ${value}`}
    >
      {/* 3D Realistic Handcrafted Vector Rock */}
      <svg
        viewBox={rock.viewBox}
        className={styles.stoneSvgGraphic}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id={gradIdTop} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={plateauGrad.start} />
            <stop offset="50%" stopColor={plateauGrad.mid} />
            <stop offset="100%" stopColor={plateauGrad.end} />
          </linearGradient>

          <linearGradient id={gradIdSide} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={cliffGrad.start} />
            <stop offset="100%" stopColor={cliffGrad.end} />
          </linearGradient>

          <linearGradient id={gradIdMoss} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={mossGrad.start} />
            <stop offset="100%" stopColor={mossGrad.end} />
          </linearGradient>
        </defs>

        {/* 1. Water Ripple Ring under the stone */}
        <ellipse
          cx={rock.ripple.cx}
          cy={rock.ripple.cy}
          rx={rock.ripple.rx}
          ry={rock.ripple.ry}
          fill="rgba(56, 189, 248, 0.15)"
          stroke="rgba(186, 230, 253, 0.45)"
          strokeWidth="2"
          strokeDasharray="8 6"
        />

        {/* 2. Submerged Riverbed Base Shadow */}
        <ellipse
          cx={rock.ripple.cx}
          cy={rock.ripple.cy - 4}
          rx={rock.ripple.rx - 8}
          ry={rock.ripple.ry - 4}
          fill="#0f172a"
          opacity="0.65"
        />

        {/* 3. 3D Craggy Rock Cliff (Vertical Depth) */}
        <path d={rock.cliff} fill={`url(#${gradIdSide})`} />

        {/* 4. Rock Facet Shading cuts */}
        {rock.facets.map((facet, i) => (
          <path
            key={i}
            d={facet.d}
            fill="#0f172a"
            opacity={facet.opacity}
          />
        ))}

        {/* 5. Top Stepping Plateau (Flat walking surface) */}
        <path
          d={rock.plateau}
          fill={`url(#${gradIdTop})`}
          stroke={isCorrect ? '#6ee7b7' : isWrong ? '#fca5a5' : '#44403c'}
          strokeWidth="1.5"
        />

        {/* 6. Sunlit Top Edge Highlight */}
        <path
          d={rock.highlight}
          fill="none"
          stroke={highlightColor}
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* 7. Natural Rock Crevices & Fissures */}
        {rock.cracks.map((crack, i) => (
          <path
            key={i}
            d={crack}
            fill="none"
            stroke={crackColor}
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.75"
          />
        ))}

        {/* 8. Lush River Moss Patches */}
        {rock.moss.map((m, i) => (
          <path
            key={i}
            d={m.d}
            fill={`url(#${gradIdMoss})`}
            opacity="0.92"
          />
        ))}

        {/* 9. Small Moss Fern Sprout */}
        <circle cx={rock.ripple.cx - 50} cy="46" r="2.5" fill="#86efac" />
        <circle cx={rock.ripple.cx + 60} cy="50" r="2.5" fill="#86efac" />
      </svg>

      {/* Wooden Signpost Plaque on Top of Stone */}
      <div className={styles.stoneWoodSign}>
        <span className={styles.stoneSignNail}>•</span>
        <span className={styles.stoneSignText}>{label}</span>
        <span className={styles.stoneSignNail}>•</span>
      </div>

      {/* Deep Chiseled Glowing Rune Number */}
      <div className={styles.stoneNumberOverlay}>
        <span className={styles.stoneChiseledNumber}>
          {value}
        </span>
      </div>

      {/* Interactive Floating Status Badges */}
      {isCorrect && (
        <div className={styles.correctBannerBadge}>
          <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>stars</span>
          <span>Lompatan Sukses!</span>
        </div>
      )}

      {isWrong && (
        <div className={styles.wrongBannerBadge}>
          <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>warning</span>
          <span>Batu Goyang!</span>
        </div>
      )}

      {/* Water Splash animation on success */}
      {isCorrect && <span className={styles.waterSplashEmoji}>💦</span>}
    </button>
  );
}

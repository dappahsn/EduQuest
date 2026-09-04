import React from 'react';

/**
 * Universal Character Avatar
 * Rendered consistently across World Map, Header, Quests, Result, Collection, and Profile.
 * Supports 8 attributes: avatar, hairstyle, hairColor, skinTone, outfit, shoes, backpack, accessories, outfitColor
 */
function CharacterAvatar({
  config = {},
  size = 'md',
  animate = false,
  className = '',
  onClick = null
}) {
  const {
    skinTone = '#ffd8be',
    hairColor = '#1a1a1a',
    hairstyle = 'short',
    accessories = 'hat-safari',
    outfitColor = 'sky',
    outfit = 'outfit-scout',
    shoes = 'shoes-sneakers',
    backpack = 'bag-canvas'
  } = config;

  const sizeMap = {
    xs: 28,
    sm: 36,
    md: 48,
    lg: 64,
    xl: 120,
    hero: 220
  };

  const px = sizeMap[size] || 48;

  // Color mapping
  const outfitColorHex = {
    sky: '#006194',
    yellow: '#c05400',
    green: '#006c49',
    coral: '#ba1a1a',
    purple: '#272f4a'
  }[outfitColor] || '#006194';

  return (
    <div
      onClick={onClick}
      className={className}
      style={{
        width: `${px}px`,
        height: `${px}px`,
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: onClick ? 'pointer' : 'default',
        transform: animate ? 'scale(1.03)' : 'none',
        transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}
    >
      <svg
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
        style={{ overflow: 'visible', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.12))' }}
      >
        <defs>
          <radialGradient id={`glow-${size}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Backdrop circle */}
        <circle cx="50" cy="50" r="48" fill="#e3e7ff" />

        {/* Backpack shoulder strap / peek */}
        {backpack && (
          <path
            d="M 24 55 Q 20 70 30 85 L 26 88 Q 16 70 20 55 Z"
            fill="#341100"
            opacity="0.8"
          />
        )}

        {/* Torso / Outfit */}
        <path
          d="M 32 72 Q 50 66 68 72 L 72 98 Q 50 100 28 98 Z"
          fill={outfitColorHex}
        />
        {/* Collar / Scout Scarf */}
        <path
          d="M 42 70 L 50 82 L 58 70 Q 50 68 42 70 Z"
          fill="#ffdbca"
        />

        {/* Head Base / Skin */}
        <ellipse cx="50" cy="46" rx="28" ry="30" fill={skinTone} />

        {/* Cheerful Rosy Cheeks */}
        <circle cx="34" cy="54" r="5" fill="#ff8a80" opacity="0.45" />
        <circle cx="66" cy="54" r="5" fill="#ff8a80" opacity="0.45" />

        {/* Eyes */}
        <ellipse cx="38" cy="46" rx="4" ry="5.5" fill="#121a34" />
        <ellipse cx="62" cy="46" rx="4" ry="5.5" fill="#121a34" />
        {/* Eye sparkles */}
        <circle cx="39.5" cy="44" r="1.8" fill="#ffffff" />
        <circle cx="63.5" cy="44" r="1.8" fill="#ffffff" />

        {/* Eyebrows */}
        <path
          d="M 33 39 Q 38 36 43 38"
          stroke="#121a34"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 57 38 Q 62 36 67 39"
          stroke="#121a34"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Smiling Mouth */}
        <path
          d="M 43 56 Q 50 63 57 56"
          stroke="#994100"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="#ba1a1a"
        />

        {/* Hair Styles */}
        {hairstyle === 'short' && (
          <path
            d="M 22 42 Q 22 20 50 18 Q 78 20 78 42 Q 68 28 50 28 Q 32 28 22 42 Z"
            fill={hairColor}
          />
        )}
        {hairstyle === 'curly' && (
          <path
            d="M 20 44 C 18 24 35 16 50 16 C 65 16 82 24 80 44 C 74 26 62 24 50 24 C 38 24 26 26 20 44 Z"
            fill={hairColor}
          />
        )}
        {hairstyle === 'ponytail' && (
          <g>
            <path
              d="M 24 40 Q 24 20 50 20 Q 76 20 76 40 Q 66 28 50 28 Q 34 28 24 40 Z"
              fill={hairColor}
            />
            <path
              d="M 72 32 Q 88 30 84 52 Q 80 40 70 36 Z"
              fill={hairColor}
            />
          </g>
        )}
        {hairstyle === 'spiky' && (
          <polygon
            points="24,40 32,22 40,30 50,16 60,30 68,22 76,40 50,26"
            fill={hairColor}
          />
        )}

        {/* Accessories / Hats */}
        {accessories === 'hat-safari' && (
          <g>
            {/* Safari Hat Crown */}
            <path
              d="M 28 32 Q 50 10 72 32 Z"
              fill="#c05400"
            />
            {/* Hat Band */}
            <path
              d="M 27 30 Q 50 22 73 30"
              stroke="#6cf8bb"
              strokeWidth="4"
              fill="none"
            />
            {/* Brim */}
            <ellipse cx="50" cy="32" rx="38" ry="7" fill="#c05400" />
          </g>
        )}

        {accessories === 'hat-astronaut' && (
          <g>
            {/* Glass Bubble Helmet */}
            <circle
              cx="50"
              cy="44"
              r="34"
              fill="none"
              stroke="#cce5ff"
              strokeWidth="5"
              opacity="0.9"
            />
            <ellipse
              cx="50"
              cy="44"
              rx="28"
              ry="26"
              fill="#006194"
              opacity="0.25"
            />
            {/* Helmet Reflection */}
            <path
              d="M 30 26 Q 44 20 58 24"
              stroke="#ffffff"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              opacity="0.8"
            />
          </g>
        )}

        {accessories === 'hat-detective' && (
          <g>
            {/* Beret */}
            <ellipse cx="50" cy="24" rx="28" ry="12" fill="#783200" />
            <circle cx="50" cy="12" r="3" fill="#783200" />
          </g>
        )}

        {accessories === 'hat-forest-crown' && (
          <g>
            {/* Leaf Crown */}
            <path
              d="M 28 30 Q 38 18 50 28 Q 62 18 72 30"
              stroke="#006c49"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="38" cy="20" r="4" fill="#6cf8bb" />
            <circle cx="50" cy="24" r="4" fill="#ffdbca" />
            <circle cx="62" cy="20" r="4" fill="#6cf8bb" />
          </g>
        )}
      </svg>
    </div>
  );
}

export default React.memo(CharacterAvatar);

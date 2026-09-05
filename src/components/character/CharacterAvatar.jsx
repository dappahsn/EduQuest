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

  // Dynamic 3D storybook character mapping based on avatar ID or accessories
  const getAvatarImage = () => {
    if (config.avatarImage) return config.avatarImage;
    if (config.avatar === 'tara_adventurer' || config.avatar === 'girl_tara') {
      return '/images/tara-avatar.png';
    }
    if (config.avatar === 'raka_astronaut' || config.accessories === 'hat-astronaut' || config.outfit === 'outfit-cyber') {
      return '/images/raka-astronaut.png';
    }
    if (config.avatar === 'raka_detective' || config.accessories === 'hat-detective') {
      return '/images/raka-detective.png';
    }
    if (config.avatar === 'raka_nature' || config.accessories === 'hat-forest-crown' || config.outfit === 'outfit-scientist') {
      return '/images/raka-nature.png';
    }
    if (config.avatar === 'raka_casual') {
      return '/images/raka-casual.png';
    }
    if (config.avatar === 'raka_explorer' || config.avatar === 'boy_raka' || config.accessories === 'hat-safari') {
      return '/images/raka-safari.png';
    }
    // Default fallback
    return '/images/raka-safari.png';
  };

  const shouldUseImage = !config.forceSvg;

  if (shouldUseImage) {
    const imgSrc = getAvatarImage();
    const isHero = size === 'hero';

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
          transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
          borderRadius: '50%',
          boxShadow: isHero ? '0 16px 40px -10px rgba(2, 132, 199, 0.35), 0 0 0 6px rgba(186, 230, 253, 0.6)' : '0 4px 12px rgba(2, 132, 199, 0.18)',
          border: isHero ? '4px solid #ffffff' : '2px solid rgba(186, 230, 253, 0.9)',
          overflow: 'hidden',
          backgroundColor: '#e0f2fe'
        }}
      >
        <img
          src={imgSrc}
          alt="Raka Character"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }}
        />
      </div>
    );
  }

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
          <linearGradient id={`skinGrad-${size}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={skinTone} />
            <stop offset="100%" stopColor="#f5be9e" />
          </linearGradient>
        </defs>

        {/* Backdrop circle */}
        <circle cx="50" cy="50" r="48" fill="#e0f2fe" />

        {/* Backpack shoulder strap / peek */}
        {backpack && backpack !== 'none' && (
          <path
            d="M 22 55 Q 18 70 28 85 L 24 88 Q 14 70 18 55 Z"
            fill="#341100"
            opacity="0.8"
          />
        )}

        {/* Torso / Outfit */}
        <path
          d="M 30 70 Q 50 64 70 70 L 74 98 Q 50 100 26 98 Z"
          fill={outfitColorHex}
        />
        {/* Collar / Scout Scarf */}
        <path
          d="M 40 68 L 50 82 L 60 68 Q 50 65 40 68 Z"
          fill="#f97316"
        />
        <circle cx="50" cy="74" r="3" fill="#ea580c" />

        {/* Ears */}
        <circle cx="21" cy="46" r="6" fill={`url(#skinGrad-${size})`} />
        <circle cx="79" cy="46" r="6" fill={`url(#skinGrad-${size})`} />
        <circle cx="21" cy="46" r="3" fill="#f5be9e" opacity="0.6" />
        <circle cx="79" cy="46" r="3" fill="#f5be9e" opacity="0.6" />

        {/* Head Base / Skin */}
        <ellipse cx="50" cy="46" rx="28" ry="30" fill={`url(#skinGrad-${size})`} />

        {/* Cheerful Rosy Cheeks */}
        <circle cx="33" cy="54" r="6" fill="#ff8a80" opacity="0.5" />
        <circle cx="67" cy="54" r="6" fill="#ff8a80" opacity="0.5" />

        {/* Expressive Anime/Pixar Eyes */}
        <ellipse cx="37" cy="46" rx="4.5" ry="6" fill="#1e1b4b" />
        <ellipse cx="63" cy="46" rx="4.5" ry="6" fill="#1e1b4b" />
        <circle cx="37" cy="47" r="3.2" fill="#4338ca" />
        <circle cx="63" cy="47" r="3.2" fill="#4338ca" />
        {/* Eye sparkles */}
        <circle cx="35.5" cy="43.5" r="2" fill="#ffffff" />
        <circle cx="61.5" cy="43.5" r="2" fill="#ffffff" />
        <circle cx="38.5" cy="48" r="0.9" fill="#ffffff" />
        <circle cx="64.5" cy="48" r="0.9" fill="#ffffff" />

        {/* Eyebrows */}
        <path
          d="M 31 38 Q 37 34 43 37"
          stroke="#1e1b4b"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 57 37 Q 63 34 69 38"
          stroke="#1e1b4b"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Smiling Mouth */}
        <path
          d="M 42 55 Q 50 63 58 55"
          stroke="#994100"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="#ef4444"
        />
        {/* Tooth sparkle highlight */}
        <path
          d="M 46 56 Q 50 58 54 56"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Hair Styles */}
        {hairstyle === 'short' && (
          <path
            d="M 22 42 Q 22 18 50 16 Q 78 18 78 42 Q 68 28 50 28 Q 32 28 22 42 Z"
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
              d="M 27 33 Q 50 12 73 33 Z"
              fill="#e2be8a"
            />
            <path
              d="M 29 33 Q 50 14 71 33 Z"
              fill="#ebd0a7"
              opacity="0.6"
            />
            {/* Leather Band */}
            <path
              d="M 26 33 Q 50 25 74 33"
              stroke="#5c3a21"
              strokeWidth="4.5"
              fill="none"
            />
            {/* Golden Buckle */}
            <rect x="47" y="27" width="6" height="5" rx="1" fill="#f59e0b" />
            <rect x="48.5" y="28" width="3" height="3" rx="0.5" fill="#5c3a21" />
            {/* Brim with curved depth */}
            <ellipse cx="50" cy="33" rx="38" ry="8" fill="#d4aa72" />
            <ellipse cx="50" cy="32" rx="36" ry="6.5" fill="#e8c99b" />
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

import React from 'react';
import styles from './PizzaLab.module.css';

/**
 * 3D Pizza Slice Component
 * Renders an authentic, appetizing 3D wedge of pizza with:
 * - Thick golden-brown baked crust with blistered spots
 * - Melted mozzarella & cheddar cheese layer with toasted patches
 * - Savory Pepperoni discs with meaty marbling, char edge, and specular gleam
 * - Sliced black olives & fresh green basil leaf
 * - 3D elevation pull effect when selected
 */
export default function PizzaSlice3D({ index, isSelected, onClick, disabled }) {
  const gradCrustId = `pizza-crust-grad-${index}`;
  const gradCheeseId = `pizza-cheese-grad-${index}`;
  const gradPepperoniId = `pizza-pep-grad-${index}`;
  const gradSauceId = `pizza-sauce-grad-${index}`;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${styles.sliceButton3D} ${styles[`slice${index}`]} ${isSelected ? styles.sliceSelected : ''}`}
      aria-label={`Potongan pizza ${index + 1} ${isSelected ? 'terpilih' : 'belum dipilih'}`}
    >
      <svg
        viewBox="0 0 130 130"
        className={styles.sliceSvg}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Crust Gradient */}
          <radialGradient id={gradCrustId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="60%" stopColor="#c2410c" />
            <stop offset="100%" stopColor="#7c2d12" />
          </radialGradient>

          {/* Melted Cheese Gradient */}
          <radialGradient id={gradCheeseId} cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="55%" stopColor="#fde047" />
            <stop offset="85%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </radialGradient>

          {/* Rich Tomato Sauce Border Gradient */}
          <linearGradient id={gradSauceId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#991b1b" />
          </linearGradient>

          {/* Savory Pepperoni Gradient */}
          <radialGradient id={gradPepperoniId} cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="45%" stopColor="#dc2626" />
            <stop offset="85%" stopColor="#b91c1c" />
            <stop offset="100%" stopColor="#7f1d1d" />
          </radialGradient>

          {/* Drop shadow filter for toppings */}
          <filter id={`topping-shadow-${index}`} x="-20%" y="-20%" width="150%" height="150%">
            <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* ============================================================
            QUADRANT 0: TOP-LEFT SLICE
            ============================================================ */}
        {index === 0 && (
          <g>
            {/* 1. Tomato Sauce Rim Base */}
            <path
              d="M 12,126 A 114 114 0 0 1 126,12 L 126,126 Z"
              fill={`url(#${gradSauceId})`}
            />

            {/* 2. Melted Gooey Cheese Layer */}
            <path
              d="M 18,126 A 108 108 0 0 1 126,18 L 126,126 Z"
              fill={`url(#${gradCheeseId})`}
            />

            {/* Toasted Cheese Spots */}
            <circle cx="95" cy="45" r="7" fill="#d97706" opacity="0.6" />
            <circle cx="50" cy="85" r="6" fill="#d97706" opacity="0.5" />
            <circle cx="85" cy="90" r="8" fill="#d97706" opacity="0.55" />

            {/* 3. Outer Puffy Crust Roll */}
            <path
              d="M 4,126 A 122 122 0 0 1 126,4 L 126,20 A 106 106 0 0 0 20,126 Z"
              fill={`url(#${gradCrustId})`}
              stroke="#7c2d12"
              strokeWidth="1.5"
            />
            {/* Crust Blisters */}
            <circle cx="35" cy="95" r="3.5" fill="#431407" opacity="0.8" />
            <circle cx="60" cy="60" r="4" fill="#431407" opacity="0.8" />
            <circle cx="95" cy="35" r="3.5" fill="#431407" opacity="0.8" />
            <circle cx="118" cy="18" r="2.5" fill="#431407" opacity="0.8" />

            {/* 4. Pepperoni Slices with 3D Depth */}
            <g filter={`url(#topping-shadow-${index})`}>
              {/* Main Pepperoni 1 */}
              <circle cx="68" cy="68" r="16" fill={`url(#${gradPepperoniId})`} stroke="#7f1d1d" strokeWidth="1" />
              <circle cx="63" cy="63" r="2" fill="#fecaca" opacity="0.8" />
              <circle cx="73" cy="72" r="1.5" fill="#450a0a" />
              <circle cx="62" cy="73" r="1.5" fill="#450a0a" />

              {/* Pepperoni 2 */}
              <circle cx="102" cy="92" r="13" fill={`url(#${gradPepperoniId})`} stroke="#7f1d1d" strokeWidth="1" />
              <circle cx="98" cy="88" r="1.8" fill="#fecaca" opacity="0.8" />
              <circle cx="105" cy="95" r="1.2" fill="#450a0a" />
            </g>

            {/* 5. Fresh Basil Leaf & Black Olive */}
            <g filter={`url(#topping-shadow-${index})`}>
              {/* Basil leaf */}
              <path d="M 82,42 C 90,36 98,42 94,52 C 86,54 80,48 82,42 Z" fill="#16a34a" />
              <path d="M 83,44 Q 88,46 93,50" stroke="#86efac" strokeWidth="0.8" fill="none" />

              {/* Black Olive Ring */}
              <circle cx="50" cy="102" r="7" fill="#0f172a" />
              <circle cx="50" cy="102" r="3.5" fill="#f59e0b" />
            </g>

            {/* Cheese Drips along cut edges when selected */}
            {isSelected && (
              <g fill="#fde047" opacity="0.95">
                <circle cx="126" cy="70" r="3" />
                <circle cx="126" cy="105" r="4" />
                <circle cx="70" cy="126" r="3.5" />
                <circle cx="105" cy="126" r="4" />
              </g>
            )}
          </g>
        )}

        {/* ============================================================
            QUADRANT 1: TOP-RIGHT SLICE
            ============================================================ */}
        {index === 1 && (
          <g>
            {/* 1. Tomato Sauce Base */}
            <path
              d="M 4,12 A 114 114 0 0 1 118,126 L 4,126 Z"
              fill={`url(#${gradSauceId})`}
            />

            {/* 2. Melted Cheese */}
            <path
              d="M 4,18 A 108 108 0 0 1 112,126 L 4,126 Z"
              fill={`url(#${gradCheeseId})`}
            />

            {/* Toasted spots */}
            <circle cx="35" cy="45" r="7" fill="#d97706" opacity="0.6" />
            <circle cx="80" cy="85" r="6" fill="#d97706" opacity="0.5" />
            <circle cx="45" cy="90" r="8" fill="#d97706" opacity="0.55" />

            {/* 3. Outer Crust Roll */}
            <path
              d="M 4,4 A 122 122 0 0 1 126,126 L 110,126 A 106 106 0 0 0 4,20 Z"
              fill={`url(#${gradCrustId})`}
              stroke="#7c2d12"
              strokeWidth="1.5"
            />
            {/* Blisters */}
            <circle cx="95" cy="95" r="3.5" fill="#431407" opacity="0.8" />
            <circle cx="70" cy="60" r="4" fill="#431407" opacity="0.8" />
            <circle cx="35" cy="35" r="3.5" fill="#431407" opacity="0.8" />
            <circle cx="12" cy="18" r="2.5" fill="#431407" opacity="0.8" />

            {/* 4. Pepperonis */}
            <g filter={`url(#topping-shadow-${index})`}>
              <circle cx="62" cy="68" r="16" fill={`url(#${gradPepperoniId})`} stroke="#7f1d1d" strokeWidth="1" />
              <circle cx="58" cy="63" r="2" fill="#fecaca" opacity="0.8" />
              <circle cx="68" cy="72" r="1.5" fill="#450a0a" />

              <circle cx="28" cy="92" r="13" fill={`url(#${gradPepperoniId})`} stroke="#7f1d1d" strokeWidth="1" />
              <circle cx="24" cy="88" r="1.8" fill="#fecaca" opacity="0.8" />
            </g>

            {/* 5. Basil & Olive */}
            <g filter={`url(#topping-shadow-${index})`}>
              <path d="M 48,42 C 40,36 32,42 36,52 C 44,54 50,48 48,42 Z" fill="#16a34a" />
              <path d="M 47,44 Q 42,46 37,50" stroke="#86efac" strokeWidth="0.8" fill="none" />

              <circle cx="80" cy="102" r="7" fill="#0f172a" />
              <circle cx="80" cy="102" r="3.5" fill="#f59e0b" />
            </g>

            {isSelected && (
              <g fill="#fde047" opacity="0.95">
                <circle cx="4" cy="70" r="3" />
                <circle cx="4" cy="105" r="4" />
                <circle cx="60" cy="126" r="3.5" />
                <circle cx="25" cy="126" r="4" />
              </g>
            )}
          </g>
        )}

        {/* ============================================================
            QUADRANT 2: BOTTOM-LEFT SLICE
            ============================================================ */}
        {index === 2 && (
          <g>
            {/* 1. Tomato Sauce Base */}
            <path
              d="M 12,4 A 114 114 0 0 0 126,118 L 126,4 Z"
              fill={`url(#${gradSauceId})`}
            />

            {/* 2. Melted Cheese */}
            <path
              d="M 18,4 A 108 108 0 0 0 126,112 L 126,4 Z"
              fill={`url(#${gradCheeseId})`}
            />

            {/* Toasted spots */}
            <circle cx="95" cy="85" r="7" fill="#d97706" opacity="0.6" />
            <circle cx="50" cy="45" r="6" fill="#d97706" opacity="0.5" />
            <circle cx="85" cy="40" r="8" fill="#d97706" opacity="0.55" />

            {/* 3. Outer Crust Roll */}
            <path
              d="M 4,4 A 122 122 0 0 0 126,126 L 126,110 A 106 106 0 0 1 20,4 Z"
              fill={`url(#${gradCrustId})`}
              stroke="#7c2d12"
              strokeWidth="1.5"
            />
            {/* Blisters */}
            <circle cx="35" cy="35" r="3.5" fill="#431407" opacity="0.8" />
            <circle cx="60" cy="70" r="4" fill="#431407" opacity="0.8" />
            <circle cx="95" cy="95" r="3.5" fill="#431407" opacity="0.8" />
            <circle cx="118" cy="112" r="2.5" fill="#431407" opacity="0.8" />

            {/* 4. Pepperonis */}
            <g filter={`url(#topping-shadow-${index})`}>
              <circle cx="68" cy="62" r="16" fill={`url(#${gradPepperoniId})`} stroke="#7f1d1d" strokeWidth="1" />
              <circle cx="63" cy="58" r="2" fill="#fecaca" opacity="0.8" />
              <circle cx="72" cy="68" r="1.5" fill="#450a0a" />

              <circle cx="102" cy="38" r="13" fill={`url(#${gradPepperoniId})`} stroke="#7f1d1d" strokeWidth="1" />
              <circle cx="98" cy="34" r="1.8" fill="#fecaca" opacity="0.8" />
            </g>

            {/* 5. Basil & Olive */}
            <g filter={`url(#topping-shadow-${index})`}>
              <path d="M 82,88 C 90,94 98,88 94,78 C 86,76 80,82 82,88 Z" fill="#16a34a" />
              <path d="M 83,86 Q 88,84 93,80" stroke="#86efac" strokeWidth="0.8" fill="none" />

              <circle cx="50" cy="28" r="7" fill="#0f172a" />
              <circle cx="50" cy="28" r="3.5" fill="#f59e0b" />
            </g>

            {isSelected && (
              <g fill="#fde047" opacity="0.95">
                <circle cx="126" cy="60" r="3" />
                <circle cx="126" cy="25" r="4" />
                <circle cx="70" cy="4" r="3.5" />
                <circle cx="105" cy="4" r="4" />
              </g>
            )}
          </g>
        )}

        {/* ============================================================
            QUADRANT 3: BOTTOM-RIGHT SLICE
            ============================================================ */}
        {index === 3 && (
          <g>
            {/* 1. Tomato Sauce Base */}
            <path
              d="M 118,4 A 114 114 0 0 1 4,118 L 4,4 Z"
              fill={`url(#${gradSauceId})`}
            />

            {/* 2. Melted Cheese */}
            <path
              d="M 112,4 A 108 108 0 0 1 4,112 L 4,4 Z"
              fill={`url(#${gradCheeseId})`}
            />

            {/* Toasted spots */}
            <circle cx="35" cy="85" r="7" fill="#d97706" opacity="0.6" />
            <circle cx="80" cy="45" r="6" fill="#d97706" opacity="0.5" />
            <circle cx="45" cy="40" r="8" fill="#d97706" opacity="0.55" />

            {/* 3. Outer Crust Roll */}
            <path
              d="M 126,4 A 122 122 0 0 1 4,126 L 4,110 A 106 106 0 0 0 110,4 Z"
              fill={`url(#${gradCrustId})`}
              stroke="#7c2d12"
              strokeWidth="1.5"
            />
            {/* Blisters */}
            <circle cx="95" cy="35" r="3.5" fill="#431407" opacity="0.8" />
            <circle cx="70" cy="70" r="4" fill="#431407" opacity="0.8" />
            <circle cx="35" cy="95" r="3.5" fill="#431407" opacity="0.8" />
            <circle cx="12" cy="112" r="2.5" fill="#431407" opacity="0.8" />

            {/* 4. Pepperonis */}
            <g filter={`url(#topping-shadow-${index})`}>
              <circle cx="62" cy="62" r="16" fill={`url(#${gradPepperoniId})`} stroke="#7f1d1d" strokeWidth="1" />
              <circle cx="58" cy="58" r="2" fill="#fecaca" opacity="0.8" />
              <circle cx="68" cy="68" r="1.5" fill="#450a0a" />

              <circle cx="28" cy="38" r="13" fill={`url(#${gradPepperoniId})`} stroke="#7f1d1d" strokeWidth="1" />
              <circle cx="24" cy="34" r="1.8" fill="#fecaca" opacity="0.8" />
            </g>

            {/* 5. Basil & Olive */}
            <g filter={`url(#topping-shadow-${index})`}>
              <path d="M 48,88 C 40,94 32,88 36,78 C 44,76 50,82 48,88 Z" fill="#16a34a" />
              <path d="M 47,86 Q 42,84 37,80" stroke="#86efac" strokeWidth="0.8" fill="none" />

              <circle cx="80" cy="28" r="7" fill="#0f172a" />
              <circle cx="80" cy="28" r="3.5" fill="#f59e0b" />
            </g>

            {isSelected && (
              <g fill="#fde047" opacity="0.95">
                <circle cx="4" cy="60" r="3" />
                <circle cx="4" cy="25" r="4" />
                <circle cx="60" cy="4" r="3.5" />
                <circle cx="25" cy="4" r="4" />
              </g>
            )}
          </g>
        )}
      </svg>

      {/* Floating 3D "Dipilih" Badge on Selected Slice */}
      {isSelected && (
        <div className={styles.selectedSliceBadge}>
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>check_circle</span>
          <span>Dipilih!</span>
        </div>
      )}
    </button>
  );
}

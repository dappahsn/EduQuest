import React, { Suspense, lazy } from 'react';
import { useParams } from 'react-router-dom';
import GameHeader from '../../components/navigation/GameHeader';

// Lazy load individual mini games on demand
const NumberCatcher = lazy(() => import('./NumberCatcher'));
const PizzaLab = lazy(() => import('./PizzaLab'));
const SolarSystemBuilder = lazy(() => import('./SolarSystemBuilder'));
const RobotRescue = lazy(() => import('./RobotRescue'));
const StoryBuilder = lazy(() => import('./StoryBuilder'));

function GameLoadingFallback() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-xl) 0',
        gap: 'var(--space-md)'
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: '4px solid var(--color-surface-dim)',
          borderTopColor: 'var(--color-primary)'
        }}
        className="animate-spin"
      />
      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary-deep)' }}>
        Menyiapkan arena permainan... 🎮
      </span>
    </div>
  );
}

export default function GameHost() {
  const { gameId } = useParams();

  function renderGame() {
    switch (gameId) {
      case 'mini-nc':
      case 'number-catcher':
        return <NumberCatcher />;
      case 'mini-pl':
      case 'pizza-lab':
        return <PizzaLab />;
      case 'mini-ss':
      case 'solar-system':
        return <SolarSystemBuilder />;
      case 'mini-rr':
      case 'robot-rescue':
        return <RobotRescue />;
      case 'mini-sb':
      case 'story-builder':
        return <StoryBuilder />;
      default:
        return <NumberCatcher />;
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-surface)',
        paddingTop: '80px',
        paddingBottom: '40px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <GameHeader />

      <main
        style={{
          maxWidth: '520px',
          width: '100%',
          margin: '0 auto',
          padding: '0 var(--space-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-md)'
        }}
      >
        <Suspense fallback={<GameLoadingFallback />}>
          {renderGame()}
        </Suspense>
      </main>
    </div>
  );
}

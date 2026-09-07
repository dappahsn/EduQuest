import React, { Suspense, lazy } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import GameHeader from '../../components/navigation/GameHeader';

// Lazy load individual mini games on demand
const NumberCatcher = lazy(() => import('./NumberCatcher'));
const PizzaLab = lazy(() => import('./PizzaLab'));
const MagicTriangle = lazy(() => import('./MagicTriangle'));
const CrystalAlgebraGate = lazy(() => import('./CrystalAlgebraGate'));
const SolarSystemBuilder = lazy(() => import('./SolarSystemBuilder'));
const GravityLab = lazy(() => import('./GravityLab'));
const RobotRescue = lazy(() => import('./RobotRescue'));
const StoryBuilder = lazy(() => import('./StoryBuilder'));
const PhotosynthesisLab = lazy(() => import('./PhotosynthesisLab'));
const ButterflyMetamorphosis = lazy(() => import('./ButterflyMetamorphosis'));
const RareFloraExplorer = lazy(() => import('./RareFloraExplorer'));
const AksaraPusaka = lazy(() => import('./AksaraPusaka'));
const PujanggaPantun = lazy(() => import('./PujanggaPantun'));
const GearPuzzle = lazy(() => import('./GearPuzzle'));
const LogicGatePuzzle = lazy(() => import('./LogicGatePuzzle'));
const SpaceStationLaunch = lazy(() => import('./SpaceStationLaunch'));

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
  const [searchParams] = useSearchParams();
  const questId = searchParams.get('questId');

  function renderGame() {
    switch (gameId) {
      case 'mini-nc':
      case 'number-catcher':
        return <NumberCatcher questId={questId} />;
      case 'mini-pl':
      case 'pizza-lab':
        return <PizzaLab questId={questId} />;
      case 'mini-mt':
      case 'magic-triangle':
        return <MagicTriangle questId={questId} />;
      case 'mini-ag':
      case 'algebra-gate':
        return <CrystalAlgebraGate questId={questId} />;
      case 'mini-ss':
      case 'solar-system':
        if (questId === 'quest-ap-2' || questId === 'angkasa-02' || questId === 'angkasa-pengetahuan-02') {
          return <GravityLab questId={questId} />;
        }
        if (questId === 'quest-ap-3' || questId === 'angkasa-03' || questId === 'angkasa-pengetahuan-03') {
          return <SpaceStationLaunch questId={questId} />;
        }
        return <SolarSystemBuilder questId={questId} />;
      case 'mini-ssl':
      case 'space-station-launch':
      case 'space-station':
        return <SpaceStationLaunch questId={questId} />;
      case 'mini-gl':
      case 'gravity-lab':
        return <GravityLab questId={questId} />;
      case 'mini-rr':
      case 'robot-rescue':
        if (questId === 'quest-gt-2') {
          return <GearPuzzle questId={questId} />;
        }
        if (questId === 'quest-gt-3') {
          return <LogicGatePuzzle questId={questId} />;
        }
        return <RobotRescue questId={questId} />;
      case 'mini-lg':
      case 'logic-gate':
        return <LogicGatePuzzle questId={questId} />;
      case 'mini-gp':
      case 'gear-puzzle':
        return <GearPuzzle questId={questId} />;
      case 'mini-sb':
      case 'story-builder':
        return <StoryBuilder questId={questId} />;
      case 'mini-ps':
      case 'photosynthesis-lab':
        return <PhotosynthesisLab questId={questId} />;
      case 'mini-bm':
      case 'butterfly-metamorphosis':
        return <ButterflyMetamorphosis questId={questId} />;
      case 'mini-rf':
      case 'rare-flora-explorer':
        return <RareFloraExplorer questId={questId} />;
      case 'mini-ap':
      case 'aksara-pusaka':
        return <AksaraPusaka questId={questId} />;
      case 'mini-pp':
      case 'pujangga-pantun':
        return <PujanggaPantun questId={questId} />;
      default:
        return <NumberCatcher questId={questId} />;
    }
  }

  return (
    <div
      style={{
        height: '100dvh',
        maxHeight: '100dvh',
        backgroundColor: 'var(--color-surface)',
        paddingTop: '68px',
        paddingBottom: '4px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}
    >
      <GameHeader />

      <main
        style={{
          maxWidth: '760px',
          width: '100%',
          height: 'calc(100dvh - 72px)',
          maxHeight: 'calc(100dvh - 72px)',
          margin: '0 auto',
          padding: '0 var(--space-sm)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxSizing: 'border-box',
          flex: 1
        }}
      >
        <Suspense fallback={<GameLoadingFallback />}>
          {renderGame()}
        </Suspense>
      </main>
    </div>
  );
}

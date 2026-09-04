import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GameProvider } from './context/GameContext';
import { LanguageProvider } from './context/LanguageContext';
import { AudioProvider } from './context/AudioContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LevelUpModal from './components/common/LevelUpModal';
import RewardModal from './components/common/RewardModal';
import AchievementToast from './components/common/AchievementToast';

// Lazy Loaded Pages for Optimal Code Splitting
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const EmailVerification = lazy(() => import('./pages/auth/EmailVerification'));
const AuthCallback = lazy(() => import('./pages/auth/AuthCallback'));

const WorldMap = lazy(() => import('./pages/world/WorldMap'));
const RegionView = lazy(() => import('./pages/world/RegionView'));
const QuestDetail = lazy(() => import('./pages/quest/QuestDetail'));
const DiscoveryView = lazy(() => import('./pages/quest/DiscoveryView'));
const QuestResult = lazy(() => import('./pages/quest/QuestResult'));
const GameHost = lazy(() => import('./pages/games/GameHost'));

const DailyQuestsView = lazy(() => import('./pages/daily/DailyQuestsView'));
const CollectionView = lazy(() => import('./pages/collection/CollectionView'));
const PetsView = lazy(() => import('./pages/pets/PetsView'));
const AchievementsView = lazy(() => import('./pages/achievements/AchievementsView'));
const CharacterCustomizer = lazy(() => import('./pages/character/CharacterCustomizer'));
const ProfileView = lazy(() => import('./pages/profile/ProfileView'));
const SettingsView = lazy(() => import('./pages/settings/SettingsView'));
const OnboardingCharacter = lazy(() => import('./pages/onboarding/OnboardingCharacter'));
const OnboardingIntro = lazy(() => import('./pages/onboarding/OnboardingIntro'));

function PageLoadingFallback() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--color-surface)',
        gap: 'var(--space-md)'
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          border: '4px solid var(--color-surface-dim)',
          borderTopColor: 'var(--color-primary)'
        }}
        className="animate-spin"
      />
      <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-primary)' }}>
        Memuat petualangan... ✨
      </span>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <GameProvider>
          <BrowserRouter>
          <AudioProvider>
          <Suspense fallback={<PageLoadingFallback />}>
            <Routes>
              {/* Public Landing & Onboarding */}
              <Route path="/" element={<Landing />} />
              <Route path="/onboarding/character" element={<OnboardingCharacter />} />
              <Route path="/onboarding/intro" element={<OnboardingIntro />} />

              {/* Authentication Routes (Public) */}
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              <Route path="/auth/forgot-password" element={<ForgotPassword />} />
              <Route path="/auth/reset-password" element={<ResetPassword />} />
              <Route path="/auth/verify-email" element={<EmailVerification />} />
              <Route path="/auth/callback" element={<AuthCallback />} />

              {/* Protected Game Routes */}
              <Route
                path="/world"
                element={
                  <ProtectedRoute>
                    <WorldMap />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/world/:regionId"
                element={
                  <ProtectedRoute>
                    <RegionView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/quest/:questId"
                element={
                  <ProtectedRoute>
                    <QuestDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/discovery/:discoveryId"
                element={
                  <ProtectedRoute>
                    <DiscoveryView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/game/:gameId"
                element={
                  <ProtectedRoute>
                    <GameHost />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/quest/:questId/result"
                element={
                  <ProtectedRoute>
                    <QuestResult />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/rewards"
                element={
                  <ProtectedRoute>
                    <QuestResult />
                  </ProtectedRoute>
                }
              />

              {/* Protected Inventory & Social Routes */}
              <Route
                path="/daily-quests"
                element={
                  <ProtectedRoute>
                    <DailyQuestsView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/collection"
                element={
                  <ProtectedRoute>
                    <CollectionView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pets"
                element={
                  <ProtectedRoute>
                    <PetsView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/achievements"
                element={
                  <ProtectedRoute>
                    <AchievementsView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/character"
                element={
                  <ProtectedRoute>
                    <CharacterCustomizer />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <SettingsView />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
          <LevelUpModal />
          <RewardModal />
          <AchievementToast />
          </AudioProvider>
        </BrowserRouter>
      </GameProvider>
    </AuthProvider>
  </LanguageProvider>
);
}

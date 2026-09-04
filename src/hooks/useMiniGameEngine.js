import { useState, useCallback } from 'react';
import { audioManager } from '../lib/audioManager';

/**
 * useMiniGameEngine
 * Common game state engine for the 5 interactive educational mini-games.
 * Automatically triggers SFX for correct/wrong answers, hints, and quest completion.
 */
export function useMiniGameEngine({
  totalQuestions = 5,
  initialLives = 3,
  timeLimitSeconds = null,
  onFinish = null
} = {}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(initialLives);
  const [streak, setStreak] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showHint, setShowHint] = useState(false);

  const submitAnswer = useCallback(
    (isCorrect, explanation = '') => {
      if (selectedAnswer !== null) return; // Prevent double answering

      setIsAnswerCorrect(isCorrect);
      if (isCorrect) {
        setScore((prev) => prev + 100 + streak * 10);
        setStreak((prev) => prev + 1);
        setFeedbackMessage(explanation || '✨ Luar Biasa! Jawabanmu Benar!');
        audioManager.playSfx('correct');
      } else {
        setLives((prev) => Math.max(0, prev - 1));
        setStreak(0);
        setFeedbackMessage(explanation || 'Belum tepat, ayo coba pelajari polanya!');
        audioManager.playSfx('wrong');
      }
    },
    [selectedAnswer, streak]
  );

  const nextQuestion = useCallback(() => {
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
    setFeedbackMessage('');
    setShowHint(false);
    audioManager.playSfx('button-click');

    if (currentQuestionIndex + 1 >= totalQuestions || lives <= 0) {
      setIsFinished(true);
      audioManager.playSfx('quest-complete');
      if (onFinish) {
        onFinish({
          finalScore: score,
          remainingLives: lives,
          totalQuestions
        });
      }
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  }, [currentQuestionIndex, totalQuestions, lives, onFinish, score]);

  const toggleHint = useCallback(() => {
    setShowHint((prev) => {
      if (!prev) audioManager.playSfx('hint');
      return !prev;
    });
  }, []);

  const resetGame = useCallback(() => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setLives(initialLives);
    setStreak(0);
    setIsFinished(false);
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
    setFeedbackMessage('');
    setShowHint(false);
  }, [initialLives]);

  return {
    currentQuestionIndex,
    questionNumber: currentQuestionIndex + 1,
    totalQuestions,
    score,
    lives,
    streak,
    isFinished,
    selectedAnswer,
    setSelectedAnswer,
    isAnswerCorrect,
    feedbackMessage,
    showHint,
    setShowHint: toggleHint,
    submitAnswer,
    nextQuestion,
    resetGame
  };
}

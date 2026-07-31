import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, Subject } from '../types';

const getTodayDateString = () => new Date().toISOString().split('T')[0];

const defaultStats = {
  totalQuestionsSolved: 0,
  correctAnswers: 0,
  wrongAnswers: 0,
  studyTimeInMinutes: 0,
  streak: 0,
  lastActiveDate: '',
  dailyProgress: {},
  subjectProgress: {
    Physics: { questionsAttempted: 0, correctAnswers: 0, chapterStats: {} },
    Chemistry: { questionsAttempted: 0, correctAnswers: 0, chapterStats: {} },
    Biology: { questionsAttempted: 0, correctAnswers: 0, chapterStats: {} }
  }
};

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      profile: null,
      stats: defaultStats,
      bookmarks: [],
      wrongNotebook: [],
      theme: 'light',

      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

      setProfile: (profile) => set({ profile }),

      recordStudyTime: (minutes) => set((state) => {
        const today = getTodayDateString();
        const dailyProgress = { ...state.stats.dailyProgress };
        dailyProgress[today] = (dailyProgress[today] || 0) + minutes;

        return {
          stats: {
            ...state.stats,
            studyTimeInMinutes: state.stats.studyTimeInMinutes + minutes,
            dailyProgress
          }
        };
      }),

      recordAnswer: (subject, chapter, isCorrect) => set((state) => {
        const newStats = { ...state.stats };
        newStats.totalQuestionsSolved++;
        if (isCorrect) {
          newStats.correctAnswers++;
        } else {
          newStats.wrongAnswers++;
        }

        const subjStats = newStats.subjectProgress[subject];
        subjStats.questionsAttempted++;
        if (isCorrect) subjStats.correctAnswers++;

        if (!subjStats.chapterStats[chapter]) {
          subjStats.chapterStats[chapter] = { status: 'Not Started', accuracy: 0 };
        }
        
        // Naive accuracy calculation for mock, in reality we'd track historical attempts per chapter.
        const acc = (subjStats.correctAnswers / Math.max(subjStats.questionsAttempted, 1)) * 100;
        let status: 'Mastered' | 'Improving' | 'Needs Revision' | 'Not Started' = 'Improving';
        if (acc >= 90) status = 'Mastered';
        else if (acc < 70) status = 'Needs Revision';

        subjStats.chapterStats[chapter] = { status, accuracy: acc };

        return { stats: newStats };
      }),

      addBookmark: (question) => set((state) => {
        if (state.bookmarks.some(b => b.questionId === question.id)) {
          return state;
        }
        return {
          bookmarks: [...state.bookmarks, { questionId: question.id, dateBookmarked: new Date().toISOString(), question }]
        };
      }),

      removeBookmark: (questionId) => set((state) => ({
        bookmarks: state.bookmarks.filter(b => b.questionId !== questionId)
      })),

      logActiveDay: () => set((state) => {
        const today = getTodayDateString();
        const lastActive = state.stats.lastActiveDate;
        if (lastActive === today) return state; // already logged

        let newStreak = state.stats.streak;
        if (lastActive) {
          const lastDate = new Date(lastActive);
          const currentDate = new Date(today);
          const diffDays = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
          
          if (diffDays === 1) {
            newStreak += 1; // Continued streak
          } else if (diffDays > 1) {
            newStreak = 1; // Streak broken
          }
        } else {
          newStreak = 1; // First day
        }

        return {
          stats: {
            ...state.stats,
            streak: newStreak,
            lastActiveDate: today
          }
        };
      }),

      clearAllData: () => set(() => ({
        profile: null,
        stats: {
          totalQuestionsSolved: 0,
          correctAnswers: 0,
          wrongAnswers: 0,
          studyTimeInMinutes: 0,
          streak: 0,
          lastActiveDate: '',
          dailyProgress: {},
          subjectProgress: {
            Physics: { questionsAttempted: 0, correctAnswers: 0, chapterStats: {} },
            Chemistry: { questionsAttempted: 0, correctAnswers: 0, chapterStats: {} },
            Biology: { questionsAttempted: 0, correctAnswers: 0, chapterStats: {} }
          }
        },
        bookmarks: [],
        wrongNotebook: []
      }))
    }),
    {
      name: 'neet-mastery-storage',
    }
  )
);

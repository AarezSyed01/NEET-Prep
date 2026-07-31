export type Subject = 'Physics' | 'Chemistry' | 'Biology';
export type ClassLevel = '11th' | '12th' | 'Dropper';
export type QuestionDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface UserProfile {
  name: string;
  currentClass: ClassLevel;
  targetYear: string;
  dailyStudyTarget: number; // in minutes
  examDate?: string; // custom exam date "YYYY-MM-DD"
  targetScore?: number; // target score out of 720
  email?: string; // student email
  weakSubject?: 'Physics' | 'Chemistry' | 'Biology' | 'None'; // primary focus
}

export interface Question {
  id: string;
  subject: Subject;
  chapter: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  difficulty: QuestionDifficulty;
  isPreviousYear?: boolean;
  year?: number;
}

export interface UserStats {
  totalQuestionsSolved: number;
  correctAnswers: number;
  wrongAnswers: number;
  studyTimeInMinutes: number; // total overall
  streak: number;
  lastActiveDate: string;
  dailyProgress: Record<string, number>; // date "YYYY-MM-DD" mapping to mins
  subjectProgress: Record<Subject, SubjectProgress>;
}

export interface SubjectProgress {
  questionsAttempted: number;
  correctAnswers: number;
  chapterStats: Record<string, ChapterStatus>;
}

export interface ChapterStatus {
  status: 'Mastered' | 'Improving' | 'Needs Revision' | 'Not Started';
  accuracy: number; // 0-100
}

export interface BookmarkedQuestion {
  questionId: string;
  dateBookmarked: string;
  question?: Question; // Stored question content for dynamic AI-generated questions
}

export interface AppState {
  profile: UserProfile | null;
  stats: UserStats;
  bookmarks: BookmarkedQuestion[];
  wrongNotebook: BookmarkedQuestion[]; // using same schema
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setProfile: (profile: UserProfile) => void;
  recordStudyTime: (minutes: number) => void;
  recordAnswer: (subject: Subject, chapter: string, isCorrect: boolean) => void;
  addBookmark: (question: Question) => void;
  removeBookmark: (questionId: string) => void;
  logActiveDay: () => void;
  clearAllData: () => void;
}

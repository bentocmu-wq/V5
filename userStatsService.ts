export interface UserStats {
  totalUsers: number;        // จำนวนผู้ใช้งาน application สะสม
  totalQuestions: number;    // การตอบคำถาม สะสม
  lastUpdated: Date;
}

const TOTAL_USERS_BASE = 1428;
const TOTAL_QUESTIONS_BASE = 4892;

const STORAGE_KEYS = {
  USERS_COUNT: 'nurse_kaew_total_users_v2',
  QUESTIONS_COUNT: 'nurse_kaew_total_questions_v2',
  SESSION_LOGGED: 'nurse_kaew_session_logged_v2',
};

export const getCumulativeStats = (): UserStats => {
  try {
    let users = parseInt(localStorage.getItem(STORAGE_KEYS.USERS_COUNT) || '0', 10);
    if (!users || users < TOTAL_USERS_BASE) {
      users = TOTAL_USERS_BASE;
      localStorage.setItem(STORAGE_KEYS.USERS_COUNT, users.toString());
    }

    let questions = parseInt(localStorage.getItem(STORAGE_KEYS.QUESTIONS_COUNT) || '0', 10);
    if (!questions || questions < TOTAL_QUESTIONS_BASE) {
      questions = TOTAL_QUESTIONS_BASE;
      localStorage.setItem(STORAGE_KEYS.QUESTIONS_COUNT, questions.toString());
    }

    return {
      totalUsers: users,
      totalQuestions: questions,
      lastUpdated: new Date()
    };
  } catch {
    return {
      totalUsers: TOTAL_USERS_BASE,
      totalQuestions: TOTAL_QUESTIONS_BASE,
      lastUpdated: new Date()
    };
  }
};

export const recordAppVisit = (): UserStats => {
  try {
    const isSessionLogged = sessionStorage.getItem(STORAGE_KEYS.SESSION_LOGGED);
    let currentStats = getCumulativeStats();

    if (!isSessionLogged) {
      sessionStorage.setItem(STORAGE_KEYS.SESSION_LOGGED, 'true');
      const newTotal = currentStats.totalUsers + 1;
      localStorage.setItem(STORAGE_KEYS.USERS_COUNT, newTotal.toString());
      currentStats.totalUsers = newTotal;
    }

    return currentStats;
  } catch {
    return getCumulativeStats();
  }
};

export const recordQuestionAnswered = (): UserStats => {
  try {
    const currentStats = getCumulativeStats();
    const newTotal = currentStats.totalQuestions + 1;
    localStorage.setItem(STORAGE_KEYS.QUESTIONS_COUNT, newTotal.toString());
    return {
      ...currentStats,
      totalQuestions: newTotal
    };
  } catch {
    return getCumulativeStats();
  }
};

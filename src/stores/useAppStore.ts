import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ViewId = 'dashboard' | 'quran' | 'prayer' | 'adhkar' | 'deeds' | 'community' | 'settings';

interface PrayerState {
  fajr: 'prayed' | 'late' | 'missed' | null;
  dhuhr: 'prayed' | 'late' | 'missed' | null;
  asr: 'prayed' | 'late' | 'missed' | null;
  maghrib: 'prayed' | 'late' | 'missed' | null;
  isha: 'prayed' | 'late' | 'missed' | null;
}

interface DayRecord {
  date: string;
  prayers: PrayerState;
  quranPages: number;
  quranMinutes: number;
  adhkarCount: number;
  deedsCount: number;
  spiritualState: number; // 0-100
}

interface QuranWeakness {
  [surahNum: number]: { [ayahNum: number]: number };
}

interface AppState {
  // Navigation
  currentView: ViewId;
  setView: (view: ViewId) => void;

  // User
  userName: string;
  setUserName: (name: string) => void;
  streakDays: number;
  totalActiveDays: number;
  totalLostDays: number;

  // Silent Mode
  silentMode: boolean;
  toggleSilentMode: () => void;

  // Reboot Mode
  rebootMode: boolean;
  rebootDay: number;
  toggleRebootMode: () => void;
  setRebootDay: (day: number) => void;

  // Theme
  isDark: boolean;
  toggleTheme: () => void;

  // Prayers
  todayPrayers: PrayerState;
  setPrayerStatus: (prayer: keyof PrayerState, status: 'prayed' | 'late' | 'missed') => void;
  prayerHistory: DayRecord[];
  getPrayerStreak: () => number;
  getMissedDays: () => number;

  // Quran
  quranWeakness: QuranWeakness;
  addQuranMistake: (surah: number, ayah: number) => void;
  clearQuranWeakness: (surah: number, ayah: number) => void;
  memorizedSurahs: number[];
  toggleMemorized: (surah: number) => void;
  todayQuranPages: number;
  setTodayQuranPages: (n: number) => void;
  todayQuranMinutes: number;
  setTodayQuranMinutes: (n: number) => void;

  // Adhkar
  todayAdhkarCount: number;
  incrementAdhkar: () => void;
  completedAdhkar: string[];
  markAdhkarDone: (id: string) => void;

  // Deeds
  todayDeedsCount: number;
  incrementDeeds: () => void;
  intentions: { id: string; title: string; createdAt: string; completed: boolean; completedAt?: string }[];
  addIntention: (title: string) => void;
  completeIntention: (id: string) => void;

  // Community
  companionProgress: number;
  setCompanionProgress: (n: number) => void;
  companionGoal: string;

  // Daily Record
  records: DayRecord[];
  saveTodayRecord: () => void;
  getTodayScore: () => number;
  getWeekTrend: () => number[];
}

const todayStr = () => new Date().toISOString().split('T')[0];

const emptyPrayers: PrayerState = {
  fajr: null, dhuhr: null, asr: null, maghrib: null, isha: null,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Navigation
      currentView: 'dashboard',
      setView: (view) => set({ currentView: view }),

      // User
      userName: 'مسلم',
      setUserName: (name) => set({ userName: name }),
      streakDays: 0,
      totalActiveDays: 0,
      totalLostDays: 0,

      // Silent Mode
      silentMode: false,
      toggleSilentMode: () => set((s) => ({ silentMode: !s.silentMode })),

      // Reboot Mode
      rebootMode: false,
      rebootDay: 0,
      toggleRebootMode: () => set((s) => ({ rebootMode: !s.rebootMode, rebootDay: s.rebootMode ? 0 : 1 })),
      setRebootDay: (day) => set({ rebootDay: day }),

      // Theme
      isDark: false,
      toggleTheme: () => set((s) => {
        const newDark = !s.isDark;
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', newDark);
        }
        return { isDark: newDark };
      }),

      // Prayers
      todayPrayers: { ...emptyPrayers },
      setPrayerStatus: (prayer, status) => set((s) => ({
        todayPrayers: { ...s.todayPrayers, [prayer]: status },
      })),
      prayerHistory: [],
      getPrayerStreak: () => {
        const records = get().records;
        let streak = 0;
        for (let i = records.length - 1; i >= 0; i--) {
          const r = records[i];
          const p = Object.values(r.prayers).filter(v => v === 'prayed' || v === 'late').length;
          if (p >= 3) streak++;
          else break;
        }
        return streak;
      },
      getMissedDays: () => {
        const records = get().records;
        return records.filter(r => {
          const p = Object.values(r.prayers).filter(v => v === 'missed' || v === null).length;
          return p >= 3;
        }).length;
      },

      // Quran
      quranWeakness: {},
      addQuranMistake: (surah, ayah) => set((s) => ({
        quranWeakness: {
          ...s.quranWeakness,
          [surah]: {
            ...(s.quranWeakness[surah] || {}),
            [ayah]: ((s.quranWeakness[surah]?.[ayah]) || 0) + 1,
          },
        },
      })),
      clearQuranWeakness: (surah, ayah) => set((s) => {
        const sw = { ...(s.quranWeakness[surah] || {}) };
        delete sw[ayah];
        return {
          quranWeakness: { ...s.quranWeakness, [surah]: sw },
        };
      }),
      memorizedSurahs: [],
      toggleMemorized: (surah) => set((s) => ({
        memorizedSurahs: s.memorizedSurahs.includes(surah)
          ? s.memorizedSurahs.filter(n => n !== surah)
          : [...s.memorizedSurahs, surah],
      })),
      todayQuranPages: 0,
      setTodayQuranPages: (n) => set({ todayQuranPages: n }),
      todayQuranMinutes: 0,
      setTodayQuranMinutes: (n) => set({ todayQuranMinutes: n }),

      // Adhkar
      todayAdhkarCount: 0,
      incrementAdhkar: () => set((s) => ({ todayAdhkarCount: s.todayAdhkarCount + 1 })),
      completedAdhkar: [],
      markAdhkarDone: (id) => set((s) => ({
        completedAdhkar: s.completedAdhkar.includes(id) ? s.completedAdhkar : [...s.completedAdhkar, id],
      })),

      // Deeds
      todayDeedsCount: 0,
      incrementDeeds: () => set((s) => ({ todayDeedsCount: s.todayDeedsCount + 1 })),
      intentions: [],
      addIntention: (title) => set((s) => ({
        intentions: [...s.intentions, {
          id: Date.now().toString(),
          title,
          createdAt: todayStr(),
          completed: false,
        }],
      })),
      completeIntention: (id) => set((s) => ({
        intentions: s.intentions.map(i => i.id === id ? { ...i, completed: true, completedAt: todayStr() } : i),
        todayDeedsCount: s.todayDeedsCount + 1,
      })),

      // Community
      companionProgress: 0,
      setCompanionProgress: (n) => set({ companionProgress: n }),
      companionGoal: 'حفظ سورة الإخلاص',

      // Daily Record
      records: [],
      saveTodayRecord: () => {
        const s = get();
        const prayerCount = Object.values(s.todayPrayers).filter(v => v === 'prayed' || v === 'late').length;
        const newRecord: DayRecord = {
          date: todayStr(),
          prayers: { ...s.todayPrayers },
          quranPages: s.todayQuranPages,
          quranMinutes: s.todayQuranMinutes,
          adhkarCount: s.todayAdhkarCount,
          deedsCount: s.todayDeedsCount,
          spiritualState: Math.min(100, Math.round(
            (prayerCount / 5) * 40 +
            Math.min(s.todayQuranMinutes / 15, 1) * 25 +
            Math.min(s.todayAdhkarCount / 10, 1) * 20 +
            Math.min(s.todayDeedsCount / 3, 1) * 15
          )),
        };
        const existing = s.records.findIndex(r => r.date === todayStr());
        const newRecords = [...s.records];
        if (existing >= 0) newRecords[existing] = newRecord;
        else newRecords.push(newRecord);

        const activeDays = newRecords.filter(r => r.spiritualState >= 30).length;
        const lostDays = newRecords.filter(r => r.spiritualState < 15).length;

        set({
          records: newRecords,
          totalActiveDays: activeDays,
          totalLostDays: lostDays,
          streakDays: s.getPrayerStreak(),
        });
      },
      getTodayScore: () => {
        const s = get();
        const prayerCount = Object.values(s.todayPrayers).filter(v => v === 'prayed' || v === 'late').length;
        return Math.min(100, Math.round(
          (prayerCount / 5) * 40 +
          Math.min(s.todayQuranMinutes / 15, 1) * 25 +
          Math.min(s.todayAdhkarCount / 10, 1) * 20 +
          Math.min(s.todayDeedsCount / 3, 1) * 15
        ));
      },
      getWeekTrend: () => {
        const records = get().records;
        const last7 = records.slice(-7);
        return last7.map(r => r.spiritualState);
      },
    }),
    {
      name: 'islamic-life-system',
      partialize: (state) => ({
        userName: state.userName,
        streakDays: state.streakDays,
        totalActiveDays: state.totalActiveDays,
        totalLostDays: state.totalLostDays,
        silentMode: state.silentMode,
        isDark: state.isDark,
        todayPrayers: state.todayPrayers,
        quranWeakness: state.quranWeakness,
        memorizedSurahs: state.memorizedSurahs,
        todayAdhkarCount: state.todayAdhkarCount,
        completedAdhkar: state.completedAdhkar,
        todayDeedsCount: state.todayDeedsCount,
        intentions: state.intentions,
        companionProgress: state.companionProgress,
        companionGoal: state.companionGoal,
        records: state.records,
        rebootMode: state.rebootMode,
        rebootDay: state.rebootDay,
      }),
    }
  )
);
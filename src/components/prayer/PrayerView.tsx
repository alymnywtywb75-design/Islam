'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  prayerTimes,
  getBreakReason,
  dayNames,
  getCurrentPrayer,
  getNextPrayer,
} from '@/data/prayer-data';
import type { PrayerInfo } from '@/data/prayer-data';
import { useAppStore } from '@/stores/useAppStore';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type PrayerKey = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
type PrayerStatus = 'prayed' | 'late' | 'missed' | null;

/* ------------------------------------------------------------------ */
/*  Inline SVG Icons                                                   */
/* ------------------------------------------------------------------ */

function SunIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}

function FlameIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" />
    </svg>
  );
}

function getPrayerIcon(prayer: PrayerInfo) {
  const h = Number(prayer.time.split(':')[0]);
  if (h < 6) return <MoonIcon className="text-rose-300 dark:text-rose-400" />;
  if (h < 18) return <SunIcon className="text-amber-400 dark:text-amber-500" />;
  if (h < 20) return <SunIcon className="text-orange-400 dark:text-orange-500" />;
  return <MoonIcon className="text-slate-400 dark:text-slate-300" />;
}

/* ------------------------------------------------------------------ */
/*  Animation Variants                                                 */
/* ------------------------------------------------------------------ */

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const PRAYER_KEYS: PrayerKey[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

function dotColor(status: PrayerStatus): string {
  if (status === 'prayed') return 'bg-primary';
  if (status === 'late') return 'bg-amber-400';
  if (status === 'missed') return 'bg-red-400';
  return 'bg-gray-200 dark:bg-gray-700';
}

function cardBg(status: PrayerStatus, highlighted: boolean): string {
  if (status === 'prayed')
    return 'bg-primary/5 border-primary/20';
  if (status === 'late')
    return 'bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/30';
  if (status === 'missed')
    return 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900/30';
  if (highlighted)
    return 'bg-white border-primary/30 dark:bg-gray-900/80 dark:border-primary/40 ring-2 ring-primary/10 shadow-lg shadow-primary/5';
  return 'bg-white border-gray-100 dark:bg-gray-900/50 dark:border-gray-800';
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function PrayerView() {
  /* ---- Store ---- */
  const todayPrayers = useAppStore((s) => s.todayPrayers);
  const setPrayerStatus = useAppStore((s) => s.setPrayerStatus);
  const records = useAppStore((s) => s.records);
  const getPrayerStreak = useAppStore((s) => s.getPrayerStreak);
  const getMissedDays = useAppStore((s) => s.getMissedDays);
  const totalActiveDays = useAppStore((s) => s.totalActiveDays);
  const totalLostDays = useAppStore((s) => s.totalLostDays);

  /* ---- Local state ---- */
  const [khushuValues, setKhushuValues] = useState<Record<string, number>>({});
  const [showReturnPlan, setShowReturnPlan] = useState(false);

  /* ---- Computed ---- */
  const currentPrayer = getCurrentPrayer();
  const nextPrayer = getNextPrayer();
  const streak = getPrayerStreak();
  const missedDays = getMissedDays();

  const last7Records = useMemo(() => records.slice(-7), [records]);

  const todayMissed = useMemo(() => {
    return Object.values(todayPrayers).filter((v) => v === 'missed').length;
  }, [todayPrayers]);

  const consecutiveMissed = useMemo(() => {
    let count = 0;
    for (let i = records.length - 1; i >= 0; i--) {
      const p = Object.values(records[i].prayers);
      const bad = p.filter((v) => v === 'missed' || v === null).length;
      if (bad >= 3) count++;
      else break;
    }
    return count;
  }, [records]);

  const hasMissed = todayMissed > 0 || consecutiveMissed > 0;
  const breakReason = hasMissed
    ? getBreakReason(todayMissed, consecutiveMissed)
    : '';

  /* ---- Handlers ---- */
  const getStatus = (id: string): PrayerStatus => {
    return todayPrayers[id as PrayerKey] ?? null;
  };

  const isHighlighted = (id: string) =>
    id === currentPrayer || id === nextPrayer;

  const handleStatus = (
    id: string,
    status: 'prayed' | 'late' | 'missed',
  ) => {
    setPrayerStatus(id as PrayerKey, status);
    if (status === 'prayed') {
      setKhushuValues((prev) => ({ ...prev, [id]: 7 }));
    } else {
      setKhushuValues((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  /* ================================================================ */
  /*  Render                                                           */
  /* ================================================================ */

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50/50 dark:bg-gray-950 pb-24">
      <div className="max-w-md mx-auto px-4 pt-6 space-y-8">
        {/* -------------------------------------------------------- */}
        {/*  1. Streak Counter                                        */}
        {/* -------------------------------------------------------- */}
        <motion.section
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-2"
        >
          <div className="inline-flex items-center gap-2 text-3xl font-bold text-primary">
            <FlameIcon className="text-primary" />
            {streak}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            أيام متتالية
          </p>
          <div className="flex justify-center gap-6 text-xs text-gray-400 dark:text-gray-500">
            <span>
              أيام نشطة:{' '}
              <strong className="text-primary">{totalActiveDays}</strong>
            </span>
            <span>
              أيام ضائعة:{' '}
              <strong className="text-red-400">{totalLostDays}</strong>
            </span>
          </div>
        </motion.section>

        {/* -------------------------------------------------------- */}
        {/*  2. Today's Prayer Tracker (Timeline)                     */}
        {/* -------------------------------------------------------- */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-1"
        >
          <h2 className="text-sm font-medium text-gray-400 dark:text-gray-500 mb-4 px-1">
            صلوات اليوم
          </h2>

          {prayerTimes.map((prayer, i) => {
            const status = getStatus(prayer.id);
            const highlighted = isHighlighted(prayer.id);
            const showKhushu = khushuValues[prayer.id] !== undefined;

            return (
              <motion.div
                key={prayer.id}
                variants={itemVariants}
                className="flex gap-4 items-stretch"
              >
                {/* Card */}
                <div
                  className={`flex-1 rounded-2xl border p-4 transition-all duration-300 ${cardBg(status, highlighted)}`}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getPrayerIcon(prayer)}
                      <span className="font-semibold text-gray-800 dark:text-gray-100">
                        {prayer.nameAr}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>{prayer.time}</span>
                      <span className="px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                        {prayer.rakat} ركعات
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleStatus(prayer.id, 'prayed')}
                      className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                        status === 'prayed'
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'bg-primary/10 text-primary hover:bg-primary/20'
                      }`}
                    >
                      صلّيت
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatus(prayer.id, 'late')}
                      className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                        status === 'late'
                          ? 'bg-amber-500 text-white shadow-sm'
                          : 'bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:hover:bg-amber-950/50'
                      }`}
                    >
                      تأخرت
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatus(prayer.id, 'missed')}
                      className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                        status === 'missed'
                          ? 'bg-red-500 text-white shadow-sm'
                          : 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50'
                      }`}
                    >
                      فاتت
                    </button>
                  </div>

                  {/* Khushu Meter (5) */}
                  <AnimatePresence>
                    {showKhushu && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-400">
                              مستوى الخشوع
                            </span>
                            <span className="text-xs font-medium text-primary tabular-nums" dir="ltr">
                              {khushuValues[prayer.id]}/10
                            </span>
                          </div>
                          <input
                            type="range"
                            min={1}
                            max={10}
                            value={khushuValues[prayer.id]}
                            onChange={(e) =>
                              setKhushuValues((prev) => ({
                                ...prev,
                                [prayer.id]: Number(e.target.value),
                              }))
                            }
                            className="w-full h-1.5 rounded-full appearance-none bg-gray-200 dark:bg-gray-700 accent-primary cursor-pointer"
                            dir="ltr"
                          />
                          <div
                            className="flex justify-between text-[10px] text-gray-300 dark:text-gray-600 mt-1"
                          >
                            <span>قليل</span>
                            <span>عالي</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Timeline dot + connector line */}
                <div className="flex flex-col items-center pt-6">
                  <div
                    className={`w-3 h-3 rounded-full z-10 ring-[3px] ring-white dark:ring-gray-950 transition-colors duration-300 ${dotColor(status)} ${highlighted && !status ? 'ring-primary/30 dark:ring-primary/30 scale-125' : ''}`}
                  />
                  {i < prayerTimes.length - 1 && (
                    <div className="flex-1 w-px bg-gray-200 dark:bg-gray-800 my-1" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.section>

        {/* -------------------------------------------------------- */}
        {/*  3. Prayer Life Map (7-day grid)                          */}
        {/* -------------------------------------------------------- */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="space-y-3"
        >
          <h2 className="text-sm font-medium text-gray-400 dark:text-gray-500 px-1">
            خريطة الصلاة
          </h2>
          <div className="bg-white dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
            {last7Records.length > 0 ? (
              <div className="flex justify-between gap-1">
                {last7Records.map((record) => {
                  const date = new Date(record.date + 'T00:00:00');
                  const dayIdx = date.getDay();
                  const prayers = record.prayers;

                  return (
                    <div
                      key={record.date}
                      className="flex flex-col items-center gap-1.5 min-w-[36px]"
                    >
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 whitespace-nowrap">
                        {dayNames[dayIdx]}
                      </span>
                      <span className="text-[10px] text-gray-300 dark:text-gray-600">
                        {date.getDate()}
                      </span>
                      <div className="flex flex-col gap-1.5">
                        {PRAYER_KEYS.map((key) => {
                          const s: PrayerStatus = prayers[key];
                          const color =
                            s === 'prayed'
                              ? 'bg-primary'
                              : s === 'late'
                                ? 'bg-amber-400'
                                : s === 'missed'
                                  ? 'bg-gray-400'
                                  : 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700';
                          return (
                            <div
                              key={key}
                              className={`w-2.5 h-2.5 rounded-full transition-colors duration-200 ${color}`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-xs text-gray-400 dark:text-gray-500 py-6">
                لا توجد سجلات بعد. ابدأ بتسجيل صلواتك
              </p>
            )}

            {/* Legend */}
            <div className="flex justify-center gap-4 mt-4 pt-3 border-t border-gray-50 dark:border-gray-800">
              <LegendDot color="bg-primary" label="صلّيت" />
              <LegendDot color="bg-amber-400" label="تأخرت" />
              <LegendDot color="bg-gray-400" label="فاتت" />
              <LegendDot
                color="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                label="—"
              />
            </div>
          </div>
        </motion.section>

        {/* -------------------------------------------------------- */}
        {/*  4. Break Analysis                                        */}
        {/* -------------------------------------------------------- */}
        <AnimatePresence>
          {hasMissed && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="space-y-3"
            >
              <h2 className="text-sm font-medium text-gray-400 dark:text-gray-500 px-1">
                تحليل الانقطاع
              </h2>
              <div className="bg-white dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {breakReason}
                </p>

                <button
                  type="button"
                  onClick={() => setShowReturnPlan(!showReturnPlan)}
                  className="w-full py-2.5 rounded-xl text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer"
                >
                  خطة رجوع
                </button>

                <AnimatePresence>
                  {showReturnPlan && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-3 pt-2">
                        <PlanStep
                          day="اليوم ١"
                          desc="صلِّ ثلاث صلوات على الأقل"
                          icon="🌱"
                        />
                        <PlanStep
                          day="اليوم ٢"
                          desc="صلِّ الخمس صلوات كلها"
                          icon="🌿"
                        />
                        <PlanStep
                          day="اليوم ٣"
                          desc="حافظ على الاستمرارية"
                          icon="🌳"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tiny sub-components (plain HTML + Tailwind)                       */
/* ------------------------------------------------------------------ */

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1">
      <div className={`w-2 h-2 rounded-full ${color}`} />
      <span className="text-[10px] text-gray-400">{label}</span>
    </div>
  );
}

function PlanStep({
  day,
  desc,
  icon,
}: {
  day: string;
  desc: string;
  icon: string;
}) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
      <span className="text-lg leading-none">{icon}</span>
      <div>
        <div className="text-xs font-medium text-gray-700 dark:text-gray-200">
          {day}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {desc}
        </div>
      </div>
    </div>
  );
}
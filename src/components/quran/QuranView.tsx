'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { surahs, getSurahByNumber } from '@/data/quran-data';
import { useAppStore } from '@/stores/useAppStore';
import type { Surah, Ayah } from '@/data/quran-data';

/* ───────────────────────── helpers ───────────────────────── */

function getHeatColor(mistakes: number): string {
  if (mistakes === 0) return 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700';
  if (mistakes <= 2) return 'bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700';
  return 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700';
}

function getHeatDot(mistakes: number): string {
  if (mistakes === 0) return 'bg-emerald-500';
  if (mistakes <= 2) return 'bg-amber-500';
  return 'bg-red-500';
}

function getHeatLabel(mistakes: number): string {
  if (mistakes === 0) return '';
  if (mistakes <= 2) return `${mistakes}`;
  return `${mistakes}`;
}

/* ───────────────────────── sub-components ───────────────────────── */

/** Stat counter with +/- buttons */
function StatCounter({
  label,
  value,
  onChange,
  unit,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  unit: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[11px] text-muted-foreground font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(Math.max(0, value - 1))}
          className="w-7 h-7 rounded-full border border-border/60 flex items-center justify-center text-muted-foreground hover:bg-muted active:scale-95 transition-all"
          aria-label={`تقليل ${label}`}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M5 12h14" /></svg>
        </button>
        <span className="w-10 text-center text-base font-bold tabular-nums">{value}</span>
        <button
          onClick={() => onChange(value + 1)}
          className="w-7 h-7 rounded-full border border-border/60 flex items-center justify-center text-muted-foreground hover:bg-muted active:scale-95 transition-all"
          aria-label={`زيادة ${label}`}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
        </button>
      </div>
      <span className="text-[10px] text-muted-foreground">{unit}</span>
    </div>
  );
}

/** Single surah card in the list */
function SurahCard({
  surah,
  isMemorized,
  ayahMistakes,
  onClick,
}: {
  surah: Surah;
  isMemorized: boolean;
  ayahMistakes: Record<number, number>;
  onClick: () => void;
}) {
  const weakCount = Object.values(ayahMistakes).filter((m) => m > 0).length;
  const progress = surah.ayahCount > 0 ? ((surah.ayahCount - weakCount) / surah.ayahCount) * 100 : 100;

  return (
    <motion.button
      layout
      onClick={onClick}
      className="
        w-full text-right rounded-2xl p-4
        bg-card border border-border/40
        hover:shadow-sm hover:border-primary/20
        active:scale-[0.98] transition-all duration-200
        relative overflow-hidden
      "
      whileTap={{ scale: 0.98 }}
    >
      {/* Memorization checkmark */}
      {isMemorized && (
        <div className="absolute top-3 left-3">
          <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-primary" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        {/* Number circle */}
        <div className="w-10 h-10 rounded-full bg-primary/8 flex items-center justify-center shrink-0">
          <span className="text-sm font-bold text-primary">{surah.number}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold leading-tight">{surah.name}</span>
            <span className="text-[11px] text-muted-foreground">{surah.englishName}</span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-[11px] text-muted-foreground">
              {surah.ayahCount} آية · {surah.type === 'meccan' ? 'مكية' : 'مدنية'}
            </span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-1 rounded-full bg-muted overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            width: `${progress}%`,
            backgroundColor: progress >= 80 ? 'oklch(0.52 0.1 155)' : progress >= 50 ? 'oklch(0.75 0.15 85)' : 'oklch(0.577 0.245 27.325)',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </motion.button>
  );
}

/** Single ayah row in the reader */
function AyahRow({
  ayah,
  surahNumber,
  mistakes,
  isActive,
  onSelect,
  onMarkMistake,
  onMarkMastered,
}: {
  ayah: Ayah;
  surahNumber: number;
  mistakes: number;
  isActive: boolean;
  onSelect: () => void;
  onMarkMistake: () => void;
  onMarkMastered: () => void;
}) {
  const heatClass = getHeatColor(mistakes);

  return (
    <motion.div
      layout
      className={`
        relative rounded-xl border p-4 cursor-pointer
        transition-colors duration-200
        ${isActive ? 'ring-2 ring-primary/40 ' + heatClass : heatClass}
      `}
      onClick={onSelect}
      whileHover={{ scale: 1.005 }}
      whileTap={{ scale: 0.995 }}
    >
      {/* Heat indicator dot */}
      {mistakes > 0 && (
        <div className="absolute top-2 left-2 flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${getHeatDot(mistakes)}`} />
          <span className={`text-[10px] font-bold ${getHeatDot(mistakes).replace('bg-', 'text-')}`}>
            {getHeatLabel(mistakes)}
          </span>
        </div>
      )}

      {/* Ayah number badge */}
      <div className="inline-flex items-center gap-1.5 mb-2">
        <span className="text-[11px] font-semibold text-primary/70 bg-primary/8 px-2 py-0.5 rounded-full">
          ﴿ {ayah.number} ﴾
        </span>
      </div>

      {/* Arabic text */}
      <p className="quran-text text-foreground leading-relaxed">{ayah.text}</p>

      {/* Quick action buttons - only show on hover or if there are mistakes */}
      <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMarkMistake();
          }}
          className="text-[10px] px-2 py-1 rounded-full border border-red-200 dark:border-red-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          aria-label="تسجيل خطأ"
        >
          تسجيل خطأ
        </button>
        {mistakes > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMarkMastered();
            }}
            className="text-[10px] px-2 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
            aria-label="تم الإتقان"
          >
            تم الإتقان
          </button>
        )}
      </div>
    </motion.div>
  );
}

/** Slide-up ayah detail panel */
function AyahPanel({
  ayah,
  onClose,
}: {
  ayah: Ayah;
  onClose: () => void;
}) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      {/* Panel */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed bottom-0 inset-x-0 z-50 max-h-[75vh] overflow-y-auto rounded-t-3xl bg-card border-t border-border/40 shadow-2xl"
      >
        {/* Handle */}
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-8 h-1 rounded-full bg-muted-foreground/20" />
        </div>

        <div className="px-5 pb-8 pt-2">
          {/* Ayah text */}
          <div className="mb-6">
            <p className="quran-text text-foreground text-center leading-relaxed">{ayah.text}</p>
            <p className="text-sm text-muted-foreground text-center mt-2">{ayah.translation}</p>
          </div>

          <div className="h-px bg-border/40 mb-6" />

          {/* Simple Meaning */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-5 rounded-full bg-primary" />
              <h4 className="text-sm font-bold">المعنى المبسّط</h4>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed pr-4">{ayah.simpleMeaning}</p>
          </div>

          {/* Story */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-5 rounded-full bg-gold" />
              <h4 className="text-sm font-bold">القصة والسياق</h4>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed pr-4">{ayah.story}</p>
          </div>

          {/* Application */}
          <div className="mb-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-5 rounded-full bg-emerald-500" />
              <h4 className="text-sm font-bold">التطبيق في حياتك</h4>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed pr-4">{ayah.application}</p>
          </div>
        </div>
      </motion.div>
    </>
  );
}

/** Smart Repetition section */
function SmartRepetition({
  surahNumber,
  surahName,
  ayahs,
  quranWeakness,
  onSelectAyah,
}: {
  surahNumber: number;
  surahName: string;
  ayahs: Ayah[];
  quranWeakness: Record<number, Record<number, number>>;
  onSelectAyah: (ayah: Ayah) => void;
}) {
  const surahWeakness = quranWeakness[surahNumber] || {};
  const weakAyahs = useMemo(() => {
    return ayahs
      .filter((a) => (surahWeakness[a.number] || 0) > 0)
      .sort((a, b) => (surahWeakness[b.number] || 0) - (surahWeakness[a.number] || 0));
  }, [ayahs, surahWeakness]);

  if (weakAyahs.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="mt-8"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1.5 h-5 rounded-full bg-amber-500" />
        <h3 className="text-sm font-bold">التكرار الذكي — {surahName}</h3>
        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 font-semibold">
          {weakAyahs.length} آيات
        </span>
      </div>
      <div className="space-y-2">
        <AnimatePresence>
          {weakAyahs.map((ayah) => {
            const m = surahWeakness[ayah.number] || 0;
            return (
              <motion.button
                key={ayah.number}
                layout
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onClick={() => onSelectAyah(ayah)}
                className={`
                  w-full text-right rounded-xl border p-3 flex items-start gap-3
                  transition-all hover:shadow-sm active:scale-[0.99]
                  ${getHeatColor(m)}
                `}
              >
                {/* Priority badge */}
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold
                  ${m >= 3 ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'}
                `}>
                  {m}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm quran-text leading-relaxed truncate">{ayah.text}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {m >= 3 ? 'تحتاج مراجعة عاجلة' : 'تحتاج مراجعة'}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ───────────────────────── main component ───────────────────────── */

export default function QuranView() {
  // Internal view state
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [selectedAyah, setSelectedAyah] = useState<Ayah | null>(null);

  // Store bindings
  const quranWeakness = useAppStore((s) => s.quranWeakness);
  const addQuranMistake = useAppStore((s) => s.addQuranMistake);
  const clearQuranWeakness = useAppStore((s) => s.clearQuranWeakness);
  const memorizedSurahs = useAppStore((s) => s.memorizedSurahs);
  const toggleMemorized = useAppStore((s) => s.toggleMemorized);
  const todayQuranPages = useAppStore((s) => s.todayQuranPages);
  const setTodayQuranPages = useAppStore((s) => s.setTodayQuranPages);
  const todayQuranMinutes = useAppStore((s) => s.todayQuranMinutes);
  const setTodayQuranMinutes = useAppStore((s) => s.setTodayQuranMinutes);

  // Callbacks
  const handleOpenSurah = useCallback((surah: Surah) => {
    setSelectedSurah(surah);
    setSelectedAyah(null);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedSurah(null);
    setSelectedAyah(null);
  }, []);

  const handleSelectAyah = useCallback((ayah: Ayah) => {
    setSelectedAyah(ayah);
  }, []);

  const handleClosePanel = useCallback(() => {
    setSelectedAyah(null);
  }, []);

  const handleMarkMistake = useCallback(
    (surahNumber: number, ayahNumber: number) => {
      addQuranMistake(surahNumber, ayahNumber);
    },
    [addQuranMistake]
  );

  const handleMarkMastered = useCallback(
    (surahNumber: number, ayahNumber: number) => {
      clearQuranWeakness(surahNumber, ayahNumber);
    },
    [clearQuranWeakness]
  );

  const handleToggleMemorized = useCallback(
    (surahNumber: number) => {
      toggleMemorized(surahNumber);
    },
    [toggleMemorized]
  );

  // Memorized count for stats
  const memorizedCount = useMemo(
    () => memorizedSurahs.length,
    [memorizedSurahs.length]
  );

  const totalSurahs = useMemo(() => surahs.length, []);

  return (
    <div className="px-4 pt-6 pb-4 max-w-lg mx-auto">
      <AnimatePresence mode="wait">
        {/* ═══════════════════ SURAHS LIST VIEW ═══════════════════ */}
        {!selectedSurah && (
          <motion.div
            key="surah-list"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header */}
            <div className="mb-5">
              <h1 className="text-2xl font-bold tracking-tight">القرآن الكريم</h1>
              <p className="text-sm text-muted-foreground mt-0.5">تلاوة · حفظ · مراجعة</p>
            </div>

            {/* Stats Row */}
            <div className="flex items-center justify-around py-4 px-4 rounded-2xl bg-card border border-border/40 mb-6">
              <StatCounter
                label="الصفحات"
                value={todayQuranPages}
                onChange={setTodayQuranPages}
                unit="صفحة"
              />
              <div className="w-px h-10 bg-border/40" />
              <StatCounter
                label="الدقائق"
                value={todayQuranMinutes}
                onChange={setTodayQuranMinutes}
                unit="دقيقة"
              />
              <div className="w-px h-10 bg-border/40" />
              <div className="flex flex-col items-center gap-1">
                <span className="text-[11px] text-muted-foreground font-medium">المحفوظ</span>
                <span className="text-base font-bold">
                  {memorizedCount}<span className="text-muted-foreground font-normal text-sm">/{totalSurahs}</span>
                </span>
                <span className="text-[10px] text-muted-foreground">سورة</span>
              </div>
            </div>

            {/* Surah Grid */}
            <div className="space-y-3">
              <AnimatePresence>
                {surahs.map((surah) => (
                  <motion.div
                    key={surah.number}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <SurahCard
                      surah={surah}
                      isMemorized={memorizedSurahs.includes(surah.number)}
                      ayahMistakes={quranWeakness[surah.number] || {}}
                      onClick={() => handleOpenSurah(surah)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════ SURAH READER VIEW ═══════════════════ */}
        {selectedSurah && (
          <motion.div
            key="surah-reader"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={handleBack}
                className="
                  w-9 h-9 rounded-full bg-card border border-border/40
                  flex items-center justify-center
                  hover:bg-muted active:scale-95 transition-all
                "
                aria-label="رجوع"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>

              <div className="text-center flex-1 mx-3">
                <h2 className="text-lg font-bold">{selectedSurah.name}</h2>
                <p className="text-[11px] text-muted-foreground">
                  {selectedSurah.englishName} · {selectedSurah.ayahCount} آية · {selectedSurah.type === 'meccan' ? 'مكية' : 'مدنية'}
                </p>
              </div>

              <button
                onClick={() => handleToggleMemorized(selectedSurah.number)}
                className={`
                  w-9 h-9 rounded-full border flex items-center justify-center
                  transition-all active:scale-95
                  ${memorizedSurahs.includes(selectedSurah.number)
                    ? 'bg-primary/10 border-primary/30 text-primary'
                    : 'bg-card border-border/40 text-muted-foreground hover:bg-muted'
                  }
                `}
                aria-label={memorizedSurahs.includes(selectedSurah.number) ? 'إلغاء الحفظ' : 'تعليم كمحفوظ'}
              >
                {memorizedSurahs.includes(selectedSurah.number) ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Bismillah (except for Al-Fatiha and surahs containing it naturally) */}
            {selectedSurah.number !== 1 && selectedSurah.number !== 9 && (
              <div className="text-center mb-6">
                <p className="text-lg text-primary/60 font-medium">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
              </div>
            )}

            {/* Ayahs list */}
            <div className="space-y-3">
              <AnimatePresence>
                {selectedSurah.ayahs.map((ayah) => {
                  const mistakes = quranWeakness[selectedSurah.number]?.[ayah.number] || 0;
                  return (
                    <motion.div
                      key={ayah.number}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="group"
                    >
                      <AyahRow
                        ayah={ayah}
                        surahNumber={selectedSurah.number}
                        mistakes={mistakes}
                        isActive={selectedAyah?.number === ayah.number}
                        onSelect={() => handleSelectAyah(ayah)}
                        onMarkMistake={() => handleMarkMistake(selectedSurah.number, ayah.number)}
                        onMarkMastered={() => handleMarkMastered(selectedSurah.number, ayah.number)}
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Smart Repetition */}
            <SmartRepetition
              surahNumber={selectedSurah.number}
              surahName={selectedSurah.name}
              ayahs={selectedSurah.ayahs}
              quranWeakness={quranWeakness}
              onSelectAyah={handleSelectAyah}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ayah Detail Panel */}
      <AnimatePresence>
        {selectedAyah && (
          <AyahPanel ayah={selectedAyah} onClose={handleClosePanel} />
        )}
      </AnimatePresence>
    </div>
  );
}

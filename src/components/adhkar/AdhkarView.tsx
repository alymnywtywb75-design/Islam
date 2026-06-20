'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { adhkar, moods, getAdhkarByMood, getSmartSuggestion } from '@/data/adhkar-data';
import { useAppStore } from '@/stores/useAppStore';
import type { Dhikr, MoodOption } from '@/data/adhkar-data';

export default function AdhkarView() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedDhikr, setSelectedDhikr] = useState<Dhikr | null>(null);
  const [counter, setCounter] = useState(0);
  const [pulseKey, setPulseKey] = useState(0);
  const [flashKey, setFlashKey] = useState(0);

  const incrementAdhkar = useAppStore((s) => s.incrementAdhkar);
  const completedAdhkar = useAppStore((s) => s.completedAdhkar);
  const markAdhkarDone = useAppStore((s) => s.markAdhkarDone);

  const moodRef = useRef<HTMLDivElement>(null);

  const filteredAdhkar = selectedMood
    ? getAdhkarByMood(selectedMood)
    : adhkar;

  const smartSuggestions = getSmartSuggestion(new Date().getHours());

  const handleSelectDhikr = useCallback((d: Dhikr) => {
    setSelectedDhikr(d);
    setCounter(0);
    setPulseKey(0);
    setFlashKey(0);
  }, []);

  const handleTap = useCallback(() => {
    if (!selectedDhikr) return;
    const newCount = counter + 1;
    setCounter(newCount);
    setPulseKey((k) => k + 1);
    setFlashKey((k) => k + 1);
    incrementAdhkar();

    if (newCount >= selectedDhikr.count) {
      markAdhkarDone(selectedDhikr.id);
    }
  }, [counter, selectedDhikr, incrementAdhkar, markAdhkarDone]);

  const isComplete = selectedDhikr ? counter >= selectedDhikr.count : false;
  const progress = selectedDhikr ? Math.min(counter / selectedDhikr.count, 1) : 0;

  // SVG circle math
  const circleRadius = 90;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circleCircumference * (1 - progress);

  return (
    <div className="min-h-screen bg-background pb-safe" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="px-5 pt-4 pb-3">
          <h1 className="text-xl font-semibold text-foreground tracking-tight">الأذكار</h1>
          <p className="text-xs text-muted-foreground mt-0.5">ذكّرني برحمة ربك</p>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {selectedDhikr ? (
          /* ===== COUNTER VIEW ===== */
          <motion.div
            key="counter"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] px-5"
          >
            {/* Back button */}
            <button
              onClick={() => setSelectedDhikr(null)}
              className="absolute top-20 right-5 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
              رجوع
            </button>

            {/* Flash overlay */}
            <AnimatePresence>
              {flashKey > 0 && (
                <motion.div
                  key={flashKey}
                  initial={{ opacity: 0.25 }}
                  animate={{ opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="fixed inset-0 bg-islamic pointer-events-none z-20"
                />
              )}
            </AnimatePresence>

            {/* Dhikr text */}
            <div className="text-center mb-8 px-4">
              <p className="text-2xl sm:text-3xl font-medium leading-relaxed text-foreground" style={{ lineHeight: '2.2' }}>
                {selectedDhikr.text}
              </p>
              {selectedDhikr.source && (
                <p className="text-xs text-muted-foreground mt-3 opacity-70">— {selectedDhikr.source}</p>
              )}
            </div>

            {/* Circular progress + tap area */}
            <button
              onClick={handleTap}
              className="relative w-52 h-52 flex items-center justify-center rounded-full transition-transform active:scale-95 select-none"
              aria-label="اضغط للعد"
            >
              {/* Background glow */}
              {isComplete && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute inset-0 rounded-full bg-islamic/10"
                />
              )}

              <svg width="208" height="208" className="absolute" viewBox="0 0 208 208">
                {/* Track */}
                <circle
                  cx="104"
                  cy="104"
                  r={circleRadius}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-muted/30"
                />
                {/* Progress */}
                <circle
                  cx="104"
                  cy="104"
                  r={circleRadius}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={circleCircumference}
                  strokeDashoffset={strokeDashoffset}
                  className={`transition-all duration-300 ease-out ${isComplete ? 'text-islamic' : 'text-islamic/70'}`}
                  style={{
                    transform: 'rotate(-90deg)',
                    transformOrigin: '104px 104px',
                  }}
                />
              </svg>

              {/* Counter text */}
              <div className="flex flex-col items-center gap-1 z-10">
                <span
                  key={pulseKey}
                  className={`text-5xl font-light tabular-nums text-foreground dhikr-pulse`}
                >
                  {counter}
                </span>
                <span className="text-xs text-muted-foreground">
                  من {selectedDhikr.count}
                </span>
              </div>
            </button>

            {/* Completion check */}
            <AnimatePresence>
              {isComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-8 flex items-center gap-2 px-5 py-2.5 rounded-full bg-islamic/10 border border-islamic/20"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-islamic">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-sm font-medium text-islamic">تم بحمد الله</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Benefit text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center text-sm text-muted-foreground mt-8 max-w-xs leading-relaxed"
            >
              {selectedDhikr.benefit}
            </motion.p>

            {/* Tap hint */}
            {!isComplete && (
              <p className="text-xs text-muted-foreground/50 mt-6">اضغط في أي مكان للعدّ</p>
            )}
          </motion.div>
        ) : (
          /* ===== LIST VIEW ===== */
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Mood Selector */}
            <section className="px-4 pt-4 pb-2">
              <div
                ref={moodRef}
                className="flex gap-2.5 overflow-x-auto pb-2"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {moods.map((mood: MoodOption) => (
                  <button
                    key={mood.id}
                    onClick={() => setSelectedMood(selectedMood === mood.id ? null : mood.id)}
                    className={`
                      flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium
                      transition-all duration-200 border
                      ${selectedMood === mood.id
                        ? 'bg-islamic/10 border-islamic/30 text-islamic shadow-sm'
                        : 'bg-card border-border/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                      }
                    `}
                  >
                    <span className="text-sm">{mood.emoji}</span>
                    <span>{mood.label}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Smart Suggestion Card */}
            <section className="px-4 pt-2 pb-3">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-2xl border border-islamic/15 bg-gradient-to-br from-islamic/[0.04] to-transparent p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 rounded-full bg-islamic/10 flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-islamic">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <span className="text-[11px] font-medium text-islamic/80">يقترح لك النظام</span>
                </div>
                <div className="flex flex-col gap-2">
                  {smartSuggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      onClick={() => handleSelectDhikr(suggestion)}
                      className="w-full text-right px-3 py-2.5 rounded-xl bg-card/60 hover:bg-muted/60 transition-colors border border-border/30"
                    >
                      <p className="text-sm font-medium text-foreground leading-relaxed line-clamp-2">
                        {suggestion.text}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-1">
                        {suggestion.count} مرّات
                      </p>
                    </button>
                  ))}
                </div>
              </motion.div>
            </section>

            {/* Adhkar List */}
            <section className="px-4 pb-6">
              <AnimatePresence mode="popLayout">
                {filteredAdhkar.map((dhikr: Dhikr, index: number) => {
                  const isDone = completedAdhkar.includes(dhikr.id);
                  return (
                    <motion.button
                      key={dhikr.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ delay: index * 0.03, duration: 0.3 }}
                      onClick={() => handleSelectDhikr(dhikr)}
                      className="w-full text-right px-4 py-3.5 rounded-2xl mb-2.5 border border-border/40 bg-card hover:bg-muted/50 transition-all duration-200 group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground leading-relaxed line-clamp-2">
                            {dhikr.text}
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-1.5">
                            {dhikr.count} مرّات {dhikr.source ? `· ${dhikr.source}` : ''}
                          </p>
                        </div>
                        {isDone ? (
                          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-islamic/10 flex items-center justify-center mt-0.5">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-islamic">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </div>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 text-muted-foreground/40 group-hover:text-muted-foreground/70 transition-colors mt-0.5 rotate-180">
                            <path d="M9 18l6-6-6-6" />
                          </svg>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </section>

            {/* Completed Today */}
            {completedAdhkar.length > 0 && (
              <section className="px-4 pb-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-2xl border border-border/40 bg-card p-4"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-islamic" />
                    <span className="text-xs font-medium text-foreground">تمّ اليوم</span>
                    <span className="text-xs text-muted-foreground">({completedAdhkar.length})</span>
                  </div>
                  <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto">
                    {completedAdhkar.map((id) => {
                      const d = adhkar.find((a) => a.id === id);
                      if (!d) return null;
                      return (
                        <div key={id} className="flex items-center gap-2 py-1.5">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-islamic flex-shrink-0">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span className="text-xs text-muted-foreground line-clamp-1">{d.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              </section>
            )}

            {/* Silent Reminder Note */}
            <section className="px-4 pb-8">
              <div className="flex items-center justify-center gap-2 py-3">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/40">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <p className="text-[11px] text-muted-foreground/50">
                  نظام الذكر الصمت يذكرك بدون إشعارات
                </p>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
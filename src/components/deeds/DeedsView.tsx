'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getThreeDailySuggestions } from '@/data/deeds-data';
import { useAppStore } from '@/stores/useAppStore';

const DAY_LABELS = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];

export default function DeedsView() {
  const [inputValue, setInputValue] = useState('');
  const [completedDeeds, setCompletedDeeds] = useState<Set<string>>(new Set());

  const todayDeedsCount = useAppStore((s) => s.todayDeedsCount);
  const incrementDeeds = useAppStore((s) => s.incrementDeeds);
  const intentions = useAppStore((s) => s.intentions);
  const addIntention = useAppStore((s) => s.addIntention);
  const completeIntention = useAppStore((s) => s.completeIntention);
  const records = useAppStore((s) => s.records);

  const dailySuggestions = useMemo(
    () => getThreeDailySuggestions(new Date().getDay()),
    []
  );

  const weekData = useMemo(() => {
    const today = new Date();
    const result: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const record = records.find((r) => r.date === dateStr);
      result.push(record?.deedsCount ?? 0);
    }
    return result;
  }, [records]);

  const maxDeedsThisWeek = Math.max(...weekData, 1);

  const handleAddIntention = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    addIntention(trimmed);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddIntention();
    }
  };

  const handleCompleteDeed = (id: string) => {
    if (completedDeeds.has(id)) return;
    setCompletedDeeds((prev) => new Set(prev).add(id));
    incrementDeeds();
  };

  const sortedIntentions = useMemo(() => {
    const active = intentions.filter((i) => !i.completed);
    const done = intentions.filter((i) => i.completed);
    return [...active, ...done];
  }, [intentions]);

  const spiritualImpact = Math.min(todayDeedsCount / 5, 1) * 100;
  const continuityImpact = Math.min(
    weekData.filter((d) => d > 0).length / 7,
    1
  ) * 100;

  return (
    <div className="min-h-screen bg-background pb-safe" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="px-5 pt-4 pb-3">
          <h1 className="text-xl font-semibold text-foreground tracking-tight">العمل الصالح</h1>
          <p className="text-xs text-muted-foreground mt-0.5">إنّ الله يُحبُّ المحسنين</p>
        </div>
      </header>

      <div className="px-4 pt-5 pb-8 flex flex-col gap-6">
        {/* ===== INTENTION JOURNAL ===== */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 rounded-full bg-islamic" />
            <h2 className="text-sm font-semibold text-foreground">سجلّ النيات</h2>
          </div>

          {/* Input */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="اكتب نيتك هنا..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-border/60 bg-card text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-islamic/40 focus:ring-1 focus:ring-islamic/20 transition-all"
            />
            <button
              onClick={handleAddIntention}
              disabled={!inputValue.trim()}
              className="px-4 py-2.5 rounded-xl bg-islamic text-primary-foreground text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-islamic-dark transition-colors flex-shrink-0"
            >
              أضف نية
            </button>
          </div>

          {/* Intentions List */}
          {sortedIntentions.length > 0 ? (
            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
              <AnimatePresence mode="popLayout">
                {sortedIntentions.map((intention) => (
                  <motion.div
                    key={intention.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.25 }}
                    className={`
                      flex items-center gap-3 px-3.5 py-3 rounded-xl border border-border/40 bg-card
                      ${intention.completed ? 'opacity-50' : ''}
                    `}
                  >
                    {/* Checkbox */}
                    <button
                      onClick={() => !intention.completed && completeIntention(intention.id)}
                      disabled={intention.completed}
                      className={`
                        flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200
                        ${intention.completed
                          ? 'bg-islamic border-islamic'
                          : 'border-muted-foreground/30 hover:border-islamic/50'
                        }
                      `}
                      aria-label={intention.completed ? 'تمّت النية' : 'إكمال النية'}
                    >
                      {intention.completed && (
                        <motion.svg
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </motion.svg>
                      )}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${intention.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {intention.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                        {intention.createdAt}
                        {intention.completed && intention.completedAt && ` · تمّ ${intention.completedAt}`}
                      </p>
                    </div>

                    {intention.completed && (
                      <span className="text-[10px] text-islamic font-medium flex-shrink-0">تمّت</span>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground/50 text-center py-6">
              لم تُسجّل أي نية بعد. ابدأ بكتابة نيتك الأولى.
            </p>
          )}
        </section>

        {/* ===== TODAY'S SUGGESTED DEEDS ===== */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 rounded-full bg-gold" />
            <h2 className="text-sm font-semibold text-foreground">أعمال مقترحة اليوم</h2>
          </div>

          <div className="flex flex-col gap-2.5">
            {dailySuggestions.map((deed, index) => {
              const isDone = completedDeeds.has(deed.id);
              return (
                <motion.div
                  key={deed.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.3 }}
                  className={`
                    rounded-2xl border p-4 transition-all duration-300
                    ${isDone
                      ? 'border-islamic/20 bg-islamic/[0.03]'
                      : 'border-border/40 bg-card hover:border-border/70'
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0 mt-0.5">{deed.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-foreground mb-1">{deed.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{deed.description}</p>
                    </div>
                    <button
                      onClick={() => handleCompleteDeed(deed.id)}
                      disabled={isDone}
                      className={`
                        flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 mt-0.5
                        ${isDone
                          ? 'bg-islamic/10 text-islamic border border-islamic/20'
                          : 'bg-islamic text-primary-foreground hover:bg-islamic-dark active:scale-95'
                        }
                      `}
                    >
                      {isDone ? (
                        <span className="flex items-center gap-1">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          تمّ
                        </span>
                      ) : (
                        'أنجزت'
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ===== IMPACT TRACKER ===== */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 rounded-full bg-islamic" />
            <h2 className="text-sm font-semibold text-foreground">أثر اليوم</h2>
          </div>

          <div className="rounded-2xl border border-border/40 bg-card p-4">
            {/* Count */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-2xl font-light tabular-nums text-foreground">{todayDeedsCount}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">عمل صالح اليوم</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-islamic/10 flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-islamic">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
            </div>

            {/* Spiritual Impact Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] text-muted-foreground">الأثر الروحي</span>
                <span className="text-[11px] font-medium tabular-nums text-islamic">{Math.round(spiritualImpact)}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted/60 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${spiritualImpact}%` }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full bg-gradient-to-l from-islamic to-islamic-light"
                />
              </div>
            </div>

            {/* Continuity Impact Bar */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] text-muted-foreground">الاستمرارية</span>
                <span className="text-[11px] font-medium tabular-nums text-gold">{Math.round(continuityImpact)}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted/60 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${continuityImpact}%` }}
                  transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full bg-gradient-to-l from-gold-dark to-gold"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ===== WEEKLY DEED CALENDAR ===== */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 rounded-full bg-muted-foreground/40" />
            <h2 className="text-sm font-semibold text-foreground">نشاط الأسبوع</h2>
          </div>

          <div className="rounded-2xl border border-border/40 bg-card p-4">
            <div className="flex items-end justify-between gap-2">
              {weekData.map((count, i) => {
                const isToday = i === 6;
                const hasActivity = count > 0;
                const intensity = count > 0 ? Math.max(0.25, count / maxDeedsThisWeek) : 0;

                return (
                  <div key={i} className="flex flex-col items-center gap-2 flex-1">
                    {/* Dot */}
                    <div className="relative w-8 h-8 flex items-center justify-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.06, type: 'spring', stiffness: 400, damping: 20 }}
                        className={`
                          w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                          ${isToday
                            ? 'ring-2 ring-islamic/30 ring-offset-2 ring-offset-card'
                            : ''
                          }
                          ${hasActivity
                            ? 'bg-islamic/20'
                            : 'bg-muted/40'
                          }
                        `}
                      >
                        {hasActivity && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: intensity }}
                            transition={{ delay: i * 0.06 + 0.1, duration: 0.3 }}
                            className="w-4 h-4 rounded-full bg-islamic/60"
                          />
                        )}
                      </motion.div>

                      {/* Count badge */}
                      {hasActivity && (
                        <motion.span
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.06 + 0.2 }}
                          className="absolute -top-1 -left-1 text-[9px] font-medium text-islamic bg-islamic/10 rounded-full px-1 min-w-[16px] text-center"
                        >
                          {count}
                        </motion.span>
                      )}
                    </div>

                    {/* Day label */}
                    <span className={`text-[10px] ${isToday ? 'font-semibold text-foreground' : 'text-muted-foreground/60'}`}>
                      {DAY_LABELS[i]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
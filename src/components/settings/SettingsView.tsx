'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/stores/useAppStore';

/* ─── Animations ─── */
const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};

/* ─── Toggle Switch ─── */
function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`
        relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0
        ${checked ? 'bg-primary' : 'bg-border'}
      `}
    >
      <motion.span
        className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
        initial={false}
        animate={{ left: checked ? '2px' : '20px' }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

/* ─── Section Card ─── */
function Section({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      className="rounded-2xl border border-border/50 bg-card p-5"
      {...fadeUp}
      transition={{ duration: 0.35, delay }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Profile Section ─── */
function ProfileSection() {
  const { userName, setUserName } = useAppStore();
  const [editing, setEditing] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const joinDate = useMemo(
    () =>
      new Date().toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    []
  );

  const handleSave = () => {
    if (tempName.trim()) setUserName(tempName.trim());
    setEditing(false);
  };

  return (
    <Section delay={0.1}>
      <h3 className="text-sm font-semibold text-foreground mb-4">
        الملف الشخصي
      </h3>

      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <span className="text-xl">👤</span>
        </div>
        <div className="flex-1 min-w-0">
          {editing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="flex-1 text-xs bg-background border border-border rounded-lg px-3 py-1.5
                  text-foreground outline-none focus:border-primary transition-colors"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                maxLength={30}
              />
              <button
                onClick={handleSave}
                className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-[10px] font-medium
                  active:scale-[0.97] transition-transform"
              >
                حفظ
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setTempName(userName);
                setEditing(true);
              }}
              className="w-full text-right group"
            >
              <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {userName}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                انقر لتعديل الاسم
              </p>
            </button>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-border/40">
        <p className="text-xs text-muted-foreground">
          تاريخ الانضمام: {joinDate}
        </p>
      </div>
    </Section>
  );
}

/* ─── Life Log Section ─── */
function LifeLogSection() {
  const { totalActiveDays, totalLostDays, streakDays, records } = useAppStore();

  const totalDays = totalActiveDays + totalLostDays;
  const activePercent = totalDays > 0 ? Math.round((totalActiveDays / totalDays) * 100) : 0;

  return (
    <Section delay={0.15}>
      <h3 className="text-sm font-semibold text-foreground mb-4">
        سجل العمر الحقيقي
      </h3>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="flex flex-col items-center gap-1 py-2 rounded-xl bg-primary/5">
          <span className="text-lg font-bold text-primary">{totalActiveDays}</span>
          <span className="text-[10px] text-muted-foreground">أيام نشطة</span>
        </div>
        <div className="flex flex-col items-center gap-1 py-2 rounded-xl bg-destructive/5">
          <span className="text-lg font-bold text-destructive">{totalLostDays}</span>
          <span className="text-[10px] text-muted-foreground">أيام ضائعة</span>
        </div>
        <div className="flex flex-col items-center gap-1 py-2 rounded-xl bg-gold/5">
          <span className="text-lg font-bold text-gold-dark">{streakDays}</span>
          <span className="text-[10px] text-muted-foreground">تواصل</span>
        </div>
      </div>

      {/* Visual bar */}
      {totalDays > 0 && (
        <div className="mb-4">
          <div className="h-3 rounded-full bg-border/50 overflow-hidden flex">
            <motion.div
              className="h-full bg-primary rounded-r-full"
              initial={{ width: 0 }}
              animate={{ width: `${activePercent}%` }}
              transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
            <div className="flex-1 bg-destructive/30 rounded-l-full" />
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-[10px] text-muted-foreground">نشط {activePercent}%</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive/40" />
              <span className="text-[10px] text-muted-foreground">
                ضائع {100 - activePercent}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Message */}
      <div className="pt-3 border-t border-border/40">
        <p className="text-xs text-foreground/80 leading-relaxed">
          {totalDays > 0
            ? `من ${totalDays} يوم: كنت قريباً من هدفك ${totalActiveDays} يوم، وضيعت ${totalLostDays} يوم`
            : 'لم تبدأ رحلتك بعد. اليوم هو أول أيامك'}
        </p>
      </div>
    </Section>
  );
}

/* ─── Silent Mode Section ─── */
function SilentModeSection() {
  const { silentMode, toggleSilentMode } = useAppStore();

  return (
    <Section delay={0.2}>
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0 ml-3">
          <h3 className="text-sm font-semibold text-foreground">نسخة الصمت</h3>
          <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
            التطبيق يشتغل بدون أي إشعارات. يظهر فقط عند الحاجة الحقيقية
          </p>
        </div>
        <Toggle checked={silentMode} onChange={toggleSilentMode} />
      </div>
    </Section>
  );
}

/* ─── Reboot Mode Section ─── */
function RebootModeSection() {
  const { rebootMode, rebootDay, toggleRebootMode, setRebootDay } = useAppStore();

  const rebootPlans = [
    {
      day: 1,
      tasks: ['صلّ 3 صلوات', 'اقرأ صفحة واحدة'],
    },
    {
      day: 2,
      tasks: ['صلّ كل الصلوات', '10 دقائق قرآن'],
    },
    {
      day: 3,
      tasks: ['حافظ على كل شيء', 'أضف أذكار'],
    },
  ];

  return (
    <Section delay={0.25}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1 min-w-0 ml-3">
          <h3 className="text-sm font-semibold text-foreground">
            إعادة تشغيل النفس
          </h3>
          <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
            خطة بسيطة لمن انقطع. بدون ضغط.
          </p>
        </div>
        <Toggle checked={rebootMode} onChange={toggleRebootMode} />
      </div>

      {rebootMode && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-2 mt-2 pt-3 border-t border-border/40"
        >
          <p className="text-[10px] text-muted-foreground mb-2">
            بدون ضغط. خطة بسيطة جداً.
          </p>
          {rebootPlans.map((plan) => {
            const isCurrent = rebootDay === plan.day;
            const isDone = rebootDay > plan.day;
            return (
              <button
                key={plan.day}
                onClick={() => setRebootDay(plan.day)}
                className={`
                  w-full text-right p-3 rounded-xl transition-all duration-200
                  ${
                    isDone
                      ? 'bg-primary/5 border border-primary/20'
                      : isCurrent
                        ? 'bg-primary/10 border border-primary/30'
                        : 'bg-background border border-border/50'
                  }
                `}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`
                      w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0
                      ${
                        isDone
                          ? 'bg-primary text-primary-foreground'
                          : isCurrent
                            ? 'bg-primary/20 text-primary'
                            : 'bg-border text-muted-foreground'
                      }
                    `}
                  >
                    {isDone ? '✓' : plan.day}
                  </span>
                  <span
                    className={`text-xs font-medium ${
                      isCurrent
                        ? 'text-primary'
                        : isDone
                          ? 'text-primary/70'
                          : 'text-foreground'
                    }`}
                  >
                    اليوم {plan.day}
                  </span>
                </div>
                <div className="mr-7 space-y-0.5">
                  {plan.tasks.map((task, ti) => (
                    <p
                      key={ti}
                      className={`text-[10px] ${
                        isDone ? 'text-muted-foreground line-through' : 'text-muted-foreground'
                      }`}
                    >
                      • {task}
                    </p>
                  ))}
                </div>
              </button>
            );
          })}
        </motion.div>
      )}
    </Section>
  );
}

/* ─── Theme Section ─── */
function ThemeSection() {
  const { isDark, toggleTheme } = useAppStore();

  return (
    <Section delay={0.3}>
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0 ml-3">
          <h3 className="text-sm font-semibold text-foreground">المظهر</h3>
          <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
            {isDark
              ? 'الوضع الداكن — مريح للعين في الليل'
              : 'الوضع الفاتح — مريح للعين في النهار'}
          </p>
        </div>
        <Toggle checked={isDark} onChange={toggleTheme} />
      </div>
    </Section>
  );
}

/* ─── About Section ─── */
function AboutSection() {
  return (
    <Section delay={0.35}>
      <h3 className="text-sm font-semibold text-foreground mb-3">
        حول التطبيق
      </h3>
      <div className="space-y-2">
        <p className="text-xs text-foreground/80 leading-relaxed">
          نظام الحياة الإسلامي الذكي – نسخة الجيل القادم
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          هذا ليس تطبيق. هذا نظام يعيد تشكيل حياتك اليومية.
        </p>
        <p className="text-[10px] text-muted-foreground/60 mt-3">
          صُنع بإيمان ❤️
        </p>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════
   MAIN SETTINGS COMPONENT
   ═══════════════════════════════════════════ */
export default function SettingsView() {
  return (
    <motion.div
      className="px-4 pt-6 pb-8 max-w-lg mx-auto space-y-4"
      variants={stagger}
      initial="initial"
      animate="animate"
    >
      {/* ─── Header ─── */}
      <motion.div {...fadeUp}>
        <h1 className="text-xl font-bold text-foreground">أكثر</h1>
        <p className="text-xs text-muted-foreground mt-1">إعدادات وملفك الشخصي</p>
      </motion.div>

      {/* ─── Profile ─── */}
      <ProfileSection />

      {/* ─── Life Log ─── */}
      <LifeLogSection />

      {/* ─── Silent Mode ─── */}
      <SilentModeSection />

      {/* ─── Reboot Mode ─── */}
      <RebootModeSection />

      {/* ─── Theme ─── */}
      <ThemeSection />

      {/* ─── About ─── */}
      <AboutSection />
    </motion.div>
  );
}

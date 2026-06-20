'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/stores/useAppStore';
import { prayerTimes, getCurrentPrayer, getPrayerName, dayNames } from '@/data/prayer-data';

/* ─── Animations ─── */
const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};

/* ─── Score Circle ─── */
function ScoreCircle({ score }: { score: number }) {
  const radius = 62;
  const stroke = 7;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 70
      ? 'stroke-primary'
      : score >= 40
        ? 'stroke-gold'
        : 'stroke-destructive';

  const bg =
    score >= 70
      ? 'text-primary'
      : score >= 40
        ? 'text-gold'
        : 'text-destructive';

  const label =
    score >= 70 ? 'ممتاز' : score >= 40 ? 'جيد' : score >= 20 ? 'متوسط' : 'ضعيف';

  return (
    <motion.div
      className="relative flex items-center justify-center"
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 180, damping: 22, delay: 0.15 }}
    >
      <svg width="160" height="160" viewBox="0 0 160 160">
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          className="stroke-border/40"
          strokeWidth={stroke}
        />
        <motion.circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          className={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
          transform="rotate(-90 80 80)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className={`text-4xl font-bold ${bg}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {score}
        </motion.span>
        <span className="text-xs text-muted-foreground mt-0.5">{label}</span>
      </div>
    </motion.div>
  );
}

/* ─── Quick Stat Card ─── */
function StatCard({
  icon,
  label,
  value,
  suffix,
  delay,
}: {
  icon: string;
  label: string;
  value: number | string;
  suffix: string;
  delay: number;
}) {
  return (
    <motion.div
      className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-card border border-border/50"
      {...fadeUp}
      transition={{ duration: 0.4, delay }}
    >
      <span className="text-xl">{icon}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-lg font-bold text-foreground">
        {value}
        <span className="text-xs font-normal text-muted-foreground mr-0.5">{suffix}</span>
      </span>
    </motion.div>
  );
}

/* ─── Report Section ─── */
function DayReport({ score }: { score: number }) {
  const { todayPrayers, todayQuranMinutes, todayAdhkarCount, todayDeedsCount } =
    useAppStore();

  const prayerCount = Object.values(todayPrayers).filter(
    (v) => v === 'prayed' || v === 'late'
  ).length;

  const missedPrayers = Object.entries(todayPrayers)
    .filter(([, v]) => v === 'missed' || v === null)
    .map(([k]) => getPrayerName(k));

  const doneItems: string[] = [];
  const lostItems: string[] = [];
  const gainedItems: string[] = [];

  if (prayerCount > 0) {
    doneItems.push(`صلّيت ${prayerCount} صلوات`);
    gainedItems.push(`حافظت على ${prayerCount} صلوات`);
  }
  if (todayQuranMinutes > 0) {
    doneItems.push(`قرأت القرآن ${todayQuranMinutes} دقيقة`);
    gainedItems.push(`قرأت ${todayQuranMinutes} دقيقة من القرآن`);
  }
  if (todayAdhkarCount > 0) {
    doneItems.push(`أتممت ${todayAdhkarCount} أذكار`);
    gainedItems.push(`${todayAdhkarCount} ذكر في ميزان حسناتك`);
  }
  if (todayDeedsCount > 0) {
    doneItems.push(`أنجزت ${todayDeedsCount} عمل صالح`);
    gainedItems.push(`${todayDeedsCount} عمل صالح`);
  }

  if (prayerCount < 5) missedPrayers.forEach((p) => lostItems.push(`فاتتك صلاة ${p}`));
  if (todayQuranMinutes === 0) lostItems.push('لم تقرأ القرآن');
  if (todayAdhkarCount === 0) lostItems.push('لم تُتمّ الأذكار');
  if (todayDeedsCount === 0) lostItems.push('لم تنجز أعمالاً صالحة');

  const spiritualState =
    score >= 70 ? 'جيدة' : score >= 40 ? 'متوسطة' : 'ضعيفة';

  return (
    <motion.div
      className="rounded-2xl border border-border/50 bg-card p-5"
      {...fadeUp}
      transition={{ duration: 0.4 }}
    >
      <h3 className="text-sm font-semibold text-foreground mb-4">تقرير اليوم</h3>

      {/* What was done */}
      <div className="mb-4">
        <p className="text-xs text-muted-foreground mb-1.5">ماذا فعلت اليوم؟</p>
        {doneItems.length > 0 ? (
          <ul className="space-y-1">
            {doneItems.map((item, i) => (
              <li key={i} className="text-xs text-foreground flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-muted-foreground/70">لم تبدأ بعد… ابدأ الآن</p>
        )}
      </div>

      {/* What was lost */}
      <div className="mb-4">
        <p className="text-xs text-muted-foreground mb-1.5">ماذا خسرت؟</p>
        {lostItems.length > 0 ? (
          <ul className="space-y-1">
            {lostItems.map((item, i) => (
              <li key={i} className="text-xs text-destructive/80 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-destructive/50 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-primary/80">لم تخسر شيئاً حتى الآن</p>
        )}
      </div>

      {/* What was gained */}
      <div className="mb-4">
        <p className="text-xs text-muted-foreground mb-1.5">ماذا كسبت؟</p>
        {gainedItems.length > 0 ? (
          <ul className="space-y-1">
            {gainedItems.map((item, i) => (
              <li key={i} className="text-xs text-primary flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-muted-foreground/70">ابدأ لتحصد أجراً</p>
        )}
      </div>

      {/* Spiritual state */}
      <div className="pt-3 border-t border-border/40">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              score >= 70 ? 'bg-primary' : score >= 40 ? 'bg-gold' : 'bg-destructive'
            }`}
          />
          <span className="text-xs text-foreground">
            حالتك الروحية:{' '}
            <span
              className={`font-semibold ${
                score >= 70 ? 'text-primary' : score >= 40 ? 'text-gold' : 'text-destructive'
              }`}
            >
              {spiritualState}
            </span>
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Spiritual Mirror ─── */
function SpiritualMirror() {
  const records = useAppStore((s) => s.records);

  const analysis = useMemo(() => {
    if (records.length === 0) return null;

    const avgPrayers =
      records.reduce(
        (acc, r) =>
          acc + Object.values(r.prayers).filter((v) => v === 'prayed' || v === 'late').length,
        0
      ) / records.length;

    const avgQuran =
      records.reduce((acc, r) => acc + r.quranMinutes, 0) / records.length;

    const avgAdhkar =
      records.reduce((acc, r) => acc + r.adhkarCount, 0) / records.length;

    const avgDeeds =
      records.reduce((acc, r) => acc + r.deedsCount, 0) / records.length;

    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const losses: string[] = [];

    if (avgPrayers >= 3.5) strengths.push('تحافظ على الصلاة غالباً');
    else if (avgPrayers >= 2) strengths.push('تصلّي أغلب الأحيان');
    else weaknesses.push('تُهمل الصلاة أحياناً');

    if (avgQuran >= 10) strengths.push('مواظب على قراءة القرآن');
    else if (avgQuran >= 3) strengths.push('تقرأ القرآن بين الحين والآخر');
    else weaknesses.push('تُهمل قراءة القرآن');

    if (avgAdhkar >= 5) strengths.push('حافظ على الأذكار');
    else weaknesses.push('تُهمل الأذكار غالباً');

    if (avgDeeds >= 2) strengths.push('أنجزت أعمالاً صالحة متعددة');
    else weaknesses.push('فرصة كبيرة في الأعمال الصالحة');

    if (avgPrayers < 4)
      losses.push(
        'كل صلاة تفوتك هي نور خسرته. استعِن بالله واستعدّ'
      );
    if (avgQuran < 5)
      losses.push('القرآن هو رسالة الله إليك. دقائق قليلة تكفي');
    if (avgAdhkar < 3)
      losses.push('الأذكار حصنك من الهمّ. لا تتركها');

    return { strengths, weaknesses, losses };
  }, [records]);

  if (!analysis) {
    return (
      <motion.div
        className="rounded-2xl border border-border/50 bg-card p-5"
        {...fadeUp}
      >
        <h3 className="text-sm font-semibold text-foreground mb-2">المرآة الروحية</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          مرحباً بك! لم نجمّع بيانات كافية بعد. استمر في استخدام التطبيق وسنعرض لك
          تحليلاً عميقاً لنقاط قوتك وضعفك.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="rounded-2xl border border-border/50 bg-card p-5"
      {...fadeUp}
    >
      <h3 className="text-sm font-semibold text-foreground mb-4">المرآة الروحية</h3>

      {/* Strengths */}
      {analysis.strengths.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-muted-foreground mb-1.5">نقاط قوتك</p>
          <ul className="space-y-1">
            {analysis.strengths.map((s, i) => (
              <li
                key={i}
                className="text-xs text-primary flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Weaknesses */}
      {analysis.weaknesses.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-muted-foreground mb-1.5">نقاط ضعفك</p>
          <ul className="space-y-1">
            {analysis.weaknesses.map((w, i) => (
              <li
                key={i}
                className="text-xs text-gold-dark flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                {w}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Losses */}
      {analysis.losses.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground mb-1.5">ماذا يضيع عليك؟</p>
          <ul className="space-y-1">
            {analysis.losses.map((l, i) => (
              <li
                key={i}
                className="text-xs text-destructive/70 flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-destructive/40 shrink-0" />
                {l}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}

/* ─── Daily Plan ─── */
function DailyPlan() {
  const { todayPrayers, todayQuranMinutes, todayAdhkarCount, todayDeedsCount } =
    useAppStore();

  const prayerCount = Object.values(todayPrayers).filter(
    (v) => v === 'prayed' || v === 'late'
  ).length;

  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const toggle = (i: number) =>
    setChecked((prev) => ({ ...prev, [i]: !prev[i] }));

  const plans = [
    {
      text: `صلّ ${Math.max(5 - prayerCount, 1)} صلاة على الأقل`,
      done: prayerCount >= 5,
    },
    {
      text: 'اقرأ صفحة من القرآن',
      done: todayQuranMinutes > 0,
    },
    {
      text: 'أتمم أذكار الصباح',
      done: todayAdhkarCount >= 5,
    },
    {
      text: 'أنجز عملاً صالحاً واحداً',
      done: todayDeedsCount >= 1,
    },
  ];

  return (
    <motion.div
      className="rounded-2xl border border-border/50 bg-card p-5"
      {...fadeUp}
    >
      <h3 className="text-sm font-semibold text-foreground mb-4">خطة اليوم</h3>
      <div className="space-y-3">
        {plans.map((plan, i) => {
          const isChecked = checked[i] || plan.done;
          return (
            <label
              key={i}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <button
                role="checkbox"
                aria-checked={isChecked}
                onClick={() => toggle(i)}
                className={`
                  w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0
                  transition-all duration-200
                  ${
                    isChecked
                      ? 'bg-primary border-primary'
                      : 'border-border group-hover:border-primary/50'
                  }
                `}
              >
                {isChecked && (
                  <svg
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
                  </svg>
                )}
              </button>
              <span
                className={`text-xs transition-all duration-200 ${
                  isChecked ? 'text-muted-foreground line-through' : 'text-foreground'
                }`}
              >
                {plan.text}
              </span>
            </label>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ─── Dropout Prediction ─── */
function DropoutPrediction({ score }: { score: number }) {
  const records = useAppStore((s) => s.records);

  const lowDays = useMemo(() => {
    if (records.length < 2) return false;
    const last2 = records.slice(-2);
    return last2.every((r) => r.spiritualState < 30);
  }, [records]);

  if (!lowDays && score >= 30) return null;

  return (
    <motion.div
      className="rounded-2xl border border-gold/30 bg-gold/5 p-4"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
    >
      <div className="flex items-start gap-3">
        <span className="text-lg leading-none mt-0.5">🌿</span>
        <div>
          <p className="text-xs font-semibold text-gold-dark mb-1">تنبيه لطيف</p>
          <p className="text-xs text-foreground/80 leading-relaxed">
            النظام يلاحظ تراجعاً في الأيام الأخيرة. خذ استراحة قصيرة وعُد بقوة.
            <br />
            <span className="text-muted-foreground">لا ضغط. بداية جديدة أفضل من لا شيء.</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   MAIN DASHBOARD COMPONENT
   ═══════════════════════════════════════════ */
export default function DashboardView() {
  const {
    userName,
    todayPrayers,
    todayQuranMinutes,
    todayAdhkarCount,
    todayDeedsCount,
    getTodayScore,
  } = useAppStore();

  const score = getTodayScore();
  const prayerCount = Object.values(todayPrayers).filter(
    (v) => v === 'prayed' || v === 'late'
  ).length;

  const now = new Date();
  const dayName = dayNames[now.getDay()];
  const dateStr = now.toLocaleDateString('ar-SA', {
    day: 'numeric',
    month: 'long',
  });

  const greetingMessage = useMemo(() => {
    if (score >= 80) return 'يوم ممتاز! استمر على هذا النهج';
    if (score >= 60) return 'يوم جيد، لكن مجال للتحسن';
    if (score >= 40) return 'لا بأس. كل يوم جديد هو فرصة';
    if (score >= 20) return 'ابدأ بخطوة صغيرة الآن. كل شيء يبدأ بخطوة';
    return 'يوم جديد. ابدأ من هنا وسترى الفرق';
  }, [score]);

  return (
    <motion.div
      className="px-4 pt-6 pb-8 max-w-lg mx-auto space-y-5"
      variants={stagger}
      initial="initial"
      animate="animate"
    >
      {/* ─── Greeting ─── */}
      <motion.div {...fadeUp} transition={{ duration: 0.35 }}>
        <h1 className="text-xl font-bold text-foreground leading-snug">
          مرحباً، {userName}
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          {dayName} — {dateStr}
        </p>
        <p className="text-xs text-foreground/70 mt-2 leading-relaxed">
          {greetingMessage}
        </p>
      </motion.div>

      {/* ─── Score Circle ─── */}
      <motion.div className="flex flex-col items-center py-3" {...fadeUp}>
        <ScoreCircle score={score} />
        <p className="text-[10px] text-muted-foreground mt-2">يوم الحساب المصغر</p>
      </motion.div>

      {/* ─── Quick Stats ─── */}
      <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.1 }}>
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon="🕌"
            label="الصلاة"
            value={prayerCount}
            suffix="/5"
            delay={0.15}
          />
          <StatCard
            icon="📖"
            label="القرآن"
            value={todayQuranMinutes}
            suffix="دقيقة"
            delay={0.2}
          />
          <StatCard
            icon="📿"
            label="الأذكار"
            value={todayAdhkarCount}
            suffix="مرة"
            delay={0.25}
          />
          <StatCard
            icon="🤲"
            label="الأعمال"
            value={todayDeedsCount}
            suffix="عمل"
            delay={0.3}
          />
        </div>
      </motion.div>

      {/* ─── Day Report (Mini Judgment Day) ─── */}
      <DayReport score={score} />

      {/* ─── Spiritual Mirror ─── */}
      <SpiritualMirror />

      {/* ─── Daily Plan ─── */}
      <DailyPlan />

      {/* ─── Dropout Prediction ─── */}
      <DropoutPrediction score={score} />
    </motion.div>
  );
}

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/stores/useAppStore';

/* ─── Animations ─── */
const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.07 } },
};

/* ─── Simulated Achievement ─── */
interface Achievement {
  id: string;
  text: string;
  icon: string;
  likes: number;
}

const achievements: Achievement[] = [
  { id: 'a1', text: 'ختم القرآن الكريم', icon: '📖', likes: 237 },
  { id: 'a2', text: 'صلاة 30 يوم متواصل', icon: '🕌', likes: 189 },
  { id: 'a3', text: '1000 ذكر هذا الأسبوع', icon: '📿', likes: 156 },
  { id: 'a4', text: 'صيام 3 أيام كل شهر', icon: '🌙', likes: 134 },
  { id: 'a5', text: '50 عمل صالح هذا الشهر', icon: '🤲', likes: 112 },
  { id: 'a6', text: 'حفظ 3 سور جديدة', icon: '✨', likes: 98 },
];

/* ─── Simulated Challenges ─── */
interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  days: number;
}

const weeklyChallenges: Challenge[] = [
  {
    id: 'c1',
    title: 'صلاة الضحى 5 أيام',
    description: 'صلّ ركعتين الضحى لمدة 5 أيام متتالية',
    icon: '🌅',
    days: 5,
  },
  {
    id: 'c2',
    title: 'أذكار الصباح والمساء كل يوم',
    description: 'حافظ على أذكار الصباح والمساء يومياً',
    icon: '📿',
    days: 7,
  },
  {
    id: 'c3',
    title: 'قراءة صفحة يومياً',
    description: 'اقرأ صفحة واحدة من القرآن كل يوم',
    icon: '📖',
    days: 7,
  },
];

/* ─── Worship Companion ─── */
function WorshipCompanion() {
  const { companionProgress, companionGoal } = useAppStore();
  const [localProgress, setLocalProgress] = useState(companionProgress);

  const handleUpdate = () => {
    const next = Math.min(localProgress + 10, 100);
    setLocalProgress(next);
    useAppStore.getState().setCompanionProgress(next);
  };

  return (
    <motion.div
      className="rounded-2xl border border-border/50 bg-card p-5"
      {...fadeUp}
    >
      <h3 className="text-sm font-semibold text-foreground mb-4">رفيق العبادة</h3>

      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <span className="text-lg">👤</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-foreground">
            شخص مجهول يشاركك نفس الهدف
          </p>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            الهدف: {companionGoal}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-muted-foreground">تقدّم الرفيق</span>
          <span className="text-[10px] font-medium text-primary">
            {localProgress}%
          </span>
        </div>
        <div className="h-2 rounded-full bg-border/50 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${localProgress}%` }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        </div>
      </div>

      {/* Update button */}
      <button
        onClick={handleUpdate}
        disabled={localProgress >= 100}
        className="w-full py-2 rounded-xl text-xs font-medium transition-all duration-200
          bg-primary/10 text-primary hover:bg-primary/20 active:scale-[0.98]
          disabled:opacity-40 disabled:cursor-not-allowed"
      >
        تحديث تقدمي
      </button>

      <p className="text-[10px] text-muted-foreground text-center mt-3 leading-relaxed">
        هناك شخص آخر يسعى لنفس الهدف. لست وحدك
      </p>
    </motion.div>
  );
}

/* ─── Achievement Card ─── */
function AchievementCard({ item, index }: { item: Achievement; index: number }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(item.likes);

  const handleLike = () => {
    if (liked) {
      setLikes((prev) => prev - 1);
    } else {
      setLikes((prev) => prev + 1);
    }
    setLiked(!liked);
  };

  return (
    <motion.div
      className="rounded-2xl border border-border/50 bg-card p-4 flex items-center gap-3"
      {...fadeUp}
      transition={{ duration: 0.35, delay: index * 0.05 }}
    >
      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <span className="text-base">{item.icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">شخص ما</p>
        <p className="text-xs font-medium text-foreground truncate mt-0.5">
          {item.text}
        </p>
      </div>
      <button
        onClick={handleLike}
        className="flex items-center gap-1 shrink-0 transition-transform duration-150 active:scale-90"
        aria-label="إعجاب"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={liked ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={liked ? 'text-destructive' : 'text-muted-foreground'}
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        <span className="text-[10px] text-muted-foreground">{likes}</span>
      </button>
    </motion.div>
  );
}

/* ─── Challenge Card ─── */
function ChallengeCard({ item, index }: { item: Challenge; index: number }) {
  const [joined, setJoined] = useState(false);

  return (
    <motion.div
      className="rounded-2xl border border-border/50 bg-card p-4"
      {...fadeUp}
      transition={{ duration: 0.35, delay: index * 0.05 }}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-9 h-9 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
          <span className="text-base">{item.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-foreground">تحدي: {item.title}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground">{item.days} أيام</span>
        <button
          onClick={() => setJoined(!joined)}
          className={`
            px-4 py-1.5 rounded-lg text-[10px] font-medium transition-all duration-200 active:scale-[0.97]
            ${
              joined
                ? 'bg-primary text-primary-foreground'
                : 'bg-primary/10 text-primary hover:bg-primary/20'
            }
          `}
        >
          {joined ? 'تم الانضمام ✓' : 'انضم'}
        </button>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   MAIN COMMUNITY COMPONENT
   ═══════════════════════════════════════════ */
export default function CommunityView() {
  return (
    <motion.div
      className="px-4 pt-6 pb-8 max-w-lg mx-auto space-y-5"
      variants={stagger}
      initial="initial"
      animate="animate"
    >
      {/* ─── Header ─── */}
      <motion.div {...fadeUp}>
        <h1 className="text-xl font-bold text-foreground">المجتمع</h1>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          مجتمع صامت — إنجازات وتحديات فقط
        </p>
      </motion.div>

      {/* ─── Worship Companion ─── */}
      <WorshipCompanion />

      {/* ─── Community Achievements ─── */}
      <motion.div {...fadeUp}>
        <h3 className="text-sm font-semibold text-foreground mb-3">
          إنجازات المجتمع
        </h3>
        <div className="space-y-3">
          {achievements.map((item, i) => (
            <AchievementCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </motion.div>

      {/* ─── Weekly Challenges ─── */}
      <motion.div {...fadeUp}>
        <h3 className="text-sm font-semibold text-foreground mb-3">
          تحديات الأسبوع
        </h3>
        <div className="space-y-3">
          {weeklyChallenges.map((item, i) => (
            <ChallengeCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

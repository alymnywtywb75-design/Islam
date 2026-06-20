'use client';

import { useAppStore, type ViewId } from '@/stores/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';

const navItems: { id: ViewId; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'الرئيسية', icon: 'home' },
  { id: 'quran', label: 'القرآن', icon: 'book-open' },
  { id: 'prayer', label: 'الصلاة', icon: 'moon' },
  { id: 'adhkar', label: 'الأذكار', icon: 'heart' },
  { id: 'deeds', label: 'العمل', icon: 'hand-helping' },
  { id: 'community', label: 'المجتمع', icon: 'users' },
  { id: 'settings', label: 'أكثر', icon: 'settings' },
];

function NavIcon({ name, active }: { name: string; active: boolean }) {
  const stroke = active ? 'currentColor' : 'none';
  const fill = active ? 'currentColor' : 'none';
  const sw = 1.5;

  switch (name) {
    case 'home':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          {active && <path d="M9 22V12h6v10" stroke="currentColor" fill="none" strokeWidth={sw} />}
        </svg>
      );
    case 'book-open':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      );
    case 'moon':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z" />
        </svg>
      );
    case 'heart':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      );
    case 'hand-helping':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 11V6a2 2 0 0 0-4 0" />
          <path d="M14 10V4a2 2 0 0 0-4 0v6" />
          <path d="M10 10.5V6a2 2 0 0 0-4 0v8" />
          <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
        </svg>
      );
    case 'users':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case 'settings':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { currentView, setView, silentMode, getTodayScore } = useAppStore();
  const score = getTodayScore();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-safe">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="view-enter"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      {!silentMode && (
        <nav className="fixed bottom-0 inset-x-0 z-50 border-t border-border/50 bg-background/80 backdrop-blur-xl">
          <div className="max-w-lg mx-auto px-1">
            <div className="flex items-center justify-around py-1">
              {navItems.map((item) => {
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setView(item.id)}
                    className={`
                      relative flex flex-col items-center justify-center gap-0.5
                      min-w-[44px] min-h-[52px] px-2 py-1.5 rounded-xl
                      transition-all duration-200 ease-out
                      ${isActive
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground/70'
                      }
                    `}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute -top-1 inset-x-2 h-0.5 rounded-full bg-primary"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <NavIcon name={item.icon} active={isActive} />
                    <span className={`text-[10px] leading-tight ${isActive ? 'font-semibold' : 'font-normal'}`}>
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          {/* Safe area for iPhone */}
          <div className="h-[env(safe-area-inset-bottom,0px)]" />
        </nav>
      )}

      {/* Score floating indicator */}
      <div className="fixed top-4 left-4 z-50">
        <div className={`
          flex items-center gap-2 px-3 py-1.5 rounded-full
          text-xs font-medium
          backdrop-blur-xl border border-border/50
          ${score >= 70 ? 'bg-primary/10 text-primary' :
            score >= 40 ? 'bg-gold/10 text-gold-dark' :
            'bg-destructive/10 text-destructive'}
        `}>
          <div className={`w-2 h-2 rounded-full ${
            score >= 70 ? 'bg-primary' : score >= 40 ? 'bg-gold' : 'bg-destructive'
          }`} />
          {score}%
        </div>
      </div>
    </div>
  );
}
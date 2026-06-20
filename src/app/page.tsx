'use client';

import { useAppStore } from '@/stores/useAppStore';
import AppShell from '@/components/layout/AppShell';
import DashboardView from '@/components/dashboard/DashboardView';
import QuranView from '@/components/quran/QuranView';
import PrayerView from '@/components/prayer/PrayerView';
import AdhkarView from '@/components/adhkar/AdhkarView';
import DeedsView from '@/components/deeds/DeedsView';
import CommunityView from '@/components/community/CommunityView';
import SettingsView from '@/components/settings/SettingsView';

function ViewRouter() {
  const currentView = useAppStore((s) => s.currentView);

  switch (currentView) {
    case 'dashboard':
      return <DashboardView />;
    case 'quran':
      return <QuranView />;
    case 'prayer':
      return <PrayerView />;
    case 'adhkar':
      return <AdhkarView />;
    case 'deeds':
      return <DeedsView />;
    case 'community':
      return <CommunityView />;
    case 'settings':
      return <SettingsView />;
    default:
      return <DashboardView />;
  }
}

export default function Home() {
  return (
    <AppShell>
      <ViewRouter />
    </AppShell>
  );
}
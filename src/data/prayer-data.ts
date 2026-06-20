export interface PrayerInfo {
  id: string;
  name: string;
  nameAr: string;
  time: string;
  rakat: number;
  isSunna: boolean;
}

export const prayerTimes: PrayerInfo[] = [
  { id: 'fajr', name: 'Fajr', nameAr: 'الفجر', time: '04:30', rakat: 2, isSunna: false },
  { id: 'dhuhr', name: 'Dhuhr', nameAr: 'الظهر', time: '12:15', rakat: 4, isSunna: false },
  { id: 'asr', name: 'Asr', nameAr: 'العصر', time: '15:45', rakat: 4, isSunna: false },
  { id: 'maghrib', name: 'Maghrib', nameAr: 'المغرب', time: '18:30', rakat: 3, isSunna: false },
  { id: 'isha', name: 'Isha', nameAr: 'العشاء', time: '20:00', rakat: 4, isSunna: false },
];

export const sunnaPrayers = [
  { id: 'fajr-sunna', name: 'سنة الفجر', rakat: 2, before: true, prayerId: 'fajr' },
  { id: 'dhuhr-sunna-before', name: 'سنة الظهر القبلية', rakat: 4, before: true, prayerId: 'dhuhr' },
  { id: 'dhuhr-sunna-after', name: 'سنة الظهر البعدية', rakat: 2, before: false, prayerId: 'dhuhr' },
  { id: 'maghrib-sunna', name: 'سنة المغرب', rakat: 2, before: false, prayerId: 'maghrib' },
  { id: 'isha-sunna', name: 'سنة العشاء', rakat: 2, before: false, prayerId: 'isha' },
];

export const dayNames = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

export function getCurrentPrayer(): string {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  const t = h * 60 + m;

  if (t < 270) return 'isha';
  if (t < 300) return 'fajr';
  if (t < 735) return 'dhuhr';
  if (t < 945) return 'asr';
  if (t < 1110) return 'maghrib';
  return 'isha';
}

export function getNextPrayer(): string {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  const t = h * 60 + m;

  if (t < 270) return 'fajr';
  if (t < 300) return 'dhuhr';
  if (t < 735) return 'asr';
  if (t < 945) return 'maghrib';
  if (t < 1110) return 'isha';
  return 'fajr';
}

export function getPrayerName(id: string): string {
  const p = prayerTimes.find(p => p.id === id);
  return p ? p.nameAr : id;
}

export function getBreakReason(missedCount: number, consecutiveDays: number): string {
  if (consecutiveDays <= 1) return 'يوم واحد فقط، رجوعك سهل جداً';
  if (consecutiveDays <= 3) return 'ربما شغلت أو نمت. خطة بسيطة كافية للرجوع';
  if (consecutiveDays <= 7) return 'انقطاع أسبوعي. تحتاج خطة رجوع تدريجية';
  return 'انقطاع طويل. لا تقلق، إعادة البناء تبدأ بخطوة واحدة';
}
export const suggestedDeeds = [
  {
    id: 's1',
    title: 'رسالة لأحد الوالدين',
    description: 'أرسل رسالة حب ودعاء لأحد والديك الآن',
    category: 'family',
    icon: '♥',
  },
  {
    id: 's2',
    title: 'دعاء لصديق',
    description: 'ادعُ لصديقك في سجودك بظهر الغيب',
    category: 'dua',
    icon: '🤲',
  },
  {
    id: 's3',
    title: 'صدقة صغيرة',
    description: 'تصدّق بأي مبلغ بسيط على محتاج',
    category: 'sadaqah',
    icon: '💰',
  },
  {
    id: 's4',
    title: 'إفطار صائم',
    description: 'وفّر إفطار صائم ولو بتمرة',
    category: 'sadaqah',
    icon: '🗓️',
  },
  {
    id: 's5',
    title: 'صلاة ركعتين لله',
    description: 'صلّ ركعتين تطوّعاً خالصة لوجه الله',
    category: 'prayer',
    icon: '🕌',
  },
  {
    id: 's6',
    title: 'قراءة صفحة من القرآن',
    description: 'اقرأ صفحة واحدة على الأقل من القرآن بتدبر',
    category: 'quran',
    icon: '📖',
  },
  {
    id: 's7',
    title: 'كلمة طيبة',
    description: 'قل كلمة طيبة لشخص غريب اليوم',
    category: 'kindness',
    icon: '💬',
  },
  {
    id: 's8',
    title: 'استغفار 100 مرة',
    description: 'استغفر الله 100 مرة ولو في طريقك',
    category: 'dhikr',
    icon: '🔄',
  },
  {
    id: 's9',
    title: 'زيارة مريض',
    description: 'زر مريضاً أو اتصل به ليسعدك ويُسعده',
    category: 'kindness',
    icon: '🏥',
  },
  {
    id: 's10',
    title: 'صلة رحم',
    description: 'اتصل بقريب لم تتحدث معه منذ فترة',
    category: 'family',
    icon: '👨‍👩‍👧‍👦',
  },
  {
    id: 's11',
    title: 'إزالة أذى من الطريق',
    description: 'أزل أذى عن طريق الناس ولو حجراً صغيراً',
    category: 'kindness',
    icon: '🧹',
  },
  {
    id: 's12',
    title: 'تعليم علم',
    description: 'علّم شخصاً شيئاً مفيداً تعرفه',
    category: 'knowledge',
    icon: '📚',
  },
  {
    id: 's13',
    title: 'الدعاء للمسلمين',
    description: 'ادعُ لإخوانك المسلمين في كل مكان',
    category: 'dua',
    icon: '🌍',
  },
  {
    id: 's14',
    title: 'تسبيح بعد كل صلاة',
    description: 'سبّح 33 واحمد 33 وكبّر 34 بعد كل صلاة',
    category: 'dhikr',
    icon: '📿',
  },
];

export function getDailySuggestion(dayIndex: number) {
  return suggestedDeeds[dayIndex % suggestedDeeds.length];
}

export function getThreeDailySuggestions(dayIndex: number) {
  const start = (dayIndex * 3) % suggestedDeeds.length;
  return [
    suggestedDeeds[start],
    suggestedDeeds[(start + 1) % suggestedDeeds.length],
    suggestedDeeds[(start + 2) % suggestedDeeds.length],
  ];
}
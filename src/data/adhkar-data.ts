export interface Dhikr {
  id: string;
  text: string;
  count: number;
  category: string;
  mood: string[];
  benefit: string;
  source?: string;
}

export interface MoodOption {
  id: string;
  label: string;
  emoji: string;
  color: string;
}

export const moods: MoodOption[] = [
  { id: 'sad', label: 'حزين', emoji: '😔', color: 'from-blue-400 to-blue-600' },
  { id: 'anxious', label: 'متوتر', emoji: '😰', color: 'from-amber-400 to-orange-500' },
  { id: 'lazy', label: 'خامل', emoji: '😴', color: 'from-gray-400 to-gray-500' },
  { id: 'sleep', label: 'قبل النوم', emoji: '🌙', color: 'from-indigo-400 to-purple-600' },
  { id: 'happy', label: 'سعيد', emoji: '😊', color: 'from-emerald-400 to-teal-500' },
  { id: 'thankful', label: 'شاكر', emoji: '🤲', color: 'from-yellow-400 to-amber-500' },
  { id: 'focus', label: 'تحتاج تركيز', emoji: '🧠', color: 'from-cyan-400 to-blue-500' },
  { id: 'morning', label: 'صباح', emoji: '🌅', color: 'from-orange-300 to-rose-400' },
  { id: 'evening', label: 'مساء', emoji: '🌇', color: 'from-purple-400 to-indigo-500' },
  { id: 'afterPrayer', label: 'بعد الصلاة', emoji: '🕌', color: 'from-green-400 to-emerald-600' },
];

export const adhkar: Dhikr[] = [
  // أذكار الحزن والهم
  {
    id: 'sad-1',
    text: 'حَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',
    count: 7,
    category: 'morning',
    mood: ['sad', 'anxious'],
    benefit: 'يكفيك الله كل ما أهمّك ويحمل عنك كل ثقل',
    source: 'أبو داود'
  },
  {
    id: 'sad-2',
    text: 'اللَّهُمَّ إِنِّي عَبْدُكَ ابْنُ عَبْدِكَ ابْنُ أَمَتِكَ نَاصِيَتِي بِيَدِكَ مَاضٍ فِيَّ حُكْمُكَ عَدْلٌ فِيَّ قَضَاؤُكَ',
    count: 3,
    category: 'morning',
    mood: ['sad', 'anxious', 'sleep'],
    benefit: 'سيد الاستغفار، من قالها موقناً بها فمات من يومه دخل الجنة',
    source: 'البخاري'
  },
  // أذكار التوتر والقلق
  {
    id: 'anxious-1',
    text: 'لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
    count: 7,
    category: 'evening',
    mood: ['anxious', 'sad'],
    benefit: 'دعاء يونس عليه السلام، ما دعا به مكروب إلا فرّج الله كربه',
    source: 'الأنبياء: 87'
  },
  {
    id: 'anxious-2',
    text: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
    count: 7,
    category: 'morning',
    mood: ['anxious', 'focus'],
    benefit: 'يُشعرك أن الله هو الحسب والكافي، فيطمئن قلبك',
    source: 'آل عمران: 173'
  },
  // أذكار الخمول والكسل
  {
    id: 'lazy-1',
    text: 'اللَّهُمَّ بَارِكْ لَنَا فِي رِزْقِنَا وَارْزُقْنَا مِنْ حَيْثُ لَا نَحْتَسِبُ',
    count: 3,
    category: 'morning',
    mood: ['lazy', 'happy'],
    benefit: 'يفتح لك أبواب الرزق والنشاط ويزيل الكسل',
    source: 'ابن ماجه'
  },
  {
    id: 'lazy-2',
    text: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    count: 3,
    category: 'morning',
    mood: ['lazy', 'anxious', 'focus'],
    benefit: 'لم يضرّه شيء، ويمنحك الطاقة والنشاط',
    source: 'أبو داود والترمذي'
  },
  // أذكار قبل النوم
  {
    id: 'sleep-1',
    text: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    count: 1,
    category: 'evening',
    mood: ['sleep'],
    benefit: 'تهدئة ذهنية كاملة قبل النوم ونومة هادئة',
    source: 'البخاري'
  },
  {
    id: 'sleep-2',
    text: 'سُبْحَانَ اللَّهِ',
    count: 33,
    category: 'evening',
    mood: ['sleep', 'thankful'],
    benefit: 'تُحطّ الخطايا ولو كانت مثل زبد البحر',
    source: 'مسلم'
  },
  {
    id: 'sleep-3',
    text: 'الْحَمْدُ لِلَّهِ',
    count: 33,
    category: 'evening',
    mood: ['sleep', 'thankful'],
    benefit: 'تملأ الميزان وتُرضي الرب',
    source: 'مسلم'
  },
  {
    id: 'sleep-4',
    text: 'اللَّهُ أَكْبَرُ',
    count: 34,
    category: 'evening',
    mood: ['sleep', 'thankful'],
    benefit: 'تكتمل معها التسبيحات وتُغفر الذنوب',
    source: 'مسلم'
  },
  // أذكار الصباح
  {
    id: 'morning-1',
    text: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
    count: 1,
    category: 'morning',
    mood: ['morning', 'happy', 'thankful'],
    benefit: 'تستقبل يومك باسم الله وتكون في حفظه',
    source: 'مسلم'
  },
  {
    id: 'morning-2',
    text: 'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ',
    count: 1,
    category: 'morning',
    mood: ['morning'],
    benefit: 'التوكل الكامل على الله في بداية اليوم',
    source: 'الترمذي'
  },
  {
    id: 'morning-3',
    text: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ',
    count: 1,
    category: 'morning',
    mood: ['morning', 'sad', 'anxious'],
    benefit: 'سيد الاستغفار، من قالها موقناً بها غُفر له ما تقدم من ذنبه',
    source: 'البخاري'
  },
  // أذكار المساء
  {
    id: 'evening-1',
    text: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
    count: 1,
    category: 'evening',
    mood: ['evening', 'happy', 'thankful'],
    benefit: 'تختم يومك بذكر الله وتكون في حفظه',
    source: 'مسلم'
  },
  // أذكار بعد الصلاة
  {
    id: 'prayer-1',
    text: 'أَسْتَغْفِرُ اللَّهَ',
    count: 3,
    category: 'afterPrayer',
    mood: ['afterPrayer'],
    benefit: 'الاستغفار بعد الصلاة يُكفّر الذنوب بين الصلاتين',
    source: 'مسلم'
  },
  {
    id: 'prayer-2',
    text: 'اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ',
    count: 1,
    category: 'afterPrayer',
    mood: ['afterPrayer'],
    benefit: 'يُثبّت الصلاة ويجعلها مقبولة إن شاء الله',
    source: 'مسلم'
  },
  // أذكار التركيز
  {
    id: 'focus-1',
    text: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي',
    count: 3,
    category: 'morning',
    mood: ['focus', 'anxious'],
    benefit: 'يفتح قلبك ويسهّل عليك كل أمر صعب',
    source: 'طه: 25-26'
  },
  {
    id: 'focus-2',
    text: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    count: 10,
    category: 'morning',
    mood: ['focus', 'lazy'],
    benefit: 'كنز من كنوز الجنة، تُمنح بها القوة والتركيز',
    source: 'البخاري ومسلم'
  },
  // أذكار الشكر
  {
    id: 'thankful-1',
    text: 'رَبِّ زِدْنِي عِلْمًا',
    count: 3,
    category: 'morning',
    mood: ['thankful', 'focus', 'happy'],
    benefit: 'تزداد علماً ومعرفة كلما قلتها بإخلاص',
    source: 'طه: 114'
  },
  {
    id: 'thankful-2',
    text: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    count: 10,
    category: 'morning',
    mood: ['thankful', 'happy', 'morning'],
    benefit: 'تملأ ميزانك وتفتح أبواب الخير',
    source: 'الفاتحة: 2'
  },
];

export function getAdhkarByMood(moodId: string): Dhikr[] {
  return adhkar.filter(d => d.mood.includes(moodId));
}

export function getAdhkarByCategory(category: string): Dhikr[] {
  return adhkar.filter(d => d.category === category);
}

export function getSmartSuggestion(hour: number): Dhikr[] {
  if (hour >= 4 && hour < 8) return getAdhkarByCategory('morning').slice(0, 3);
  if (hour >= 16 && hour < 20) return getAdhkarByCategory('evening').slice(0, 3);
  if (hour >= 21) return getAdhkarByMood('sleep').slice(0, 3);
  return getAdhkarByCategory('afterPrayer').slice(0, 3);
}
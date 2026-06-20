export interface Ayah {
  number: number;
  text: string;
  translation: string;
  simpleMeaning: string;
  story: string;
  application: string;
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  ayahCount: number;
  type: 'meccan' | 'medinan';
  ayahs: Ayah[];
}

export const surahs: Surah[] = [
  {
    number: 1,
    name: 'الفاتحة',
    englishName: 'Al-Fatiha',
    ayahCount: 7,
    type: 'meccan',
    ayahs: [
      {
        number: 1,
        text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        translation: 'In the name of Allah, the Most Gracious, the Most Merciful',
        simpleMeaning: 'أبدأ كل شيء باسم الله الرحمن الرحيم، فكل خير يأتي من رحمته',
        story: 'النبي ﷺ كان يبدأ كل أمر باسم الله، حتى الأكل والشرب والنوم',
        application: 'اجعل "بسم الله" عادة في بداية كل عمل يومك'
      },
      {
        number: 2,
        text: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
        translation: 'All praise is due to Allah, Lord of the worlds',
        simpleMeaning: 'كل الشكر والامتنان لله وحده، فهو رب كل شيء موجود',
        story: 'حتى الأنبياء كانوا يشكرون الله في كل لحظة، وشكر الله يزيد النعم',
        application: 'قبل ما تنام، اذكر 3 أشياء تشكر الله عليها اليوم'
      },
      {
        number: 3,
        text: 'الرَّحْمَٰنِ الرَّحِيمِ',
        translation: 'The Most Gracious, the Most Merciful',
        simpleMeaning: 'الله هو الأرحم بعباده، رحمته وسعت كل شيء',
        story: 'قال ﷺ: "إن الله كتب كتاباً قبل أن يخلق الخلق: إن رحمتي سبقت غضبي"',
        application: 'كن رحيماً بالناس كما يرحمك الله، وابدأ بنفسك'
      },
      {
        number: 4,
        text: 'مَالِكِ يَوْمِ الدِّينِ',
        translation: 'Master of the Day of Judgment',
        simpleMeaning: 'الله وحده مالك يوم الحساب، يوم يُجزى كل إنسان بما عمل',
        story: 'في هذا اليوم لا ينفع مال ولا جاه، فقط الأعمال الصالحة',
        application: 'تخيّل أنك واقف أمام الله اليوم، هل أنت راضٍ عن أفعالك؟'
      },
      {
        number: 5,
        text: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
        translation: 'You alone we worship, and You alone we ask for help',
        simpleMeaning: 'نخصك وحدك بالعبادة، ونطلب العون منك وحدك يا الله',
        story: 'هذه الآية هي أعظم آية في القرآن عند العلماء، لأنها تجمع التوحيد كله',
        application: 'في كل صلاة، قلها بقلبك حاضر، واعلم أنك تخاطب ربك مباشرة'
      },
      {
        number: 6,
        text: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
        translation: 'Guide us to the straight path',
        simpleMeaning: 'يا الله، أرشدنا وثبّتنا على الطريق الصحيح في كل لحظة',
        story: 'الصحابة كانوا يتدبرون هذه الآية ويتأثرون بها كأنها نزلت عليهم',
        application: 'كل يوم ادعُ الله أن يثبتك على الحق ويبعدك عن الباطل'
      },
      {
        number: 7,
        text: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
        translation: 'The path of those upon whom You have bestowed favor, not of those who have earned anger or of those who are astray',
        simpleMeaning: 'طريق الأنبياء والصالحين، لا طريق من غضب الله عليهم ولا الضالين',
        story: 'علماء السلف كانوا يبكون عند تلاوة هذه الآية ويسألون الله أن يجنبهم طريق الغضب والضلال',
        application: 'اختر صحبتك بعناية، فأنت تمشي معهم على نفس الطريق'
      }
    ]
  },
  {
    number: 112,
    name: 'الإخلاص',
    englishName: 'Al-Ikhlas',
    ayahCount: 4,
    type: 'meccan',
    ayahs: [
      {
        number: 1,
        text: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
        translation: 'Say, "He is Allah, the One"',
        simpleMeaning: 'قل يا محمد: الله هو الواحد الأحد، لا شريك له في ربوبيته',
        story: 'نزلت هذه السورة عندما سأل المشركون النبي ﷺ عن نسب الله',
        application: 'كلما شعرت بالوحدة، تذكّر أن الله هو الواحد الأحد الذي لا يتركك أبداً'
      },
      {
        number: 2,
        text: 'اللَّهُ الصَّمَدُ',
        translation: 'Allah, the Eternal Refuge',
        simpleMeaning: 'الله هو الذي يُقصَد في جميع الحوائج، وهو الغني عن جميع خلقه',
        story: 'الصمد يعني الذي تصمد إليه الخلائق في حوائجها، وهو غني عنهم',
        application: 'عندما تحتاج شيئاً، اصمد إلى الله أولاً قبل أي أحد'
      },
      {
        number: 3,
        text: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
        translation: 'He neither begets nor is born',
        simpleMeaning: 'الله لا يلد ولا يولد، لأن الولادة من صفات المخلوقات',
        story: 'هذه الآية تبطل عقيدة التثليث وتؤكد أن الله واحد لا شريك له',
        application: 'أخلص لله في عبادتك ولا تجعل معه شريكاً ولو في النية'
      },
      {
        number: 4,
        text: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
        translation: 'Nor is there to Him any equivalent',
        simpleMeaning: 'لا يوجد أحد يعادل الله أو يشبهه في صفاته وأفعاله',
        story: 'قال ﷺ: "تعدل ثلث القرآن" - هذه السورة وحدها تعادل ثلث القرآن',
        application: 'قراءة هذه السورة 3 مرات تُعدل ثلث القرآن، اجعلها وردك اليومي'
      }
    ]
  },
  {
    number: 113,
    name: 'الفلق',
    englishName: 'Al-Falaq',
    ayahCount: 5,
    type: 'meccan',
    ayahs: [
      {
        number: 1,
        text: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
        translation: 'Say, "I seek refuge in the Lord of daybreak"',
        simpleMeaning: 'أعوذ بالله خالق الفجر وكل ما ينشأ من ظلام إلى نور',
        story: 'كان النبي ﷺ يتعوّذ بهذه السورة من السحر والحسد والأذى',
        application: 'اقرأها صباحاً ومساءً لتتحصّن من كل شر'
      },
      {
        number: 2,
        text: 'مِن شَرِّ مَا خَلَقَ',
        translation: 'From the evil of that which He created',
        simpleMeaning: 'أستجير بالله من شر كل مخلوق قد يضرني',
        story: 'المؤمن يحفظ نفسه بالأذكار ويستعيذ بالله من شر الخلق',
        application: 'لا تخف من شيء إذا كنت مع الله، واستعذ به من كل شر'
      },
      {
        number: 3,
        text: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ',
        translation: 'And from the evil of darkness when it settles',
        simpleMeaning: 'من شر الليل إذا اشتد ظلامه وانتشر فيه ما يخاف',
        story: 'الليل كان يخيف الناس قبل الإسلام، فجاءت هذه الآية لتطمئنهم',
        application: 'إذا خفت في الليل أو شعرت بالوحدة، اقرأ المعوّذتين'
      },
      {
        number: 4,
        text: 'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ',
        translation: 'And from the evil of the blowers in knots',
        simpleMeaning: 'من شر الساحرات اللواتي ينفثن في العقد',
        story: 'لُبيد بن الأعصم سحر النبي ﷺ، فنزلت هاتان السورتان شفاءً له',
        application: 'القرآن هو الحماية الحقيقية، لا تحتاج لغيره'
      },
      {
        number: 5,
        text: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
        translation: 'And from the evil of an envier when he envies',
        simpleMeaning: 'من شر الحاسد إذا حسد وتمنى زوال النعمة عنك',
        story: 'الحسد من أخطر الأمراض القلبية، ولهذا جاءت السورة لحمايتنا منه',
        application: 'إذا حسدك أحد، لا تقلق، اقرأ المعوّذات وثق بحفظ الله'
      }
    ]
  },
  {
    number: 114,
    name: 'الناس',
    englishName: 'An-Nas',
    ayahCount: 6,
    type: 'meccan',
    ayahs: [
      {
        number: 1,
        text: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
        translation: 'Say, "I seek refuge in the Lord of mankind"',
        simpleMeaning: 'أعوذ برب البشر جميعاً، مالكهم ومدبّر أمرهم',
        story: 'الله هو رب الناس، يرحمهم ويعطف عليهم أكثر من أمهاتهم',
        application: 'تذكّر أن الله هو ربك، وهو أرحم بك من نفسك'
      },
      {
        number: 2,
        text: 'مَلِكِ النَّاسِ',
        translation: 'The Sovereign of mankind',
        simpleMeaning: 'الله هو المالك الحقيقي للناس، يتصرف فيهم بما يشاء',
        story: 'لا ملك حقيقي إلا لله، وكل ملك في الدنيا زائل',
        application: 'لا تخضع إلا لله، وهو وحده الذي يستحق الطاعة المطلقة'
      },
      {
        number: 3,
        text: 'إِلَٰهِ النَّاسِ',
        translation: 'The God of mankind',
        simpleMeaning: 'الله هو الإله الحق الذي يُعبَد وحده لا شريك له',
        story: 'كل ما تُعبَد من دون الله باطل، وهو الإله الحق',
        application: 'اجعل قلبك معلقاً بالله وحده، لا بأي شيء سواه'
      },
      {
        number: 4,
        text: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ',
        translation: 'From the evil of the retreating whisperer',
        simpleMeaning: 'من شر الشيطان الذي يوسوس في صدور الناس ثم ينس retreated',
        story: 'الشيطان يجري من ابن آدم مجرى الدم، لكنه ينهزم بالاستعاذة',
        application: 'عندما تأتيك وسوسة، قل أعوذ بالله من الشيطان الرجيم'
      },
      {
        number: 5,
        text: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ',
        translation: 'Who whispers in the breasts of mankind',
        simpleMeaning: 'الشيطان يُلقي الوساوس والشكوك في قلوب الناس',
        story: 'لا أحد يسلم من الوسواس، حتى الأنبياء كانوا يستعيذون منه',
        application: 'لا تحزن من الوساوس، إنما تحزن من الاستجابة لها'
      },
      {
        number: 6,
        text: 'مِنَ الْجِنَّةِ وَالنَّاسِ',
        translation: 'From among the jinn and mankind',
        simpleMeaning: 'الوسواس قد يكون من الجن أو من بني آدم',
        story: 'ليس كل شر من الشيطان، بعض الناس يوسوسون في قلوب غيرهم',
        application: 'احفظ قلبك من وساوس الإنس والجن بالذكر والاستعاذة'
      }
    ]
  },
  {
    number: 108,
    name: 'الكوثر',
    englishName: 'Al-Kawthar',
    ayahCount: 3,
    type: 'meccan',
    ayahs: [
      {
        number: 1,
        text: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ',
        translation: 'Indeed, We have granted you Al-Kawthar',
        simpleMeaning: 'أعطيناك يا محمد الخير الكثير، نهر في الجنة',
        story: 'لما مات ابن النبي ﷺ، قال المشركون: انقطع نسل محمد. فأنزل الله هذه السورة',
        application: 'لا تحزن على خسارة في الدنيا، فإن الله عوّض النبي ﷺ خيراً كثيراً'
      },
      {
        number: 2,
        text: 'فَصَلِّ لِرَبِّكَ وَانْحَرْ',
        translation: 'So pray to your Lord and sacrifice',
        simpleMeaning: 'فصلِّ لربك شكراً على نعمته وانحر تأدباً له',
        story: 'النبي ﷺ كان يصلي الضحى ويضحي شكراً لله على نعمة الكوثر',
        application: 'صلِّ صلاة الضحى ولو ركعتين شكراً لله على نعمه'
      },
      {
        number: 3,
        text: 'إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ',
        translation: 'Indeed, your enemy is the one cut off',
        simpleMeaning: 'إن مبغضك هو المنقطع الخير، لا أنت',
        story: 'بعد نزول هذه السورة، انقطع نسل كل من عادى النبي ﷺ وبقي ذكره إلى الأبد',
        application: 'لا تقلق من أعدائك، فالله يحفظك وهم المنقطعون'
      }
    ]
  },
  {
    number: 99,
    name: 'الزلزلة',
    englishName: 'Az-Zalzalah',
    ayahCount: 8,
    type: 'medinan',
    ayahs: [
      {
        number: 1,
        text: 'إِذَا زُلْزِلَتِ الْأَرْضُ زِلْزَالَهَا',
        translation: 'When the earth is shaken with its final earthquake',
        simpleMeaning: 'عندما تضطرب الأرض اضطراباً شديداً يوم القيامة',
        story: 'يوم القيامة تتزلزل الأرض وتخرج ما فيها من أثقال',
        application: 'تخيّل هذا المشهد العظيم واعمل لذلك اليوم'
      },
      {
        number: 2,
        text: 'وَأَخْرَجَتِ الْأَرْضُ أَثْقَالَهَا',
        translation: 'And the earth discharges its burdens',
        simpleMeaning: 'الأرض تُخرج كل ما بداخلها من موتى وكنوز',
        story: 'كل إنسان يخرج من الأرض كما دخلها، والله يعلم ما فعلت يده',
        application: 'اعلم أن كل عملك مسجّل، وستُخرجه الأرض يوم القيامة'
      },
      {
        number: 3,
        text: 'وَقَالَ الْإِنسَانُ مَا لَهَا',
        translation: 'And the man says, "What is wrong with it?"',
        simpleMeaning: 'الإنسان يتعجب ويقول: ما الذي حدث للأرض؟',
        story: 'في هذا اليوم ينسى الإنسان كل شيء من شدة الرعب',
        application: 'لا تنشغل بالدنيا عن الآخرة، فالأمر أكبر مما تتخيل'
      },
      {
        number: 4,
        text: 'يَوْمَئِذٍ تُحَدِّثُ أَخْبَارَهَا',
        translation: 'That Day, it will report its news',
        simpleMeaning: 'في ذلك اليوم تخبر الأرض بما حدث عليها',
        story: 'كل أرض ستشهد على ما عُمل عليها من خير أو شر',
        application: 'المكان الذي تصلي فيه يشهد لك، فاختر مكان صلاتك بعناية'
      },
      {
        number: 5,
        text: 'بِأَنَّ رَبَّكَ أَوْحَىٰ لَهَا',
        translation: 'Because your Lord has commanded it',
        simpleMeaning: 'لأن ربك أمرها أن تتكلم وتخبر',
        story: 'الله هو الذي يأمر الأرض أن تتكلم، فلا إله إلا الله',
        application: 'تذكّر أن الله على كل شيء قدير، وهو يحفظ عليك كل شيء'
      },
      {
        number: 6,
        text: 'يَوْمَئِذٍ يَصْدُرُ النَّاسُ أَشْتَاتًا لِّيُرَوْا أَعْمَالَهُمْ',
        translation: 'That Day, the people will depart separated to show their deeds',
        simpleMeaning: 'في ذلك اليوم يتفرق الناس لرؤية أعمالهم',
        story: 'كل إنسان ينظر في كتاب أعماله، الشقي والسعيد',
        application: 'اعمل اليوم عملاً تحب أن تراه في كتاب أعمالك غداً'
      },
      {
        number: 7,
        text: 'فَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ',
        translation: 'So whoever does an atom\'s weight of good will see it',
        simpleMeaning: 'من عمل خيراً ولو قليلاً جداً سيجازه الله عليه',
        story: 'قال ﷺ: "لا تحقرن من المعروف شيئاً ولو أن تلقى أخاك بوجه طلق"',
        application: 'لا تستصغر أي عمل صالح، فالله يراه ويجازي عليه'
      },
      {
        number: 8,
        text: 'وَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ شَرًّا يَرَهُ',
        translation: 'And whoever does an atom\'s weight of evil will see it',
        simpleMeaning: 'ومن عمل شراً ولو قليلاً سيجازى عليه',
        story: 'الله لا يظلم مثقال ذرة، والحساب دقيق جداً',
        application: 'احذر من الصغائر، فإنها تُحاسَب عليها يوم القيامة'
      }
    ]
  }
];

export function getSurahByNumber(num: number): Surah | undefined {
  return surahs.find(s => s.number === num);
}

export function getAllSurahNames(): { number: number; name: string; ayahCount: number; type: string }[] {
  return surahs.map(s => ({
    number: s.number,
    name: s.name,
    ayahCount: s.ayahCount,
    type: s.type
  }));
}
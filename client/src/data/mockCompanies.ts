export const mockCompanies = {
  1: {
    id: '1',
    name: 'مطعم البيت الدمشقي',
    description: 'نحن في مطعم البيت الدمشقي نقدم أشهى وألذ المأكولات الشامية التقليدية. يتميز مطعمنا بأجواء دمشقية أصيلة وخدمة راقية. نستخدم أجود أنواع المكونات ونتبع وصفات تقليدية متوارثة عبر الأجيال.',
    logo: '/images/companies/damascus-house.jpg',
    website: 'https://damascus-house.example.com',
    rating: 4.8,
    totalReviews: 1250,
    ratingDistribution: {
      5: 800,
      4: 300,
      3: 100,
      2: 30,
      1: 20
    },
    responseRate: 95,
    verified: true,
    premiumFeatures: true,
    categories: ['مطاعم', 'مأكولات شامية'],
    location: 'الرياض - حي العليا',
    workingHours: 'من 11 صباحاً حتى 12 منتصف الليل',
    contactInfo: {
      phone: '+966 11 234 5678',
      email: 'info@damascus-house.example.com',
      social: {
        instagram: '@damascus_house',
        twitter: '@damascus_house'
      }
    },
    reviews: [
      {
        id: '1',
        rating: 5,
        title: 'أفضل شاورما في الرياض',
        content: 'تجربة رائعة! الطعام لذيذ جداً والخدمة ممتازة. أنصح الجميع بتجربة الشاورما والفتة.',
        createdAt: '2025-02-08',
        user: {
          name: 'محمد أحمد',
          image: '/images/avatars/user1.jpg'
        },
        companyResponse: true
      }
    ]
  },
  2: {
    id: '2',
    name: 'شركة التقنية المتطورة',
    description: 'شركة رائدة في مجال التقنية وتطوير البرمجيات. نقدم حلولاً تقنية متكاملة للشركات والمؤسسات. خبرة تمتد لأكثر من 10 سنوات في السوق السعودي.',
    logo: '/images/companies/tech-advanced.jpg',
    website: 'https://tech-advanced.example.com',
    rating: 4.6,
    totalReviews: 890,
    ratingDistribution: {
      5: 500,
      4: 250,
      3: 100,
      2: 30,
      1: 10
    },
    responseRate: 88,
    verified: true,
    premiumFeatures: true,
    categories: ['تقنية', 'برمجيات'],
    location: 'الرياض - طريق الملك فهد',
    workingHours: 'من الأحد إلى الخميس، 9 صباحاً - 5 مساءً',
    contactInfo: {
      phone: '+966 11 987 6543',
      email: 'info@tech-advanced.example.com',
      social: {
        linkedin: '@tech_advanced',
        twitter: '@tech_advanced_sa'
      }
    },
    reviews: [
      {
        id: '2',
        rating: 4,
        title: 'خدمة احترافية وحلول مبتكرة',
        content: 'خدمة عملاء محترفة وحلول تقنية متميزة. ساعدونا في تطوير موقعنا الإلكتروني بشكل احترافي.',
        createdAt: '2025-02-07',
        user: {
          name: 'سارة خالد',
          image: '/images/avatars/user2.jpg'
        },
        companyResponse: true
      }
    ]
  },
  3: {
    id: '3',
    name: 'فندق النخبة',
    description: 'فندق فاخر 5 نجوم يقدم تجربة إقامة استثنائية في قلب مدينة الرياض. نوفر غرفاً وأجنحة فاخرة مع إطلالات رائعة على المدينة.',
    logo: '/images/companies/elite-hotel.jpg',
    website: 'https://elite-hotel.example.com',
    rating: 4.9,
    totalReviews: 2100,
    ratingDistribution: {
      5: 1500,
      4: 400,
      3: 150,
      2: 30,
      1: 20
    },
    responseRate: 92,
    verified: true,
    premiumFeatures: true,
    categories: ['فنادق', 'سياحة'],
    location: 'الرياض - حي الملقا',
    workingHours: '24 ساعة',
    contactInfo: {
      phone: '+966 11 345 6789',
      email: 'info@elite-hotel.example.com',
      social: {
        instagram: '@elite_hotel',
        twitter: '@elite_hotel_sa'
      }
    },
    reviews: [
      {
        id: '3',
        rating: 5,
        title: 'تجربة إقامة لا تُنسى',
        content: 'إقامة لا تُنسى! الغرف فاخرة والإطلالة رائعة. الموظفون ودودون والخدمات متكاملة.',
        createdAt: '2025-02-06',
        user: {
          name: 'فهد العتيبي',
          image: '/images/avatars/user3.jpg'
        },
        companyResponse: true
      }
    ]
  },
  4: {
    id: '4',
    name: 'عقارات المستقبل',
    description: 'شركة عقارات المستقبل هي واحدة من أكبر الشركات العقارية في المملكة. نقدم خدمات شاملة في مجال العقارات تشمل البيع والشراء والتأجير والتطوير العقاري. نمتلك محفظة متنوعة من العقارات السكنية والتجارية في أفضل المواقع.',
    logo: '/images/companies/future-realty.jpg',
    website: 'https://future-realty.example.com',
    rating: 4.7,
    totalReviews: 567,
    ratingDistribution: {
      5: 300,
      4: 200,
      3: 47,
      2: 15,
      1: 5
    },
    responseRate: 95,
    verified: true,
    premiumFeatures: true,
    categories: ['عقارات', 'استثمار'],
    location: 'الرياض - طريق الملك فهد',
    workingHours: 'من الأحد إلى الخميس، 9 صباحاً - 6 مساءً',
    contactInfo: {
      phone: '+966 11 456 7890',
      email: 'info@future-realty.example.com',
      social: {
        instagram: '@future_realty',
        twitter: '@future_realty_sa',
        linkedin: '@future-realty'
      }
    },
    reviews: [
      {
        id: '4',
        rating: 5,
        title: 'خدمة احترافية وسرعة في الإنجاز',
        content: 'تجربتي مع عقارات المستقبل كانت ممتازة. الفريق محترف جداً وساعدني في إيجاد العقار المناسب بسرعة. الأسعار منافسة والخدمة ممتازة.',
        createdAt: '2025-02-05',
        user: {
          name: 'عبدالله الشمري',
          image: '/images/avatars/user4.jpg'
        },
        companyResponse: true
      },
      {
        id: '5',
        rating: 4,
        title: 'تجربة جيدة في الاستثمار العقاري',
        content: 'استثمرت معهم في مشروع سكني وكانت التجربة جيدة. الشفافية في التعامل والمتابعة المستمرة من أهم ما يميزهم.',
        createdAt: '2025-02-04',
        user: {
          name: 'نورة السعيد',
          image: '/images/avatars/user5.jpg'
        },
        companyResponse: true
      }
    ]
  },
  '789': {
    id: '789',
    name: 'مركز الرياض للتسوق',
    description: 'وجهتك الأولى للتسوق الراقي',
    logo: '/images/companies/riyadh-mall.jpg',
    website: 'https://riyadh-mall.example.com',
    rating: 4.5,
    totalReviews: 850,
    ratingDistribution: {
      5: 500,
      4: 200,
      3: 100,
      2: 30,
      1: 20
    },
    responseRate: 90,
    verified: true,
    premiumFeatures: true,
    categories: ['تسوق', 'مراكز تسوق'],
    location: 'الرياض - حي الملقا',
    workingHours: 'من 10 صباحاً حتى 11 مساءً',
    contactInfo: {
      phone: '+966 11 123 4567',
      email: 'info@riyadh-mall.example.com',
      social: {
        instagram: '@riyadh_mall',
        twitter: '@riyadh_mall'
      }
    },
    reviews: []
  },
  '1432': {
    id: '1432',
    name: 'مستشفى الشفاء',
    description: 'رعاية صحية متكاملة',
    logo: '/images/companies/alshifa-hospital.jpg',
    website: 'https://alshifa-hospital.example.com',
    rating: 4.7,
    totalReviews: 1200,
    ratingDistribution: {
      5: 700,
      4: 300,
      3: 150,
      2: 30,
      1: 20
    },
    responseRate: 95,
    verified: true,
    premiumFeatures: true,
    categories: ['صحة', 'مستشفيات'],
    location: 'الرياض - حي الورود',
    workingHours: '24 ساعة',
    contactInfo: {
      phone: '+966 11 987 6543',
      email: 'info@alshifa-hospital.example.com',
      social: {
        instagram: '@alshifa_hospital',
        twitter: '@alshifa_hospital'
      }
    },
    reviews: []
  },
  '567': {
    id: '567',
    name: 'أكاديمية التعليم',
    description: 'نبني مستقبل أجيال',
    logo: '/images/companies/education-academy.jpg',
    website: 'https://education-academy.example.com',
    rating: 4.6,
    totalReviews: 950,
    ratingDistribution: {
      5: 600,
      4: 200,
      3: 100,
      2: 30,
      1: 20
    },
    responseRate: 92,
    verified: true,
    premiumFeatures: true,
    categories: ['تعليم', 'أكاديميات'],
    location: 'الرياض - حي النزهة',
    workingHours: 'من 7 صباحاً حتى 5 مساءً',
    contactInfo: {
      phone: '+966 11 456 7890',
      email: 'info@education-academy.example.com',
      social: {
        instagram: '@education_academy',
        twitter: '@education_academy'
      }
    },
    reviews: []
  }
};

// بيانات افتراضية للشركات والمقالات
export const sampleCompanies = [
  {
    id: 'company-1',
    name: 'مطعم الشرق',
    description: 'أشهى المأكولات الشرقية التقليدية في المملكة',
    logo_url: '/images/companies/restaurant-1-logo.jpg',
    cover_image: '/images/companies/restaurant-1-cover.jpg',
    images: [
      {
        url: '/images/companies/restaurant-1-1.jpg',
        alt: 'صالة الطعام الرئيسية',
        title: 'صالة الطعام الرئيسية'
      },
      {
        url: '/images/companies/restaurant-1-2.jpg',
        alt: 'المطبخ',
        title: 'المطبخ المفتوح'
      },
      {
        url: '/images/companies/restaurant-1-3.jpg',
        alt: 'أطباق شرقية',
        title: 'تشكيلة من أشهى الأطباق الشرقية'
      }
    ],
    categories: ['مطاعم', 'مأكولات شرقية'],
    location: 'الرياض',
    rating: 4.5,
    total_reviews: 128,
    website: 'https://eastern-restaurant.com',
    phone: '+966500000000',
    working_hours: {
      sunday: '10:00 - 23:00',
      monday: '10:00 - 23:00',
      tuesday: '10:00 - 23:00',
      wednesday: '10:00 - 23:00',
      thursday: '10:00 - 00:00',
      friday: '13:00 - 00:00',
      saturday: '10:00 - 23:00'
    }
  },
  {
    id: 'company-2',
    name: 'فندق النخبة',
    description: 'فندق فاخر يوفر أعلى مستويات الراحة والرفاهية',
    logo_url: '/images/companies/hotel-1-logo.jpg',
    cover_image: '/images/companies/hotel-1-cover.jpg',
    images: [
      {
        url: '/images/companies/hotel-1-1.jpg',
        alt: 'البهو الرئيسي',
        title: 'البهو الرئيسي الفاخر'
      },
      {
        url: '/images/companies/hotel-1-2.jpg',
        alt: 'الغرف',
        title: 'غرف فاخرة مع إطلالات رائعة'
      },
      {
        url: '/images/companies/hotel-1-3.jpg',
        alt: 'المسبح',
        title: 'مسبح خارجي مع جلسات استرخاء'
      }
    ],
    categories: ['فنادق', 'سياحة'],
    location: 'جدة',
    rating: 4.8,
    total_reviews: 256,
    website: 'https://elite-hotel.com',
    phone: '+966500000001',
    working_hours: {
      sunday: '24/7',
      monday: '24/7',
      tuesday: '24/7',
      wednesday: '24/7',
      thursday: '24/7',
      friday: '24/7',
      saturday: '24/7'
    }
  }
];

export const sampleArticles = [
  {
    id: 'article-1',
    title: 'كيف تختار أفضل مطعم لتناول الطعام؟',
    content: 'نصائح مهمة لاختيار المطعم المناسب...',
    image: '/images/articles/restaurant-guide.jpg',
    author: {
      name: 'أحمد محمد',
      avatar: '/images/authors/ahmed.jpg'
    },
    created_at: '2024-02-01',
    category: 'مطاعم',
    tags: ['مطاعم', 'طعام', 'نصائح']
  },
  {
    id: 'article-2',
    title: 'دليلك الشامل للسياحة في المملكة',
    content: 'اكتشف أجمل الوجهات السياحية...',
    image: '/images/articles/tourism-guide.jpg',
    author: {
      name: 'سارة أحمد',
      avatar: '/images/authors/sara.jpg'
    },
    created_at: '2024-02-05',
    category: 'سياحة',
    tags: ['سياحة', 'سفر', 'المملكة']
  }
];

export const sampleReviews = [
  {
    id: 'review-1',
    company_id: 'company-1',
    user: {
      id: 'user-1',
      name: 'محمد علي',
      avatar_url: '/images/users/mohamed.jpg'
    },
    rating: 5,
    title: 'تجربة رائعة',
    content: 'زرت المطعم مع العائلة وكانت التجربة ممتازة. الطعام لذيذ والخدمة ممتازة.',
    created_at: '2024-02-01',
    images: [
      '/images/reviews/review-1-1.jpg',
      '/images/reviews/review-1-2.jpg'
    ],
    likes: 15,
    helpful: 10
  },
  {
    id: 'review-2',
    company_id: 'company-2',
    user: {
      id: 'user-2',
      name: 'فاطمة أحمد',
      avatar_url: '/images/users/fatima.jpg'
    },
    rating: 4.5,
    title: 'فندق مميز',
    content: 'إقامة مريحة وخدمة ممتازة. الموقع مثالي والغرف نظيفة ومريحة.',
    created_at: '2024-02-03',
    images: [
      '/images/reviews/review-2-1.jpg',
      '/images/reviews/review-2-2.jpg'
    ],
    likes: 8,
    helpful: 6
  }
];

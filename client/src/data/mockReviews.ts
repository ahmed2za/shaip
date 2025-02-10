export interface Review {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  rating: number;
  title: string;
  content: string;
  createdAt: string;
  helpful: number;
  user: {
    name: string;
    image: string;
    reviewCount: number;
  };
  companyResponse?: {
    content: string;
    respondedAt: string;
    responder: string;
  };
}

export const mockReviews: Review[] = [
  {
    id: '1',
    companyId: '1',
    companyName: 'مطعم البيت الدمشقي',
    companyLogo: '/images/companies/damascus-house.jpg',
    rating: 5,
    title: 'أفضل مطعم سوري في المنطقة',
    content: 'تجربة رائعة في مطعم البيت الدمشقي. الطعام شهي والخدمة ممتازة. أنصح الجميع بتجربة الشاورما والفتة.',
    createdAt: '2025-02-08',
    helpful: 24,
    user: {
      name: 'محمد العتيبي',
      image: '/images/avatars/user1.jpg',
      reviewCount: 15
    },
    companyResponse: {
      content: 'شكراً جزيلاً لك على هذا التقييم الرائع. يسعدنا دائماً تقديم أفضل تجربة لعملائنا الكرام.',
      respondedAt: '2025-02-09',
      responder: 'مدير المطعم'
    }
  },
  {
    id: '2',
    companyId: '2',
    companyName: 'شركة التقنية المتطورة',
    companyLogo: '/images/companies/tech-co.jpg',
    rating: 4,
    title: 'خدمة عملاء متميزة',
    content: 'تعاملت مع الشركة في مشروع تطوير موقع إلكتروني. الفريق محترف والتواصل كان سلس. التسليم كان في الموعد المحدد.',
    createdAt: '2025-02-07',
    helpful: 18,
    user: {
      name: 'سارة الغامدي',
      image: '/images/avatars/user2.jpg',
      reviewCount: 8
    }
  },
  {
    id: '3',
    companyId: '3',
    companyName: 'فندق النخبة',
    companyLogo: '/images/companies/elite-hotel.jpg',
    rating: 5,
    title: 'إقامة لا تُنسى',
    content: 'قضيت عطلة نهاية الأسبوع في الفندق. الغرف فاخرة والإطلالة رائعة. الموظفون ودودون والخدمات متكاملة.',
    createdAt: '2025-02-06',
    helpful: 32,
    user: {
      name: 'فهد العتيبي',
      image: '/images/avatars/user3.jpg',
      reviewCount: 20
    },
    companyResponse: {
      content: 'نشكرك على اختيار فندق النخبة. سعداء بأن إقامتك كانت ممتازة ونتطلع لاستضافتك مرة أخرى.',
      respondedAt: '2025-02-07',
      responder: 'مدير خدمة العملاء'
    }
  },
  {
    id: '4',
    companyId: '4',
    companyName: 'عقارات المستقبل',
    companyLogo: '/images/companies/future-realty.jpg',
    rating: 5,
    title: 'خدمة احترافية وسرعة في الإنجاز',
    content: 'تجربتي مع عقارات المستقبل كانت ممتازة. الفريق محترف جداً وساعدني في إيجاد العقار المناسب بسرعة. الأسعار منافسة والخدمة ممتازة.',
    createdAt: '2025-02-05',
    helpful: 27,
    user: {
      name: 'عبدالله الشمري',
      image: '/images/avatars/user4.jpg',
      reviewCount: 12
    },
    companyResponse: {
      content: 'شكراً جزيلاً لثقتك بنا. نحن سعداء بأن خدماتنا نالت رضاك ونتطلع دائماً لتقديم الأفضل لعملائنا.',
      respondedAt: '2025-02-06',
      responder: 'مدير المبيعات'
    }
  },
  {
    id: '5',
    companyId: '4',
    companyName: 'عقارات المستقبل',
    companyLogo: '/images/companies/future-realty.jpg',
    rating: 4,
    title: 'تجربة جيدة في الاستثمار العقاري',
    content: 'استثمرت معهم في مشروع سكني وكانت التجربة جيدة. الشفافية في التعامل والمتابعة المستمرة من أهم ما يميزهم.',
    createdAt: '2025-02-04',
    helpful: 15,
    user: {
      name: 'نورة السعيد',
      image: '/images/avatars/user5.jpg',
      reviewCount: 6
    }
  }
];

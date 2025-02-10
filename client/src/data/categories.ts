interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  icon: string;
  companies: string[];
  features: string[];
}

export const categories: { [key: string]: Category } = {
  'restaurants': {
    id: 'restaurants',
    name: 'مطاعم',
    description: 'اكتشف أفضل المطاعم في المملكة العربية السعودية. من المأكولات التقليدية إلى المطابخ العالمية.',
    image: '/images/categories/restaurants.jpg',
    icon: 'restaurant',
    companies: ['1', '789', '1432'],
    features: [
      'تقييمات وآراء العملاء',
      'قوائم الطعام والأسعار',
      'خدمة التوصيل',
      'حجز الطاولات',
      'عروض خاصة'
    ]
  },
  'healthcare': {
    id: 'healthcare',
    name: 'صحة',
    description: 'خدمات صحية شاملة من أفضل المستشفيات والعيادات في المملكة. رعاية طبية متكاملة بأعلى المعايير.',
    image: '/images/categories/healthcare.jpg',
    icon: 'local_hospital',
    companies: ['1432', '567'],
    features: [
      'حجز المواعيد',
      'استشارات طبية',
      'خدمات الطوارئ',
      'التأمين الطبي',
      'الملف الطبي الإلكتروني'
    ]
  },
  'education': {
    id: 'education',
    name: 'تعليم',
    description: 'مؤسسات تعليمية رائدة تقدم أفضل البرامج التعليمية. من رياض الأطفال إلى التعليم العالي.',
    image: '/images/categories/education.jpg',
    icon: 'school',
    companies: ['567'],
    features: [
      'برامج أكاديمية متنوعة',
      'أنشطة لا صفية',
      'تعليم عن بعد',
      'دورات تدريبية',
      'شهادات معتمدة'
    ]
  },
  'shopping': {
    id: 'shopping',
    name: 'تسوق',
    description: 'أفضل مراكز التسوق والمتاجر في المملكة. تجربة تسوق فريدة مع أشهر العلامات التجارية.',
    image: '/images/categories/shopping.jpg',
    icon: 'shopping_cart',
    companies: ['789'],
    features: [
      'عروض وتخفيضات',
      'برامج الولاء',
      'خدمة العملاء',
      'مواقف سيارات',
      'مطاعم ومقاهي'
    ]
  },
  'technology': {
    id: 'technology',
    name: 'تقنية',
    description: 'شركات تقنية رائدة تقدم أحدث الحلول التكنولوجية. خدمات رقمية متطورة للأفراد والشركات.',
    image: '/images/categories/technology.jpg',
    icon: 'computer',
    companies: ['2'],
    features: [
      'حلول برمجية',
      'خدمات استشارية',
      'دعم فني',
      'تدريب تقني',
      'حلول سحابية'
    ]
  },
  'real-estate': {
    id: 'real-estate',
    name: 'عقارات',
    description: 'استكشف سوق العقارات في المملكة. شراء، بيع، وتأجير العقارات مع أفضل الشركات العقارية.',
    image: '/images/categories/real-estate.jpg',
    icon: 'apartment',
    companies: ['4'],
    features: [
      'بيع وشراء العقارات',
      'خدمات التأجير',
      'استشارات عقارية',
      'تمويل عقاري',
      'إدارة الممتلكات'
    ]
  }
};

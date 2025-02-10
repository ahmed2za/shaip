// Mock data for companies and reviews
export const companies = [
  // تقنية
  {
    companyId: '1',
    companyName: 'شركة التقنية المتقدمة',
    companyDescription: 'شركة رائدة في مجال تطوير البرمجيات وحلول تكنولوجيا المعلومات. نقدم خدمات متكاملة في مجال التحول الرقمي وتطوير التطبيقات',
    companyLogo: '/images/companies/tech-company.jpg',
    companyRating: 4.5,
    companyReviewCount: 120,
    companyCategory: 'تقنية',
    companyLocation: 'الرياض',
    companyWebsite: 'www.techcompany.sa',
    companySize: '100-500',
    companyFoundedYear: 2015
  },
  {
    companyId: '2',
    companyName: 'شركة الحلول الذكية',
    companyDescription: 'متخصصون في الذكاء الاصطناعي وإنترنت الأشياء. نساعد الشركات على التحول الرقمي وتحسين كفاءة العمليات',
    companyLogo: '/images/companies/tech-company-1.jpg',
    companyRating: 4.3,
    companyReviewCount: 85,
    companyCategory: 'تقنية',
    companyLocation: 'جدة',
    companyWebsite: 'www.smartsolutions.sa',
    companySize: '50-200',
    companyFoundedYear: 2018
  },
  // مطاعم
  {
    companyId: '3',
    companyName: 'مطعم الذواقة العربي',
    companyDescription: 'نقدم أشهى المأكولات العربية التقليدية والعصرية. طعم أصيل وخدمة متميزة',
    companyLogo: '/images/companies/default-company.jpg',
    companyRating: 4.7,
    companyReviewCount: 320,
    companyCategory: 'مطاعم',
    companyLocation: 'الرياض',
    companyWebsite: 'www.arabicfood.sa',
    companySize: '20-50',
    companyFoundedYear: 2019
  },
  {
    companyId: '4',
    companyName: 'مطعم البحر الأزرق',
    companyDescription: 'أفضل المأكولات البحرية الطازجة. تجربة طعام فريدة مع إطلالة بحرية رائعة',
    companyLogo: '/images/companies/default-company.jpg',
    companyRating: 4.6,
    companyReviewCount: 250,
    companyCategory: 'مطاعم',
    companyLocation: 'جدة',
    companyWebsite: 'www.bluesea.sa',
    companySize: '20-50',
    companyFoundedYear: 2020
  },
  // تسوق
  {
    companyId: '5',
    companyName: 'متجر الأناقة',
    companyDescription: 'متجر متخصص في الملابس والإكسسوارات العصرية. نوفر أحدث صيحات الموضة العالمية',
    companyLogo: '/images/companies/ecommerce.jpg',
    companyRating: 4.4,
    companyReviewCount: 150,
    companyCategory: 'تسوق',
    companyLocation: 'الرياض',
    companyWebsite: 'www.elegance.sa',
    companySize: '10-50',
    companyFoundedYear: 2021
  },
  // بنوك
  {
    companyId: '6',
    companyName: 'البنك الوطني',
    companyDescription: 'خدمات مصرفية متكاملة للأفراد والشركات. حلول مالية مبتكرة وخدمة عملاء متميزة',
    companyLogo: '/images/companies/bank.jpg',
    companyRating: 4.2,
    companyReviewCount: 420,
    companyCategory: 'بنوك',
    companyLocation: 'الرياض',
    companyWebsite: 'www.nationalbank.sa',
    companySize: '1000+',
    companyFoundedYear: 1980
  },
  // اتصالات
  {
    companyId: '7',
    companyName: 'شركة الاتصالات المتقدمة',
    companyDescription: 'نقدم أحدث خدمات الاتصالات وحلول الإنترنت. تغطية شاملة وخدمات موثوقة',
    companyLogo: '/images/companies/telecom-company.jpg',
    companyRating: 4.1,
    companyReviewCount: 580,
    companyCategory: 'اتصالات',
    companyLocation: 'الرياض',
    companyWebsite: 'www.telecom.sa',
    companySize: '1000+',
    companyFoundedYear: 1990
  }
];

export const users = [
  {
    userId: '1',
    userName: 'أحمد محمد',
    userEmail: 'ahmed@example.com',
    userAvatar: '/images/avatars/male1.svg',
    userRole: 'USER',
    userGender: 'male'
  },
  {
    userId: '2',
    userName: 'سارة علي',
    userEmail: 'sara@example.com',
    userAvatar: '/images/avatars/female1.svg',
    userRole: 'USER',
    userGender: 'female'
  },
  {
    userId: '3',
    userName: 'محمد عبدالله',
    userEmail: 'mohammed@example.com',
    userAvatar: '/images/avatars/male1.svg',
    userRole: 'USER',
    userGender: 'male'
  },
  {
    userId: '4',
    userName: 'نورة أحمد',
    userEmail: 'noura@example.com',
    userAvatar: '/images/avatars/female1.svg',
    userRole: 'USER',
    userGender: 'female'
  }
];

export const reviews = [
  {
    reviewId: '1',
    reviewTitle: 'تجربة رائعة مع الشركة',
    reviewContent: 'تعاملت مع الشركة في مشروع تطوير تطبيق جوال. كان الفريق محترف جداً والنتيجة ممتازة. أنصح بالتعامل معهم',
    reviewRating: 5,
    reviewDate: '2025-01-15',
    reviewAuthor: {
      userId: '1',
      userName: 'أحمد محمد',
      userAvatar: '/images/avatars/male1.svg'
    },
    reviewCompany: {
      companyId: '1',
      companyName: 'شركة التقنية المتقدمة',
      companyLogo: '/images/companies/tech-company.jpg'
    },
    likes: 25,
    helpful: 18
  },
  {
    reviewId: '2',
    reviewTitle: 'خدمة عملاء متميزة',
    reviewContent: 'سرعة في الاستجابة وحلول مبتكرة لمشاكل العمل. فريق محترف ويستحق الإشادة',
    reviewRating: 4,
    reviewDate: '2025-01-20',
    reviewAuthor: {
      userId: '2',
      userName: 'سارة علي',
      userAvatar: '/images/avatars/female1.svg'
    },
    reviewCompany: {
      companyId: '2',
      companyName: 'شركة الحلول الذكية',
      companyLogo: '/images/companies/tech-company-1.jpg'
    },
    likes: 15,
    helpful: 12
  },
  {
    reviewId: '3',
    reviewTitle: 'طعام لذيذ وخدمة ممتازة',
    reviewContent: 'زرت المطعم مع العائلة وكانت تجربة رائعة. الطعام شهي والخدمة سريعة والمكان نظيف',
    reviewRating: 5,
    reviewDate: '2025-02-01',
    reviewAuthor: {
      userId: '3',
      userName: 'محمد عبدالله',
      userAvatar: '/images/avatars/male1.svg'
    },
    reviewCompany: {
      companyId: '3',
      companyName: 'مطعم الذواقة العربي',
      companyLogo: '/images/companies/default-company.jpg'
    },
    likes: 32,
    helpful: 28
  },
  {
    reviewId: '4',
    reviewTitle: 'خدمات مصرفية متميزة',
    reviewContent: 'تطبيق البنك سهل الاستخدام والخدمات المصرفية سريعة وآمنة. موظفو خدمة العملاء متعاونون جداً',
    reviewRating: 4,
    reviewDate: '2025-02-05',
    reviewAuthor: {
      userId: '4',
      userName: 'نورة أحمد',
      userAvatar: '/images/avatars/female1.svg'
    },
    reviewCompany: {
      companyId: '6',
      companyName: 'البنك الوطني',
      companyLogo: '/images/companies/bank.jpg'
    },
    likes: 45,
    helpful: 40
  }
];

export const categories = [
  {
    id: 'tech',
    name: 'تقنية',
    icon: 'computer',
    description: 'شركات التقنية وتطوير البرمجيات',
    companiesCount: 50
  },
  {
    id: 'restaurants',
    name: 'مطاعم',
    icon: 'restaurant',
    description: 'مطاعم وخدمات الطعام',
    companiesCount: 120
  },
  {
    id: 'shopping',
    name: 'تسوق',
    icon: 'shopping_cart',
    description: 'متاجر ومراكز التسوق',
    companiesCount: 80
  },
  {
    id: 'banks',
    name: 'بنوك',
    icon: 'account_balance',
    description: 'البنوك والخدمات المالية',
    companiesCount: 25
  },
  {
    id: 'telecom',
    name: 'اتصالات',
    icon: 'phone_android',
    description: 'شركات الاتصالات وخدمات الإنترنت',
    companiesCount: 15
  }
];

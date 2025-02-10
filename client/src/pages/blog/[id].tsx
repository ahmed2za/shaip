import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/BlogPost.module.css';
import { formatDate } from '../../utils/dateFormatter';

// Sample blog post data
const blogPost = {
  id: 1,
  title: 'كيف تختار الشركة المناسبة لمشروعك؟',
  content: `
    <h2>مقدمة</h2>
    <p>
      يعد اختيار الشركة المناسبة للتعاون معها في مشروعك من أهم القرارات التي ستتخذها. في هذا المقال، سنستعرض أهم النقاط التي يجب مراعاتها عند اختيار الشركة المناسبة.
    </p>

    <h2>١. تحديد احتياجات مشروعك</h2>
    <p>
      قبل البدء في البحث عن شركة، من المهم تحديد احتياجات مشروعك بدقة. هذا يشمل:
    </p>
    <ul>
      <li>تحديد نطاق العمل المطلوب</li>
      <li>وضع ميزانية واضحة</li>
      <li>تحديد الجدول الزمني المتوقع</li>
      <li>تحديد المتطلبات الفنية والتقنية</li>
    </ul>

    <h2>٢. البحث عن الشركات المناسبة</h2>
    <p>
      بعد تحديد احتياجاتك، ابدأ في البحث عن الشركات التي تتناسب مع متطلباتك. يمكنك:
    </p>
    <ul>
      <li>البحث في منصة مصداقية</li>
      <li>قراءة تقييمات العملاء السابقين</li>
      <li>الاطلاع على محفظة أعمال الشركة</li>
      <li>التواصل مع عملاء سابقين</li>
    </ul>

    <h2>٣. تقييم الخبرات والمؤهلات</h2>
    <p>
      من المهم التأكد من أن الشركة تمتلك الخبرة والمؤهلات اللازمة. تحقق من:
    </p>
    <ul>
      <li>عدد سنوات الخبرة في المجال</li>
      <li>الشهادات والاعتمادات</li>
      <li>فريق العمل ومؤهلاتهم</li>
      <li>المشاريع السابقة المشابهة</li>
    </ul>

    <h2>٤. دراسة العروض والأسعار</h2>
    <p>
      قم بمقارنة العروض المقدمة من الشركات المختلفة، مع مراعاة:
    </p>
    <ul>
      <li>تفاصيل الخدمات المقدمة</li>
      <li>الأسعار والتكاليف</li>
      <li>شروط الدفع</li>
      <li>الضمانات المقدمة</li>
    </ul>

    <h2>٥. التواصل والتفاهم</h2>
    <p>
      من المهم التأكد من وجود تواصل جيد مع الشركة. لاحظ:
    </p>
    <ul>
      <li>سرعة الاستجابة للاستفسارات</li>
      <li>وضوح التواصل وشفافيته</li>
      <li>مدى تفهم احتياجاتك</li>
      <li>المرونة في التعامل</li>
    </ul>

    <h2>الخاتمة</h2>
    <p>
      اختيار الشركة المناسبة يتطلب دراسة متأنية وبحثاً شاملاً. استخدم منصة مصداقية للاطلاع على تجارب العملاء السابقين واتخاذ قرار مدروس.
    </p>
  `,
  image: '/images/blog/choose-company.jpg',
  author: 'أحمد محمد',
  date: '2024-02-01',
  category: 'نصائح وإرشادات',
  readTime: '5 دقائق',
  tags: ['اختيار الشركات', 'نصائح عملية', 'تطوير الأعمال', 'دراسة السوق']
};

const BlogPost: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  // In a real application, you would fetch the blog post data based on the ID
  // For now, we'll use the sample data

  return (
    <>
      <Head>
        <title>{blogPost.title} - مصداقية</title>
        <meta name="description" content={blogPost.content.substring(0, 160)} />
      </Head>

      <main className={styles.main}>
        <article className={styles.article}>
          <header className={styles.header}>
            <div className={styles.meta}>
              <span className={styles.category}>{blogPost.category}</span>
              <span className={styles.date}>
                {formatDate(blogPost.date)}
              </span>
              <span className={styles.readTime}>{blogPost.readTime}</span>
            </div>
            <h1>{blogPost.title}</h1>
            <div className={styles.author}>
              <span>بواسطة {blogPost.author}</span>
            </div>
          </header>

          <div className={styles.featuredImage}>
            <Image
              src={blogPost.image}
              alt={blogPost.title}
              width={1200}
              height={600}
              objectFit="cover"
            />
          </div>

          <div 
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: blogPost.content }}
          />

          <footer className={styles.footer}>
            <div className={styles.tags}>
              {blogPost.tags.map((tag, index) => (
                <Link key={index} href={`/blog/tag/${tag}`}>
                  <span className={styles.tag}>{tag}</span>
                </Link>
              ))}
            </div>

            <div className={styles.share}>
              <h3>شارك المقال</h3>
              <div className={styles.shareButtons}>
                <button className={styles.shareButton}>Twitter</button>
                <button className={styles.shareButton}>Facebook</button>
                <button className={styles.shareButton}>LinkedIn</button>
              </div>
            </div>
          </footer>
        </article>

        <div className={styles.navigation}>
          <Link href="/blog" className={styles.backButton}>
            العودة إلى المدونة
          </Link>
        </div>
      </main>
    </>
  );
};

export default BlogPost;

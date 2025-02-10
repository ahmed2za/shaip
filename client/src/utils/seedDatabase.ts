import { supabase } from '@/lib/supabase';
import { sampleCompanies, sampleArticles, sampleReviews } from '@/data/sampleData';

export async function seedDatabase() {
  try {
    // إضافة الشركات
    const { error: companiesError } = await supabase
      .from('companies')
      .upsert(sampleCompanies.map(company => ({
        id: company.id,
        name: company.name,
        description: company.description,
        logo_url: company.logo_url,
        cover_image: company.cover_image,
        images: company.images,
        categories: company.categories,
        location: company.location,
        rating: company.rating,
        total_reviews: company.total_reviews,
        website: company.website,
        phone: company.phone,
        working_hours: company.working_hours,
        created_at: new Date().toISOString()
      })));

    if (companiesError) throw companiesError;

    // إضافة المقالات
    const { error: articlesError } = await supabase
      .from('articles')
      .upsert(sampleArticles.map(article => ({
        id: article.id,
        title: article.title,
        content: article.content,
        image: article.image,
        author: article.author,
        created_at: article.created_at,
        category: article.category,
        tags: article.tags
      })));

    if (articlesError) throw articlesError;

    // إضافة التقييمات
    const { error: reviewsError } = await supabase
      .from('reviews')
      .upsert(sampleReviews.map(review => ({
        id: review.id,
        company_id: review.company_id,
        user_id: review.user.id,
        rating: review.rating,
        title: review.title,
        content: review.content,
        created_at: review.created_at,
        images: review.images,
        likes: review.likes,
        helpful: review.helpful
      })));

    if (reviewsError) throw reviewsError;

    console.log('تم إضافة البيانات الافتراضية بنجاح');
    return true;
  } catch (error) {
    console.error('خطأ في إضافة البيانات الافتراضية:', error);
    return false;
  }
}

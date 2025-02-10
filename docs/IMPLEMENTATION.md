# 📋 خطة التنفيذ والمتطلبات

## 1️⃣ لوحة تحكم الإدمن (Admin Dashboard)

### أ. نظام المدونة المتكامل

#### المكتبات المطلوبة
- `@tiptap/react`: محرر نصوص متقدم
- `@tiptap/extension-youtube`: دعم تضمين فيديوهات يوتيوب
- `react-dropzone`: رفع الملفات
- `iframe-embed`: تضمين الفيديوهات

#### الميزات
1. **المحرر المتقدم**
   ```typescript
   import { useEditor } from '@tiptap/react';
   import Youtube from '@tiptap/extension-youtube';

   const editor = useEditor({
     extensions: [Youtube],
     content: '<p>أضف فيديو هنا:</p>',
     editorProps: {
       attributes: {
         class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none'
       }
     }
   });
   ```

2. **إدارة التصنيفات والوسوم**
   - نظام تصنيفات مع ألوان مميزة
   - اقتراحات ذكية للوسوم
   - البحث السريع

3. **جدولة النشر**
   - `react-datepicker` لاختيار التاريخ والوقت
   - نظام إشعارات بريدية

### ب. إدارة المستخدمين والشركات

#### المكتبات المطلوبة
- `mongoose`: قاعدة البيانات
- `swagger-ui-react`: توثيق API
- `react-table`: عرض وفلترة البيانات

#### الميزات
1. **توثيق الحسابات**
   ```typescript
   interface AccountVerification {
     userId: string;
     documents: {
       type: 'id' | 'commercial',
       url: string;
       status: 'pending' | 'verified' | 'rejected';
     }[];
     verificationStatus: string;
     notes: string;
   }
   ```

2. **إدارة الصلاحيات**
   - نظام أدوار متعدد المستويات
   - سجل تغييرات الصلاحيات

3. **نظام الحظر**
   - حظر مؤقت/دائم
   - سجل الإجراءات

### ج. إعدادات الموقع المتقدمة

#### المكتبات المطلوبة
- `next-i18next`: تعدد اللغات
- `react-color`: اختيار الألوان
- `google-auth-library`: ربط خدمات جوجل

#### التنفيذ
1. **إعلانات Adsense**
   ```html
   اضف اداة مكتوب عليها مكن ظهور الاعلان و عندما اضع الكود الاعلاني يظهر بشكل متناسق مع الموقع في المكان المخصص مثل تحت الهيدر و في الفوترة و في داخل المقالات و في اطراف الشاشة و بين التعليقات و في صفحات الشركات و مثل هذا 
   <!-- إضافة الكود في _app.tsx -->
   
   ```


   }
   ```

### د. أدوات مكافحة الغش
- تحليل المراجعات باستخدام TensorFlow.js
- حظر IP مشبوه
- التحقق من الحسابات المكررة

## 2️⃣ لوحة تحكم الشركات (Company Dashboard)

### أ. الرد على المراجعات

#### المكتبات المطلوبة
- `socket.io-client`: إشعارات فورية
- `react-mentions`: @mentions في الردود

#### مثال التنفيذ
```typescript
interface ReviewResponse {
  reviewId: string;
  companyId: string;
  message: string;
  mentions: string[];
  createdAt: Date;
}

const handleResponse = async (reviewId: string, message: string) => {
  return await axios.post('/api/reviews/response', {
    reviewId,
    message,
    companyId: currentCompany.id
  });
};
```

### ب. إحصاءات الأداء

#### المكتبات المطلوبة
- `apexcharts`: رسوم بيانية
- `jspdf`: تصدير PDF

#### الميزات
1. **لوحة المعلومات**
   - متوسط التقييمات
   - عدد المراجعات
   - معدل الرضا

2. **التقارير**
   - تقارير أسبوعية/شهرية
   - مقارنة مع المنافسين
   - تصدير البيانات

### ج. إدارة الحملات الإعلانية
- ربط مع Google Ads
- عرض التقييمات في الإعلانات
- تتبع أداء الحملات

## 3️⃣ المكتبات المطلوبة

### تثبيت المكتبات الأساسية
```bash
# المحرر والملفات
npm install @tiptap/react @tiptap/extension-youtube react-dropzone

# الرسوم البيانية
npm install apexcharts react-apexcharts

# الترجمة
npm install next-i18next i18next react-i18next

# قاعدة البيانات والAPI
npm install mongoose swagger-ui-react

# الأمان
npm install @casl/ability @casl/react
```

## 4️⃣ هيكل الصفحات والتوجيه

### Dynamic Routes
```typescript
// pages/admin/[pageId].tsx
import AdminLayout from '@/components/layouts/AdminLayout';
import { BlogEditor, UsersTable, Settings } from '@/components/admin';

export default function AdminPage({ pageId }: { pageId: string }) {
  return (
    <AdminLayout>
      {pageId === 'blog' && <BlogEditor />}
      {pageId === 'users' && <UsersTable />}
      {pageId === 'settings' && <Settings />}
    </AdminLayout>
  );
}
```

## 5️⃣ الأمان والصلاحيات

### نظام CASL
```typescript
import { AbilityBuilder, Ability } from '@casl/ability';

export type Actions = 'create' | 'read' | 'update' | 'delete';
export type Subjects = 'Review' | 'User' | 'Company' | 'Post';

export function defineAbilityFor(user: User) {
  const { can, cannot, build } = new AbilityBuilder<Ability<[Actions, Subjects]>>();

  if (user.role === 'admin') {
    can('manage', 'all');
  } else if (user.role === 'company') {
    can('read', 'Review');
    can('create', 'ReviewResponse');
    cannot('delete', 'Review');
  }

  return build();
}
```

## 🔄 النسخ الاحتياطي
```bash
# نسخ قاعدة البيانات
mongodump --uri="mongodb://localhost:27017/database" --out="backup"

# رفع النسخة إلى S3
aws s3 cp backup s3://bucket-name/backups/$(date +%Y-%m-%d)/
```

## 📝 ملاحظات إضافية
1. تنظيم الكود في وحدات مستقلة
2. كتابة اختبارات شاملة
3. توثيق API باستخدام Swagger
4. مراقبة الأداء باستخدام Sentry
5. تحسين SEO وسرعة التحميل

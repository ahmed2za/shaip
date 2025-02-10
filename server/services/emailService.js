const nodemailer = require('nodemailer');
const config = require('../config');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport(config.email.smtp);
  }

  async sendReviewNotification(company, review) {
    const mailOptions = {
      from: config.email.from,
      to: company.email,
      subject: 'تقييم جديد لشركتك',
      html: `
        <div dir="rtl">
          <h2>مرحباً ${company.name}،</h2>
          <p>لقد تلقيت تقييماً جديداً من ${review.userName}</p>
          <p>التقييم: ${review.rating} نجوم</p>
          <p>المحتوى: ${review.content}</p>
          <p>يمكنك الرد على هذا التقييم من خلال لوحة التحكم الخاصة بك.</p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  }

  async sendVerificationEmail(user, token) {
    const verificationUrl = `${config.corsOrigin}/verify-email?token=${token}`;

    const mailOptions = {
      from: config.email.from,
      to: user.email,
      subject: 'تأكيد البريد الإلكتروني',
      html: `
        <div dir="rtl">
          <h2>مرحباً ${user.name}،</h2>
          <p>شكراً لتسجيلك في موقعنا. يرجى النقر على الرابط التالي لتأكيد بريدك الإلكتروني:</p>
          <a href="${verificationUrl}">تأكيد البريد الإلكتروني</a>
          <p>هذا الرابط صالح لمدة 24 ساعة فقط.</p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Failed to send verification email:', error);
    }
  }

  async sendReviewStatusUpdate(review, status) {
    const mailOptions = {
      from: config.email.from,
      to: review.userEmail,
      subject: 'تحديث حالة التقييم',
      html: `
        <div dir="rtl">
          <h2>مرحباً ${review.userName}،</h2>
          <p>نود إعلامك بأن حالة تقييمك قد تم تحديثها إلى: ${
            status === 'approved' ? 'معتمد' : 'مرفوض'
          }</p>
          ${status === 'rejected' ? '<p>يرجى مراجعة شروط وسياسات النشر.</p>' : ''}
          <p>يمكنك مراجعة تقييمك من خلال حسابك الشخصي.</p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Failed to send status update email:', error);
    }
  }
}

module.exports = new EmailService();

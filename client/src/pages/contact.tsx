import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import styles from '@/styles/Contact.module.css';

const Contact: NextPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add your form submission logic here
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <>
      <Head>
        <title>اتصل بنا - مصداقية</title>
        <meta name="description" content="تواصل معنا عبر نموذج الاتصال أو عبر معلومات التواصل المباشرة" />
      </Head>

      <main className={styles.main}>
        <div className={styles.container}>
          <h1>اتصل بنا</h1>
          <p className={styles.subtitle}>نحن هنا للإجابة على استفساراتك ومساعدتك في كل ما تحتاج</p>

          <div className={styles.content}>
            <div className={styles.contactInfo}>
              <h2>معلومات التواصل</h2>
              <div className={styles.infoItem}>
                <h3>العنوان</h3>
                <p>الرياض، المملكة العربية السعودية</p>
              </div>
              <div className={styles.infoItem}>
                <h3>البريد الإلكتروني</h3>
                <p>info@misdaqia.com</p>
              </div>
              <div className={styles.infoItem}>
                <h3>الهاتف</h3>
                <p>+966 XX XXX XXXX</p>
              </div>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="name">الاسم</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">البريد الإلكتروني</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="subject">الموضوع</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message">الرسالة</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                />
              </div>

              <button type="submit" className={styles.submitButton}>
                إرسال الرسالة
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
};

export default Contact;

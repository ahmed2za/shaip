import { useTranslation as useNextTranslation } from 'next-i18next';

export const useTranslation = () => {
  const { t, i18n } = useNextTranslation('common');

  const translate = (key: string, options?: any) => {
    const translation = t(key, options);
    return translation === key ? `Missing translation: ${key}` : translation;
  };

  return {
    t: translate,
    i18n,
    currentLanguage: i18n.language,
    dir: i18n.language === 'ar' ? 'rtl' : 'ltr',
  };
};

export default useTranslation;

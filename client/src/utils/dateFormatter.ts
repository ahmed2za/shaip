export const formatDate = (dateString: string): string => {
  // تحويل التاريخ إلى كائن Date
  const date = new Date(dateString);
  
  // تنسيق ثابت للتاريخ بالعربية
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  // إرجاع التاريخ بتنسيق ثابت
  return `${day}/${month}/${year}`;
}

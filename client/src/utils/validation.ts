export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('يجب أن تكون كلمة المرور 8 أحرف على الأقل');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('يجب أن تحتوي على حرف كبير واحد على الأقل');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('يجب أن تحتوي على حرف صغير واحد على الأقل');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('يجب أن تحتوي على رقم واحد على الأقل');
  }

  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('يجب أن تحتوي على رمز خاص واحد على الأقل (!@#$%^&*)');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateName = (name: string): boolean => {
  return name.length >= 2 && /^[\u0600-\u06FFa-zA-Z\s]+$/.test(name);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(05)[0-9]{8}$/;
  return phoneRegex.test(phone);
};

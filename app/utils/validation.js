export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function sanitizeInput(input) {
  // Basic HTML sanitization
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function validateContactForm(data) {
  const errors = {};
  
  // Sanitize inputs
  const name = sanitizeInput(data.name || '');
  const email = sanitizeInput(data.email || '');
  const subject = sanitizeInput(data.subject || '');
  const message = sanitizeInput(data.message || '');

  // Validate name
  if (!name || name.length < 2) {
    errors.name = 'الاسم يجب أن يكون أكثر من حرفين';
  }

  // Validate email
  if (!email || !validateEmail(email)) {
    errors.email = 'البريد الإلكتروني غير صحيح';
  }

  // Validate subject
  if (!subject || subject.length < 3) {
    errors.subject = 'الموضوع يجب أن يكون أكثر من 3 أحرف';
  }

  // Validate message
  if (!message || message.length < 10) {
    errors.message = 'الرسالة يجب أن تكون أكثر من 10 أحرف';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData: {
      name,
      email,
      subject,
      message
    }
  };
} 
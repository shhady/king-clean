export const getAdminEmailTemplate = (data) => `
  <div dir="rtl" style="font-family: Arial, sans-serif;">
    <h2 style="color: #40E0D0;">رسالة جديدة من ${data.name}</h2>
    <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
      <p><strong>البريد الإلكتروني:</strong> ${data.email}</p>
      <p><strong>الموضوع:</strong> ${data.subject}</p>
      <p><strong>الرسالة:</strong></p>
      <p style="white-space: pre-line;">${data.message}</p>
    </div>
  </div>
`;

export const getUserEmailTemplate = (data) => `
  <div dir="rtl" style="font-family: Arial, sans-serif;">
    <h2 style="color: #40E0D0;">مرحباً ${data.name}،</h2>
    <p>شكراً لتواصلك معنا. لقد تم استلام رسالتك وسنقوم بالرد عليك في أقرب وقت ممكن.</p>
    <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p><strong>تفاصيل رسالتك:</strong></p>
      <p><strong>الموضوع:</strong> ${data.subject}</p>
      <p><strong>الرسالة:</strong></p>
      <p style="white-space: pre-line;">${data.message}</p>
    </div>
    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
    <p>
      مع تحيات،<br>
      فريق متجر الكريستال
    </p>
  </div>
`; 
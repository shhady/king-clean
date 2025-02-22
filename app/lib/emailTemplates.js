export function getOrderConfirmationEmail(order) {
  return {
    subject: `تأكيد الطلب #${order._id}`,
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; text-align: center;">شكراً لطلبك!</h1>
        <p style="margin-bottom: 20px;">مرحباً ${order.customerInfo.fullName}،</p>
        <p>تم استلام طلبك بنجاح. تفاصيل الطلب:</p>
        
        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">المنتجات:</h3>
          ${order.items.map(item => `
            <div style="margin-bottom: 10px;">
              <p style="margin: 0;">
                ${item.nameAr} - ${item.quantity} قطعة - ${item.price} شيكل
              </p>
            </div>
          `).join('')}
          <h3 style="margin-top: 20px;">المجموع: ${order.total} شيكل</h3>
        </div>

        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px;">
          <h3 style="margin-top: 0;">عنوان التوصيل:</h3>
          <p style="margin: 0;">${order.customerInfo.address}</p>
          <p style="margin: 5px 0;">${order.customerInfo.city}</p>
          <p style="margin: 5px 0;">رقم الهاتف: ${order.customerInfo.phone}</p>
        </div>

        <p style="margin-top: 20px;">
          سنقوم بإرسال تحديثات حول حالة طلبك عبر البريد الإلكتروني.
        </p>

        <div style="text-align: center; margin-top: 30px; color: #666;">
          <p>مع تحيات،</p>
          <p>فريق متجر الكريستال</p>
        </div>
      </div>
    `
  };
}

export function getAdminOrderNotificationEmail(order) {
  return {
    subject: `طلب جديد #${order._id}`,
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; text-align: center;">طلب جديد!</h1>
        
        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">تفاصيل العميل:</h3>
          <p>الاسم: ${order.customerInfo.fullName}</p>
          <p>البريد الإلكتروني: ${order.customerInfo.email}</p>
          <p>الهاتف: ${order.customerInfo.phone}</p>
          <p>العنوان: ${order.customerInfo.address}</p>
          <p>المدينة: ${order.customerInfo.city}</p>
        </div>

        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px;">
          <h3 style="margin-top: 0;">المنتجات:</h3>
          ${order.items.map(item => `
            <div style="margin-bottom: 10px;">
              <p style="margin: 0;">
                ${item.nameAr} (${item.name}) - ${item.quantity} قطعة - ${item.price} شيكل
              </p>
            </div>
          `).join('')}
          <h3 style="margin-top: 20px;">المجموع: ${order.total} شيكل</h3>
        </div>
      </div>
    `
  };
}

export function getOrderStatusUpdateEmail(order) {
  // First, verify we have all required data
  if (!order || !order.customerInfo || !order.items) {
    console.error('Missing required order data:', order);
    throw new Error('Invalid order data for email template');
  }

  const statusMessages = {
    'pending': 'قيد المراجعة',
    'processing': 'قيد التجهيز',
    'completed': 'تم التسليم',
    'cancelled': 'تم إلغاء الطلب'
  };

  // Log the status message being used
  console.log('Status message:', {
    status: order.status,
    message: statusMessages[order.status]
  });

  return {
    subject: `تحديث حالة الطلب #${order._id}`,
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; text-align: center;">تحديث حالة الطلب</h1>
        <p style="margin-bottom: 20px;">مرحباً ${order.customerInfo.fullName}،</p>
        <p>نود إعلامك بتحديث حالة طلبك:</p>
        
        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">تفاصيل الطلب:</h3>
          <p>رقم الطلب: ${order._id}</p>
          <p>الحالة الجديدة: ${statusMessages[order.status] || order.status}</p>
          
          <div style="margin-top: 15px;">
            <h4 style="margin-bottom: 10px;">المنتجات:</h4>
            ${order.items.map(item => `
              <div style="margin-bottom: 10px;">
                <p style="margin: 0;">
                  ${item.nameAr} - ${item.quantity} قطعة
                </p>
              </div>
            `).join('')}
          </div>
          
          <p style="margin-top: 15px;">المجموع: ${order.total} شيكل</p>
        </div>

        <div style="text-align: center; margin-top: 30px; color: #666;">
          <p>مع تحيات،</p>
          <p>فريق متجر الكريستال</p>
        </div>
      </div>
    `
  };
} 
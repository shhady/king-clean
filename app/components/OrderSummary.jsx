export default function OrderSummary({ items, total }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">ملخص الطلب</h2>
      
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between items-center">
            <div className="flex items-center space-x-reverse space-x-2">
              <span className="text-gray-600">{item.quantity}x</span>
              <span>{item.nameAr || item.name}</span>
            </div>
            <span className="font-medium">{item.price * item.quantity} ₪</span>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 mt-4">
        <div className="flex justify-between items-center font-bold">
          <span>المجموع</span>
          <span>{total} ₪</span>
        </div>
      </div>
    </div>
  );
} 
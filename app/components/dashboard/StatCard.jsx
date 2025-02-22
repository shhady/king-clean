export default function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-500 text-sm">{title}</h3>
        <div className="p-2 bg-primary/10 rounded-full">
          <Icon className="text-primary w-6 h-6" />
        </div>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
} 
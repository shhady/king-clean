export default function LoadingConfirmation() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto animate-pulse">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-6" />
          <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4" />
          <div className="h-4 bg-gray-200 rounded w-48 mx-auto mb-2" />
          <div className="h-4 bg-gray-200 rounded w-32 mx-auto" />
        </div>
        <div className="flex gap-4">
          <div className="flex-1 h-12 bg-gray-200 rounded" />
          <div className="flex-1 h-12 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
} 
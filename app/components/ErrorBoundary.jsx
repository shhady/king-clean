'use client';
import { Component } from 'react';
import { FiAlertCircle, FiRefreshCw } from 'react-icons/fi';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <FiAlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold mb-2">عذراً، حدث خطأ ما</h2>
          <p className="text-gray-600 mb-4">
            {this.state.error?.message || 'حدث خطأ غير متوقع'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark"
          >
            <FiRefreshCw />
            إعادة تحميل الصفحة
          </button>
        </div>
      );
    }

    return this.props.children;
  }
} 
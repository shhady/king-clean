'use client';
import { useState, useImperativeHandle, forwardRef } from 'react';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';

const PRICE_RANGES = [
  { label: 'הכל', value: 'all', min: null, max: null },
  { label: '₪1 - ₪200', value: 'range1', min: 1, max: 200 },
  { label: '₪200 - ₪500', value: 'range2', min: 200, max: 500 },
  { label: '₪500 - ₪800', value: 'range3', min: 500, max: 800 },
  { label: 'מעל ₪800', value: 'range4', min: 800, max: null },
];

export default forwardRef(function ProductFilters({ 
  onFilterChange, 
  onSortChange, 
  onSearch,
  categories,
  initialCategory
}, ref) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: initialCategory || '',
    subcategory: '',
    priceRange: '',
    inStock: false
  });
  const [sortBy, setSortBy] = useState('newest');
  const [searchInput, setSearchInput] = useState('');

  // Get available subcategories based on selected category
  const getAvailableSubcategories = () => {
    if (!filters.category) {
      // If no category is selected, return all subcategories from all categories
      return categories?.flatMap(cat => cat.subcategories || []) || [];
    }
    // If category is selected, return only subcategories from that category
    const selectedCategory = categories?.find(cat => cat._id === filters.category);
    return selectedCategory?.subcategories || [];
  };

  // Expose clearFilters function to parent
  useImperativeHandle(ref, () => ({
    clearFilters: handleClearFilters
  }));

  const handleFilterChange = (name, value) => {
    let newFilters;

    if (name === 'category') {
      // When category changes, reset subcategory
      newFilters = {
        ...filters,
        category: value,
        subcategory: '' // Reset subcategory when category changes
      };
    } else if (name === 'subcategory') {
      // Ensure we have both category and subcategory if selecting a subcategory
      if (value) {
        const subcategory = getAvailableSubcategories().find(sub => sub._id === value);
        if (subcategory) {
          newFilters = {
            ...filters,
            subcategory: value
          };
        } else {
          console.error('Selected subcategory not found in available subcategories');
          return;
        }
      } else {
        newFilters = {
          ...filters,
          subcategory: ''
        };
      }
    } else {
      newFilters = {
        ...filters,
        [name]: value
      };
    }

    setFilters(newFilters);

    // Handle price range filtering
    if (name === 'priceRange') {
      const selectedRange = PRICE_RANGES.find(range => range.value === value);
      if (selectedRange && selectedRange.value !== 'all') {
        onFilterChange({
          ...newFilters,
          minPrice: selectedRange.min,
          maxPrice: selectedRange.max,
          priceRange: value
        });
      } else {
        const { minPrice, maxPrice, priceRange, ...restFilters } = newFilters;
        onFilterChange(restFilters);
      }
    } else {
      // Ensure we're passing the correct filter values
      const filterData = { ...newFilters };
      if (!filterData.category) delete filterData.category;
      if (!filterData.subcategory) delete filterData.subcategory;
      onFilterChange(filterData);
    }
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    onSortChange(value);
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    if (value.trim() === '') {
      handleClearFilters();
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput);
    }
  };

  const handleClearFilters = () => {
    setFilters({
      category: '',
      subcategory: '',
      priceRange: '',
      inStock: false
    });
    setSortBy('newest');
    setSearchInput('');
    
    onFilterChange({
      category: '',
      subcategory: '',
      priceRange: '',
      inStock: false
    });
    onSortChange('newest');
    onSearch('');
  };

  const availableSubcategories = getAvailableSubcategories();

  return (
    <div className="mb-8">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchInput}
            onChange={handleSearchInputChange}
            placeholder="חפש מוצר..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>
        <button
          type="submit"
          disabled={!searchInput.trim()}
          className={`px-6 py-2 rounded-lg flex items-center gap-2 ${
            searchInput.trim() 
              ? 'bg-blue-500 text-white hover:bg-primary-dark' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <FiSearch />
          חפש
        </button>
      </form>

      {/* Filter Toggle */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-gray-600 hover:text-primary"
        >
          <FiFilter />
          <span>סינון ומיון</span>
        </button>
        {Object.values(filters).some(Boolean) && (
          <button
            onClick={handleClearFilters}
            className="text-red-500 hover:text-red-700 flex items-center gap-1"
          >
            <FiX />
            <span>נקה סינון</span>
          </button>
        )}
      </div>

      {/* Filters Panel */}
      {isOpen && (
        <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">קטגוריה</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">הכל</option>
                {categories?.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">תת קטגוריה</label>
              <select
                value={filters.subcategory}
                onChange={(e) => handleFilterChange('subcategory', e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">הכל</option>
                {availableSubcategories.map((subcategory) => (
                  <option key={subcategory._id} value={subcategory._id}>
                    {subcategory.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium mb-2">טווח מחירים</label>
              <select
                value={filters.priceRange}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                {PRICE_RANGES.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium mb-2">מיין לפי</label>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="newest">החדש ביותר</option>
                <option value="priceAsc">מחיר סופי: מהנמוך לגבוה</option>
                <option value="priceDesc">מחיר סופי: מהגבוה לנמוך</option>
                <option value="nameAsc">שם: א-ת</option>
                <option value="nameDesc">שם: ת-א</option>
              </select>
            </div>
          </div>

          {/* Stock Filter */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="inStock"
              checked={filters.inStock}
              onChange={(e) => handleFilterChange('inStock', e.target.checked)}
              className="h-4 w-4 text-primary rounded border-gray-300"
            />
            <label htmlFor="inStock" className="mr-2 text-sm text-gray-600">
              הצג רק מוצרים במלאי
            </label>
          </div>
        </div>
      )}
    </div>
  );
}); 
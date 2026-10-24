import React from 'react';
import { Search, Sparkles, Filter, X } from 'lucide-react';
import { ProductCategory } from '../types';
import { productCategories } from '../data/initialProducts';

interface CategoryNavProps {
  selectedCategory: ProductCategory;
  onSelectCategory: (category: ProductCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  stockFilter: 'all' | 'in_stock';
  onStockFilterChange: (filter: 'all' | 'in_stock') => void;
  itemCount: number;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  stockFilter,
  onStockFilterChange,
  itemCount,
}) => {
  return (
    <div className="bg-[#FAF7F2] pt-10 pb-6 border-b border-[#EADBCC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Title and Search Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#8C5E35]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gifting Collections & Creations</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1810] mt-1">
              Explore ChocoBloom Boutique
            </h2>
            <p className="text-xs sm:text-sm text-[#7B6256] mt-0.5">
              Showing {itemCount} handcrafted items with direct WhatsApp ordering
            </p>
          </div>

          {/* Search Bar & Stock Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9E8274]" />
              <input
                type="text"
                placeholder="Search by name, CD code..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-white border border-[#DAC9B7] rounded-xl text-[#2C1810] placeholder-[#A68F84] focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]/50"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9E8274] hover:text-[#2C1810]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1 p-1 bg-[#F1E6DA] rounded-xl border border-[#DFCEBD]">
              <button
                onClick={() => onStockFilterChange('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                  stockFilter === 'all'
                    ? 'bg-white text-[#2C1810] shadow-xs'
                    : 'text-[#6D5144] hover:text-[#2C1810]'
                }`}
              >
                All Items
              </button>
              <button
                onClick={() => onStockFilterChange('in_stock')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                  stockFilter === 'in_stock'
                    ? 'bg-white text-[#2C1810] shadow-xs font-semibold'
                    : 'text-[#6D5144] hover:text-[#2C1810]'
                }`}
              >
                In Stock Only
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Category Segmented Bar */}
        <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
          <div className="flex items-center gap-2 min-w-max">
            {productCategories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#2C1810] text-[#FFFDF9] shadow-md shadow-[#2C1810]/20 font-semibold'
                      : 'bg-white hover:bg-[#F7EFE6] text-[#5C4134] border border-[#E8DACB]'
                  }`}
                >
                  <span className="text-base leading-none">{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

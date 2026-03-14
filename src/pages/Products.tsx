import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { wpService } from '../services/wp-api';
import type { WPProduct, WPCategory } from '../types/wordpress';
import ProductCard from '../components/ProductCard';
import { 
  Search, 
  SlidersHorizontal, 
  LayoutGrid, 
  List, 
  ArrowUpDown,
  ShoppingBag,
  Loader2,
  Filter
} from 'lucide-react';

const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<WPProduct[]>([]);
  const [categories, setCategories] = useState<WPCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState('date');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(
    searchParams.get('category') ? parseInt(searchParams.get('category')!) : null
  );

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const cats = await wpService.getCategories();
        setCategories(cats);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params: Record<string, string | number> = { 
          per_page: 20,
          orderby: sortBy,
          search: searchTerm
        };
        if (selectedCategory) {
          params.category = selectedCategory;
        }
        const data = await wpService.getProducts(params);
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products from the store.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [sortBy, searchTerm, selectedCategory]);

  useEffect(() => {
    const newParams = new URLSearchParams();
    if (searchTerm) newParams.set('search', searchTerm);
    if (selectedCategory) newParams.set('category', selectedCategory.toString());
    setSearchParams(newParams);
  }, [searchTerm, selectedCategory, setSearchParams]);

  const categoryTree = categories.filter(c => c.parent === 0).map(parent => ({
    ...parent,
    children: categories.filter(c => c.parent === parent.id)
  }));

  if (loading && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white">
        <div className="relative mb-6">
          <div className="w-24 h-24 bg-brand-blue/5 rounded-full flex items-center justify-center">
            <img 
              src="https://bidsnbuy.ng/wp-content/uploads/2025/11/Bidnbuylogo-removebg-preview.png" 
              alt="Store Loading" 
              className="h-14 w-auto object-contain animate-pulse"
            />
          </div>
          <div className="absolute -bottom-1 -right-1">
            <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
          </div>
        </div>
        <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Browsing Inventory...</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-3 text-brand-blue font-black text-sm tracking-widest uppercase mb-4">
            <ShoppingBag className="w-5 h-5" />
            <span>Official Store</span>
          </div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tight">
            Browse All <span className="text-gray-400">Products</span>
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar: Categories & Subcategories */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm sticky top-32">
              <div className="flex items-center space-x-2 text-brand-blue font-black text-xs uppercase tracking-widest mb-8">
                <Filter className="w-4 h-4" />
                <span>Departments</span>
              </div>

              <div className="space-y-6">
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left text-sm font-black uppercase tracking-widest transition-colors ${!selectedCategory ? 'text-brand-blue' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  All Products
                </button>

                {categoryTree.map((parent) => (
                  <div key={parent.id} className="space-y-3">
                    <button 
                      onClick={() => setSelectedCategory(parent.id)}
                      className={`w-full text-left text-sm font-black uppercase tracking-widest transition-colors flex items-center justify-between group ${selectedCategory === parent.id ? 'text-brand-blue' : 'text-gray-900 hover:text-brand-blue'}`}
                    >
                      <span>{parent.name}</span>
                      <span className="text-[10px] text-gray-300 font-bold group-hover:text-brand-blue">{parent.count}</span>
                    </button>

                    {/* Subcategories */}
                    {parent.children.length > 0 && (
                      <div className="pl-4 space-y-2 border-l-2 border-gray-50 ml-1">
                        {parent.children.map((child) => (
                          <button 
                            key={child.id}
                            onClick={() => setSelectedCategory(child.id)}
                            className={`w-full text-left text-xs font-bold transition-colors block py-1 ${selectedCategory === child.id ? 'text-brand-orange' : 'text-gray-400 hover:text-brand-blue'}`}
                          >
                            {child.name}
                            <span className="ml-2 text-[9px] opacity-50">({child.count})</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Price Filter Mockup or other filters can go here */}
              <div className="mt-12 pt-8 border-t border-gray-50">
                 <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Price Range</h4>
                 <div className="space-y-4">
                    <div className="h-1.5 bg-gray-100 rounded-full relative">
                       <div className="absolute inset-y-0 left-0 right-1/4 bg-brand-blue rounded-full" />
                       <div className="absolute top-1/2 left-0 -translate-y-1/2 w-4 h-4 bg-white border-2 border-brand-blue rounded-full shadow-md cursor-pointer" />
                       <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-4 h-4 bg-white border-2 border-brand-blue rounded-full shadow-md cursor-pointer" />
                    </div>
                    <div className="flex justify-between text-[10px] font-black text-gray-900">
                       <span>₦0</span>
                       <span>₦1.5M+</span>
                    </div>
                 </div>
              </div>
            </div>
          </aside>

          {/* Main Grid */}
          <div className="flex-grow">
            {/* Toolbar */}
            <div className="flex flex-col lg:flex-row gap-6 justify-between items-center mb-12 bg-white p-6 rounded-[30px] shadow-sm border border-gray-100">
              <div className="relative w-full lg:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search items..." 
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-brand-blue transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-4 w-full lg:w-auto">
                <div className="flex items-center bg-gray-50 rounded-2xl p-1 border border-gray-100">
                  <button className="p-3 rounded-xl bg-white shadow-sm text-brand-blue">
                    <LayoutGrid className="w-5 h-5" />
                  </button>
                  <button className="p-3 rounded-xl text-gray-400 hover:text-gray-600">
                    <List className="w-5 h-5" />
                  </button>
                </div>

                <div className="relative flex-grow lg:flex-grow-0">
                  <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select 
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-10 text-sm font-bold appearance-none cursor-pointer focus:ring-2 focus:ring-brand-blue"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="date">Newest First</option>
                    <option value="price">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="popularity">Most Popular</option>
                  </select>
                </div>

                <button className="bg-gray-900 text-white p-4 rounded-2xl hover:bg-brand-blue transition-colors shadow-xl shadow-gray-200">
                  <SlidersHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            {error ? (
              <div className="text-center py-20 bg-red-50 rounded-[40px] border border-red-100">
                <p className="text-red-600 font-bold text-lg">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 bg-red-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 transition-all"
                >
                  Retry
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                
                {products.length === 0 && (
                  <div className="text-center py-32 bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Search className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-500 font-medium">Try adjusting your search or filters.</p>
                  </div>
                )}
                
                {products.length > 0 && (
                  <div className="mt-20 text-center">
                    <button className="bg-white border-2 border-gray-100 text-gray-900 px-12 py-5 rounded-2xl font-black hover:border-brand-blue hover:text-brand-blue transition-all duration-300 shadow-sm">
                      Load More Products
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
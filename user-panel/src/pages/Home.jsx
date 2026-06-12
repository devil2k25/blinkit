import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Zap, ShieldCheck, Clock, Star } from 'lucide-react'
import Banner from '../components/ui/Banner'
import CategoryCard from '../components/ui/CategoryCard'
import ProductCard from '../components/ui/ProductCard'
import { CATEGORIES, PRODUCTS } from '../utils/mockData'

const FEATURES = [
  { icon: <Zap className="w-6 h-6 text-primary" />, title: '10-Min Delivery', desc: 'Get groceries at your door in 10 minutes or less' },
  { icon: <ShieldCheck className="w-6 h-6 text-primary" />, title: 'Quality Guarantee', desc: 'Fresh, high-quality products with easy returns' },
  { icon: <Clock className="w-6 h-6 text-primary" />, title: 'Open 24/7', desc: 'Order anytime, day or night. We are always open' },
  { icon: <Star className="w-6 h-6 text-primary" />, title: 'Best Prices', desc: 'Competitive prices with regular deals and offers' },
]

export default function Home() {
  const fruitsProducts = PRODUCTS.filter(p => p.category === 'cat_1')
  const dairyProducts = PRODUCTS.filter(p => p.category === 'cat_2')
  const snackProducts = PRODUCTS.filter(p => p.category === 'cat_5')
  const topDeals = PRODUCTS.filter(p => p.discount >= 10).slice(0, 8)

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-10">
      {/* Hero Banner */}
      <Banner />

      {/* Categories */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title mb-0">Shop by Category</h2>
          <Link to="/category/cat_1" className="text-primary text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
            See all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
          {CATEGORIES.map((cat) => (
            <div key={cat._id} className="flex-shrink-0">
              <CategoryCard category={cat} />
            </div>
          ))}
        </div>
      </section>

      {/* Features Strip */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {FEATURES.map((f, i) => (
          <div key={i} className="card p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              {f.icon}
            </div>
            <div>
              <h3 className="font-bold text-dark text-sm">{f.title}</h3>
              <p className="text-xs text-gray-500 mt-0.5 leading-snug">{f.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Top Deals */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="section-title mb-0">🔥 Top Deals</h2>
            <span className="bg-yellow text-dark text-xs font-black px-2 py-0.5 rounded-full">
              SALE
            </span>
          </div>
          <Link to="/category/cat_1" className="text-primary text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {topDeals.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="rounded-2xl gradient-green p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-white text-center sm:text-left">
          <p className="text-sm font-semibold text-green-200 mb-1">Limited Time Offer</p>
          <h2 className="text-2xl sm:text-3xl font-black">FREE Delivery</h2>
          <p className="text-green-100 mt-1">On your first 3 orders. No minimum order value!</p>
        </div>
        <div className="flex flex-col items-center sm:items-end gap-3">
          <span className="text-5xl">🛵</span>
          <Link to="/register" className="btn-yellow px-6 py-2.5 rounded-xl font-black text-sm">
            Sign Up Now
          </Link>
        </div>
      </section>

      {/* Fresh Fruits & Vegetables */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title mb-0">🥦 Fresh Fruits &amp; Vegetables</h2>
          <Link
            to="/category/cat_1"
            className="text-primary text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
          >
            See all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {fruitsProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* Dairy & Eggs */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title mb-0">🥛 Dairy &amp; Eggs</h2>
          <Link
            to="/category/cat_2"
            className="text-primary text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
          >
            See all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {dairyProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* Snacks & Munchies */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title mb-0">🍿 Snacks &amp; Munchies</h2>
          <Link
            to="/category/cat_5"
            className="text-primary text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
          >
            See all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {snackProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* App Download Banner */}
      <section className="card p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="text-center sm:text-left flex-1">
          <span className="text-yellow text-sm font-bold">📱 Mobile App</span>
          <h2 className="text-2xl font-black text-white mt-1">Get the Blinkit App</h2>
          <p className="text-gray-400 text-sm mt-2">Download now and get ₹100 off on your first order</p>
          <div className="flex gap-3 mt-4 justify-center sm:justify-start">
            <button className="bg-white text-dark text-xs font-bold px-4 py-2 rounded-lg hover:bg-yellow transition-colors">
              🍎 App Store
            </button>
            <button className="bg-white text-dark text-xs font-bold px-4 py-2 rounded-lg hover:bg-yellow transition-colors">
              🤖 Play Store
            </button>
          </div>
        </div>
        <div className="text-8xl">📱</div>
      </section>
    </div>
  )
}

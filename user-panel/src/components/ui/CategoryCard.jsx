import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function CategoryCard({ category }) {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(`/category/${category._id}`)}
      className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:shadow-md transition-all active:scale-95 min-w-20 group"
      style={{ backgroundColor: category.color }}
    >
      <span className="text-3xl group-hover:scale-110 transition-transform duration-200">
        {category.emoji}
      </span>
      <span
        className="text-xs font-bold text-center leading-tight"
        style={{ color: category.textColor }}
      >
        {category.name}
      </span>
    </button>
  )
}

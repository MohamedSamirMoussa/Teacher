"use client";

import { Category } from "@/app/types/reports";
import { useState } from "react";

type Props = {
  categories: Category[];
  selectedCategory: string;

  onSelect: (id: string) => void;
  onAdd: (category: Category) => void;
};

const CategorySelector = ({
  categories,
  selectedCategory,
  onSelect,
  onAdd,
}: Props) => {
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleAddCategory = () => {
    const name = newCategoryName.trim();

    if (!name) return;

    const newCategory: Category = {
      id: crypto.randomUUID(),
      name: name.startsWith("مجال") ? name : `مجال ${name}`,
    };

    onAdd(newCategory);

    // اختار المجال الجديد مباشرة
    onSelect(newCategory.id);

    setNewCategoryName("");
    setShowAddCategory(false);
  };

  return (
    <div className="no-print mb-10 rounded-2xl border border-gray-200 bg-[#d7ebe5] p-3">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {categories.map((category) => {
          const active = selectedCategory === category.id;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelect(category.id)}
              className={`rounded-md px-6 py-4 text-center text-sm font-bold transition-all ${
                active
                  ? "bg-[#118578] text-white"
                  : "text-gray-900 hover:bg-white/50"
              }`}
            >
              {category.name}
            </button>
          );
        })}

        {/* Add Category */}
        {!showAddCategory && (
          <button
            type="button"
            onClick={() => setShowAddCategory(true)}
            className="rounded-md border-2 border-dashed border-[#118578]/40 px-6 py-4 text-sm font-bold text-[#118578] transition hover:bg-white/50"
          >
            + إضافة مجال جديد
          </button>
        )}
      </div>

      {showAddCategory && (
        <div className="mt-4 rounded-xl bg-white p-4">
          <label className="mb-2 block text-sm font-bold text-gray-800">
            اسم المجال الجديد
          </label>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddCategory();
                }
              }}
              placeholder="مثال: التطوع والخدمة المجتمعية"
              autoFocus
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#118578]"
            />

            <button
              type="button"
              onClick={handleAddCategory}
              className="rounded-lg bg-[#118578] px-6 py-3 font-bold text-white transition hover:bg-[#0d7167]"
            >
              إضافة
            </button>

            <button
              type="button"
              onClick={() => {
                setShowAddCategory(false);
                setNewCategoryName("");
              }}
              className="rounded-lg border border-gray-300 px-6 py-3 font-bold text-gray-600"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySelector;

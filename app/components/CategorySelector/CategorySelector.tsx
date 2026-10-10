"use client";

import {
  useState,
} from "react";

import {
  Category,
} from "@/app/types/reports";

type Props = {
  categories:
    Category[];

  selectedCategory:
    string;

  onSelect: (
    id: string,
  ) => void;

  onAdd: (
    category: Category,
  ) => void;
};

const CategorySelector = ({
  categories,
  selectedCategory,
  onSelect,
  onAdd,
}: Props) => {
  const [
    showAddCategory,
    setShowAddCategory,
  ] = useState(false);

  const [
    newCategoryName,
    setNewCategoryName,
  ] = useState("");

  /* =========================================
     Add Category
  ========================================= */

  const handleAddCategory =
    () => {
      const name =
        newCategoryName.trim();

      if (!name) {
        return;
      }

      const newCategory: Category =
        {
          id:
            crypto.randomUUID(),

          name,
        };

      onAdd(
        newCategory,
      );

      onSelect(
        newCategory.id,
      );

      setNewCategoryName(
        "",
      );

      setShowAddCategory(
        false,
      );
    };

  /* =========================================
     Cancel
  ========================================= */

  const handleCancel =
    () => {
      setShowAddCategory(
        false,
      );

      setNewCategoryName(
        "",
      );
    };

  return (
    <div
      className="
        no-print

        mb-8

        rounded-2xl

        border
        border-gray-200

        bg-white

        p-4

        shadow-sm

        sm:p-6
      "
    >
      {/* =====================================
          Header
      ====================================== */}

      <div
        className="
          mb-5

          flex
          items-start
          justify-between
          gap-4
        "
      >
        <div>
          <h2
            className="
              text-base
              font-bold
              text-gray-900

              sm:text-lg
            "
          >
            مجال البرنامج
          </h2>

          <p
            className="
              mt-1

              text-xs
              leading-5
              text-gray-500

              sm:text-sm
            "
          >
            اختر المجال المناسب
            للتقرير أو أضف مجالًا
            جديدًا.
          </p>
        </div>

        <span
          className="
            shrink-0

            rounded-full

            bg-gray-100

            px-3
            py-1.5

            text-xs
            font-semibold
            text-gray-500
          "
        >
          {
            categories.length
          }{" "}
          مجالات
        </span>
      </div>

      {/* =====================================
          Categories
      ====================================== */}

      <div
        className="
          grid
          grid-cols-2
          gap-2.5

          sm:gap-3

          lg:grid-cols-3
        "
      >
        {categories.map(
          (
            category,
          ) => {
            const active =
              selectedCategory ===
              category.id;

            return (
              <button
                key={
                  category.id
                }
                type="button"
                onClick={() =>
                  onSelect(
                    category.id,
                  )
                }
                className={`
                  group

                  relative

                  min-h-[58px]

                  rounded-xl

                  border

                  px-3
                  py-3

                  text-center
                  text-xs
                  font-semibold
                  leading-5

                  transition-all
                  duration-200

                  sm:min-h-[64px]
                  sm:px-4
                  sm:text-sm

                  ${
                    active
                      ? `
                        border-black
                        bg-black
                        text-white
                        shadow-sm
                      `
                      : `
                        border-gray-200
                        bg-white
                        text-gray-700

                        hover:border-gray-400
                        hover:bg-gray-50
                      `
                  }
                `}
              >
                {/* Active indicator */}

                <span
                  className={`
                    absolute

                    right-2.5
                    top-2.5

                    h-2
                    w-2

                    rounded-full

                    transition

                    ${
                      active
                        ? "bg-white"
                        : "bg-gray-200 group-hover:bg-gray-400"
                    }
                  `}
                />

                <span className="block px-2">
                  {
                    category.name
                  }
                </span>
              </button>
            );
          },
        )}

        {/* =================================
            Add Category Button
        ================================== */}

        {!showAddCategory && (
          <button
            type="button"
            onClick={() =>
              setShowAddCategory(
                true,
              )
            }
            className="
              group

              flex
              min-h-[58px]
              items-center
              justify-center
              gap-2

              rounded-xl

              border
              border-dashed
              border-gray-300

              bg-gray-50/60

              px-3
              py-3

              text-xs
              font-semibold
              text-gray-600

              transition-all
              duration-200

              hover:border-gray-800
              hover:bg-white
              hover:text-gray-900

              sm:min-h-[64px]
              sm:px-4
              sm:text-sm
            "
          >
            <span
              className="
                flex
                h-6
                w-6
                shrink-0
                items-center
                justify-center

                rounded-full

                border
                border-gray-300

                bg-white

                text-base
                font-normal
                leading-none

                transition

                group-hover:border-gray-800
              "
            >
              +
            </span>

            <span>
              إضافة مجال جديد
            </span>
          </button>
        )}
      </div>

      {/* =====================================
          Add Category Form
      ====================================== */}

      {showAddCategory && (
        <div
          className="
            mt-5

            rounded-xl

            border
            border-gray-200

            bg-gray-50

            p-3

            sm:p-4
          "
        >
          <div className="mb-3">
            <h3
              className="
                text-sm
                font-bold
                text-gray-900
              "
            >
              إضافة مجال جديد
            </h3>

            <p
              className="
                mt-1

                text-xs
                text-gray-500
              "
            >
              اكتب اسم المجال ثم اضغط
              إضافة.
            </p>
          </div>

          <div
            className="
              flex
              flex-col
              gap-2.5

              sm:flex-row
              sm:items-end
            "
          >
            <div className="min-w-0 flex-1">
              <label
                htmlFor="new-category"
                className="
                  mb-1.5
                  block

                  text-xs
                  font-semibold
                  text-gray-700

                  sm:text-sm
                "
              >
                اسم المجال
              </label>

              <input
                id="new-category"
                type="text"
                value={
                  newCategoryName
                }
                onChange={(
                  event,
                ) =>
                  setNewCategoryName(
                    event.target
                      .value,
                  )
                }
                onKeyDown={(
                  event,
                ) => {
                  if (
                    event.key ===
                    "Enter"
                  ) {
                    event.preventDefault();

                    handleAddCategory();
                  }

                  if (
                    event.key ===
                    "Escape"
                  ) {
                    handleCancel();
                  }
                }}
                placeholder="مثال: التطوع والخدمة المجتمعية"
                autoFocus
                className="
                  w-full
                  min-w-0

                  rounded-xl

                  border
                  border-gray-200

                  bg-white

                  px-3
                  py-2.5

                  text-sm
                  text-gray-900

                  outline-none

                  transition

                  placeholder:text-gray-400

                  focus:border-gray-900
                  focus:ring-2
                  focus:ring-gray-900/5

                  sm:px-4
                  sm:py-3
                "
              />
            </div>

            <div
              className="
                grid
                grid-cols-2
                gap-2

                sm:flex
                sm:shrink-0
              "
            >
              <button
                type="button"
                onClick={
                  handleAddCategory
                }
                disabled={
                  !newCategoryName.trim()
                }
                className="
                  rounded-xl

                  bg-black

                  px-5
                  py-2.5

                  text-sm
                  font-semibold
                  text-white

                  transition

                  hover:bg-gray-800

                  disabled:cursor-not-allowed
                  disabled:bg-gray-300
                  disabled:text-gray-500

                  sm:py-3
                "
              >
                إضافة
              </button>

              <button
                type="button"
                onClick={
                  handleCancel
                }
                className="
                  rounded-xl

                  border
                  border-gray-300

                  bg-white

                  px-5
                  py-2.5

                  text-sm
                  font-semibold
                  text-gray-600

                  transition

                  hover:border-gray-500
                  hover:text-gray-900

                  sm:py-3
                "
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySelector;
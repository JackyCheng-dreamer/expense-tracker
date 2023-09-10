import React from "react";

function CategorySelect({ selectedCategory, onCategoryChange }) {
  return (
    <select
      value={selectedCategory}
      onChange={(e) => onCategoryChange(e.target.value)}
    >
      <option value="Food">Food</option>
      <option value="Transport">Transport</option>
      <option value="Barista">Barista</option>
      <option value="Receptionist">Receptionist</option>
      <option value="Tutoring">Tutoring</option>
      <option value="Clothing">Clothing</option>
      <option value="Going Out">Going Out</option>
    </select>
  );
}

export default CategorySelect;

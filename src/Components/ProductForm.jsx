import React from "react";

function ProductForm() {
  return (
    <form>
      <h2>Add New Product</h2>

      <input placeholder="Product Name" />
      <input placeholder="Product Type" />
      <input type="number" placeholder="Sales Price" />
      <input type="number" placeholder="Cost Price" />

      <button type="button">Add Product</button>
    </form>
  );
}

export default ProductForm;
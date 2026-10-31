import React, { useState } from "react";
import { supabase } from "../supabase";

function ProductForm() {
  // 1. Set up state variables
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [salesPrice, setSalesPrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from("products")
        .insert([
          {
            name: name,
            type: type,
            // Convert entered rupee amount to integer paise
            sales_price: Math.round(parseFloat(salesPrice) * 100),
            cost_price: Math.round(parseFloat(costPrice) * 100),
          },
        ]);

      if (error) throw error;
      
      alert("Product added successfully!");
      // Clear form after success
      setName("");
      setType("");
      setSalesPrice("");
      setCostPrice("");
    } catch (error) {
      console.error("Error adding product:", error.message);
      alert("Failed to add product: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Bind state to form inputs
  return (
    <form onSubmit={handleSubmit}>
      <h2>Add New Product</h2>

      <input 
        placeholder="Product Name" 
        value={name}
        onChange={(e) => setName(e.target.value)}
        required 
      />
      
      <input 
        placeholder="Product Type" 
        value={type}
        onChange={(e) => setType(e.target.value)}
      />
      
      <input 
        type="number" 
        placeholder="Sales Price (in ₹)" 
        value={salesPrice}
        onChange={(e) => setSalesPrice(e.target.value)}
        required 
      />
      
      <input 
        type="number" 
        placeholder="Cost Price (in ₹)" 
        value={costPrice}
        onChange={(e) => setCostPrice(e.target.value)}
        required 
      />

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : "Add Product"}
      </button>
    </form>
  );
}

export default ProductForm;
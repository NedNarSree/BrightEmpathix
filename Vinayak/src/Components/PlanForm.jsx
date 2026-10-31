import React, { useState } from "react";
import { supabase } from "../supabase";

function PlanForm() {
  const [productId, setProductId] = useState("");
  const [name, setName] = useState("");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [price, setPrice] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from("plans")
        .insert([
          {
            product_id: productId,
            name: name,
            billing_cycle: billingCycle,
            price: Math.round(parseFloat(price) * 100), 
            available_from: availableFrom,
          },
        ]);

      if (error) throw error;
      
      alert("Plan created successfully!");
      setName("");
      setPrice("");
      setProductId("");
      setAvailableFrom("");
    } catch (error) {
      console.error("Error creating plan:", error.message);
      alert("Failed to create plan: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Subscription Plan</h2>

      <input 
        placeholder="Product ID (UUID)" 
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
        required 
      />
      
      <input 
        placeholder="Plan Name" 
        value={name}
        onChange={(e) => setName(e.target.value)}
        required 
      />
      
      <input 
        type="number" 
        placeholder="Plan Price (in ₹)" 
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required 
      />

      <select 
        value={billingCycle} 
        onChange={(e) => setBillingCycle(e.target.value)}
      >
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
        <option value="yearly">Yearly</option>
      </select>

      <input 
        type="date" 
        placeholder="Available From" 
        value={availableFrom}
        onChange={(e) => setAvailableFrom(e.target.value)}
        required 
      />

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Plan"}
      </button>
    </form>
  );
}

export default PlanForm;

import { supabase } from "../lib/supabase";

// Convert a database product into the format used by the React UI.
// Database prices are stored in paise; the UI displays rupees.
function fromDatabase(product) {
  return {
    id: product.id,
    name: product.name,
    type: product.type || "",
    salesPrice: Number(product.sales_price) / 100,
    costPrice: Number(product.cost_price) / 100,
    notes: product.notes || "",
  };
}

// Convert the React form data into database columns.
function toDatabase(product) {
  return {
    name: product.name,
    type: product.type,
    sales_price: Math.round(Number(product.salesPrice) * 100),
    cost_price: Math.round(Number(product.costPrice) * 100),
    notes: product.notes,
  };
}

// Get all products
export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data.map(fromDatabase);
}

// Add a new product
export async function addProduct(product) {
  const { data, error } = await supabase
    .from("products")
    .insert([toDatabase(product)])
    .select()
    .single();

  if (error) throw error;

  return fromDatabase(data);
}

// Update an existing product
export async function updateProduct(id, product) {
  const { data, error } = await supabase
    .from("products")
    .update(toDatabase(product))
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return fromDatabase(data);
}

// Delete a product
export async function deleteProduct(id) {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

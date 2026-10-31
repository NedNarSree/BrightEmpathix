
import { supabase } from "../lib/supabase";

// Convert Supabase data into React format
function fromDatabase(plan) {
  return {
    id: plan.id,
    productId: String(plan.product_id),
    name: plan.name,
    billingCycle:
      plan.billing_cycle.charAt(0).toUpperCase() +
      plan.billing_cycle.slice(1),
    price: Number(plan.price) / 100,
    minQuantity: plan.min_quantity,
    availableFrom: plan.available_from || "",
    availableTo: plan.available_to || "",
  };
}

// Convert React form data into Supabase format
function toDatabase(plan) {
  return {
    product_id: plan.productId,
    name: plan.name.trim(),
    billing_cycle: plan.billingCycle.toLowerCase(),
    price: Math.round(Number(plan.price) * 100),
    min_quantity: Number(plan.minQuantity),
    available_from: plan.availableFrom || null,
    available_to: plan.availableTo || null,
  };
}

// Fetch plans
export async function getPlans() {
  const { data, error } = await supabase
    .from("plans")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data.map(fromDatabase);
}

// Add plan
export async function addPlan(plan) {
  const { data, error } = await supabase
    .from("plans")
    .insert([toDatabase(plan)])
    .select()
    .single();

  if (error) throw error;

  return fromDatabase(data);
}

// Update plan
export async function updatePlan(id, plan) {
  const { data, error } = await supabase
    .from("plans")
    .update(toDatabase(plan))
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return fromDatabase(data);
}

// Delete plan
export async function deletePlan(id) {
  const { error } = await supabase
    .from("plans")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

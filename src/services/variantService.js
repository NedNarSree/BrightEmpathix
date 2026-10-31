
import { supabase } from "../lib/supabase";

function fromDatabase(variant) {
  return {
    id: variant.id,
    productId: String(variant.product_id),
    name: variant.name,
    priceAdjustment: Number(variant.price_adjustment) / 100,
  };
}

function toDatabase(variant) {
  return {
    product_id: variant.productId,
    name: variant.name.trim(),
    price_adjustment: Math.round(
      Number(variant.priceAdjustment) * 100
    ),
  };
}

export async function getVariants(productId) {
  const { data, error } = await supabase
    .from("product_variants")
    .select("*")
    .eq("product_id", productId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return data.map(fromDatabase);
}

export async function addVariant(variant) {
  const { data, error } = await supabase
    .from("product_variants")
    .insert([toDatabase(variant)])
    .select()
    .single();

  if (error) throw error;

  return fromDatabase(data);
}

// Update a variant
export async function updateVariant(id, variant) {
  const { data, error } = await supabase
    .from("product_variants")
    .update(toDatabase(variant))
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return fromDatabase(data);
}

export async function deleteVariant(id) {
  const { error } = await supabase
    .from("product_variants")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

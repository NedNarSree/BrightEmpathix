
import { useEffect, useState } from "react";
import "../Products.css";

import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";

import {
  getVariants,
  addVariant,
  updateVariant,
  deleteVariant,
} from "../services/variantService";

function Products({ products, setProducts, plans }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Variant states
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [variantsLoading, setVariantsLoading] = useState(false);
  const [variantError, setVariantError] = useState("");
  const [variantSaving, setVariantSaving] = useState(false);
  const [editingVariantId, setEditingVariantId] = useState(null);

  const emptyForm = {
    name: "",
    type: "Software",
    salesPrice: "",
    costPrice: "",
    notes: "",
  };

  const emptyVariantForm = {
    name: "",
    priceAdjustment: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [variantForm, setVariantForm] = useState(emptyVariantForm);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error("Error loading products:", err);
        setError(err.message || "Could not load products.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [setProducts]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const productData = {
      ...form,
      name: form.name.trim(),
      salesPrice: Number(form.salesPrice),
      costPrice: Number(form.costPrice),
      notes: form.notes.trim(),
    };

    if (
      !productData.name ||
      form.salesPrice === "" ||
      form.costPrice === "" ||
      !Number.isFinite(productData.salesPrice) ||
      !Number.isFinite(productData.costPrice) ||
      productData.salesPrice < 0 ||
      productData.costPrice < 0
    ) {
      alert("Please enter valid product details.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      if (editingId !== null) {
        const updatedProduct = await updateProduct(
          editingId,
          productData
        );

        setProducts((previous) =>
          previous.map((product) =>
            product.id === editingId ? updatedProduct : product
          )
        );
      } else {
        const newProduct = await addProduct(productData);
        setProducts((previous) => [...previous, newProduct]);
      }

      setForm(emptyForm);
      setShowForm(false);
      setEditingId(null);
    } catch (err) {
      console.error("Error saving product:", err);
      setError(err.message || "Could not save product.");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(product) {
    setForm({
      name: product.name,
      type: product.type,
      salesPrice: product.salesPrice,
      costPrice: product.costPrice,
      notes: product.notes,
    });

    setEditingId(product.id);
    setShowForm(true);
  }

  async function handleDelete(id) {
    const isLinkedToPlan = plans.some(
      (plan) => String(plan.productId) === String(id)
    );

    if (isLinkedToPlan) {
      alert("This product is linked to a plan. Delete the plan first.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      setError("");

      await deleteProduct(id);

      setProducts((previous) =>
        previous.filter((product) => product.id !== id)
      );
    } catch (err) {
      console.error("Error deleting product:", err);
      setError(err.message || "Could not delete product.");
    }
  }

  function handleCancel() {
    setForm(emptyForm);
    setShowForm(false);
    setEditingId(null);
  }

  // Open variant manager for a product
  async function handleManageVariants(product) {
    setSelectedProduct(product);
    setVariants([]);
    setVariantForm(emptyVariantForm);
    setEditingVariantId(null);
    setVariantError("");

    try {
      setVariantsLoading(true);

      const data = await getVariants(product.id);
      setVariants(data);
    } catch (err) {
      console.error("Error loading variants:", err);
      setVariantError(err.message || "Could not load variants.");
    } finally {
      setVariantsLoading(false);
    }
  }

  function handleVariantChange(e) {
    const { name, value } = e.target;

    setVariantForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // Add or update a variant
  async function handleVariantSubmit(e) {
    e.preventDefault();

    const name = variantForm.name.trim();
    const priceAdjustment = Number(variantForm.priceAdjustment);

    if (
      !name ||
      variantForm.priceAdjustment === "" ||
      !Number.isFinite(priceAdjustment)
    ) {
      setVariantError("Please enter a valid variant name and price adjustment.");
      return;
    }

    try {
      setVariantSaving(true);
      setVariantError("");

      const variantData = {
        productId: selectedProduct.id,
        name,
        priceAdjustment,
      };

      if (editingVariantId) {
        const updatedVariant = await updateVariant(
          editingVariantId,
          variantData
        );

        setVariants((previous) =>
          previous.map((variant) =>
            variant.id === editingVariantId ? updatedVariant : variant
          )
        );
      } else {
        const newVariant = await addVariant(variantData);
        setVariants((previous) => [...previous, newVariant]);
      }

      setVariantForm(emptyVariantForm);
      setEditingVariantId(null);
    } catch (err) {
      console.error("Error saving variant:", err);
      setVariantError(err.message || "Could not save variant.");
    } finally {
      setVariantSaving(false);
    }
  }

  function handleEditVariant(variant) {
    setVariantForm({
      name: variant.name,
      priceAdjustment: String(variant.priceAdjustment),
    });

    setEditingVariantId(variant.id);
    setVariantError("");
  }

  async function handleDeleteVariant(id) {
    if (!window.confirm("Delete this variant?")) {
      return;
    }

    try {
      setVariantError("");

      await deleteVariant(id);

      setVariants((previous) =>
        previous.filter((variant) => variant.id !== id)
      );

      if (editingVariantId === id) {
        setVariantForm(emptyVariantForm);
        setEditingVariantId(null);
      }
    } catch (err) {
      console.error("Error deleting variant:", err);
      setVariantError(err.message || "Could not delete variant.");
    }
  }

  function closeVariantManager() {
    setSelectedProduct(null);
    setVariants([]);
    setVariantForm(emptyVariantForm);
    setEditingVariantId(null);
    setVariantError("");
  }

  return (
    <div className="products-page">
      <div className="products-header">
        <div>
          <h2>Product Management</h2>
          <p>Manage your products, pricing and details.</p>
        </div>

        <button
          className="product-primary-btn"
          onClick={() => {
            setForm(emptyForm);
            setEditingId(null);
            setShowForm(true);
          }}
        >
          + Add Product
        </button>
      </div>

      <div className="product-stats">
        <div className="product-stat-card">
          <span>Total Products</span>
          <h3>{products.length}</h3>
        </div>

        <div className="product-stat-card">
          <span>Product Types</span>
          <h3>{new Set(products.map((p) => p.type)).size}</h3>
        </div>
      </div>

      {showForm && (
        <form className="product-form" onSubmit={handleSubmit}>
          <h3>{editingId !== null ? "Edit Product" : "Add New Product"}</h3>

          <div className="product-form-grid">
            <label>
              Product Name *
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
              />
            </label>

            <label>
              Product Type *
              <select name="type" value={form.type} onChange={handleChange}>
                <option>Software</option>
                <option>Service</option>
                <option>Physical Product</option>
              </select>
            </label>

            <label>
              Sales Price (₹) *
              <input
                type="number"
                name="salesPrice"
                min="0"
                step="0.01"
                value={form.salesPrice}
                onChange={handleChange}
                placeholder="Enter sales price"
                required
              />
            </label>

            <label>
              Cost Price (₹) *
              <input
                type="number"
                name="costPrice"
                min="0"
                step="0.01"
                value={form.costPrice}
                onChange={handleChange}
                placeholder="Enter cost price"
                required
              />
            </label>

            <label className="product-notes-field">
              Notes
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Additional product details"
                rows="3"
              />
            </label>
          </div>

          <div className="product-form-actions">
            <button
              type="button"
              className="product-cancel-btn"
              onClick={handleCancel}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="product-primary-btn"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId !== null
                ? "Save Changes"
                : "Create Product"}
            </button>
          </div>
        </form>
      )}

      {/* Variant Manager */}
      {selectedProduct && (
        <div className="product-form variant-manager">
          <div className="products-header">
            <div>
              <h3>Manage Variants</h3>
              <p>Product: {selectedProduct.name}</p>
            </div>

            <button
              type="button"
              className="product-cancel-btn"
              onClick={closeVariantManager}
            >
              Close
            </button>
          </div>

          {variantError && (
            <p style={{ color: "red", padding: "10px" }}>
              {variantError}
            </p>
          )}

          <form onSubmit={handleVariantSubmit}>
            <div className="product-form-grid">
              <label>
                Variant Name *
                <input
                  name="name"
                  value={variantForm.name}
                  onChange={handleVariantChange}
                  placeholder="e.g. Odoo Brand"
                  required
                />
              </label>

              <label>
                Price Adjustment (₹) *
                <input
                  type="number"
                  name="priceAdjustment"
                  step="0.01"
                  value={variantForm.priceAdjustment}
                  onChange={handleVariantChange}
                  placeholder="e.g. 560"
                  required
                />
              </label>
            </div>

            <div className="product-form-actions">
              {editingVariantId && (
                <button
                  type="button"
                  className="product-cancel-btn"
                  onClick={() => {
                    setVariantForm(emptyVariantForm);
                    setEditingVariantId(null);
                    setVariantError("");
                  }}
                >
                  Cancel Edit
                </button>
              )}

              <button
                type="submit"
                className="product-primary-btn"
                disabled={variantSaving}
              >
                {variantSaving
                  ? "Saving..."
                  : editingVariantId
                  ? "Update Variant"
                  : "Add Variant"}
              </button>
            </div>
          </form>

          <h4>Existing Variants</h4>

          {variantsLoading ? (
            <p>Loading variants...</p>
          ) : variants.length === 0 ? (
            <p>No variants added for this product yet.</p>
          ) : (
            <div className="product-table-scroll">
              <table className="product-table">
                <thead>
                  <tr>
                    <th>Variant Name</th>
                    <th>Price Adjustment</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {variants.map((variant) => (
                    <tr key={variant.id}>
                      <td className="product-name">{variant.name}</td>
                      <td>
                        ₹
                        {variant.priceAdjustment.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td>
                        <div className="product-actions">
                          <button
                            type="button"
                            className="product-edit-btn"
                            onClick={() => handleEditVariant(variant)}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="product-delete-btn"
                            onClick={() => handleDeleteVariant(variant.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <div className="product-table-card">
        {error && (
          <p style={{ color: "red", padding: "10px" }}>
            {error}
          </p>
        )}

        <div className="product-table-header">
          <h3>All Products</h3>

          <input
            className="product-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
          />
        </div>

        <div className="product-table-scroll">
          <table className="product-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Type</th>
                <th>Sales Price</th>
                <th>Cost Price</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="product-empty">
                    Loading products...
                  </td>
                </tr>
              ) : (
                <>
                  {filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="product-name">{product.name}</td>
                      <td>{product.type}</td>
                      <td>
                        ₹{product.salesPrice.toLocaleString("en-IN")}
                      </td>
                      <td>
                        ₹{product.costPrice.toLocaleString("en-IN")}
                      </td>
                      <td>{product.notes || "—"}</td>
                      <td>
                        <div className="product-actions">
                          <button
                            className="product-edit-btn"
                            onClick={() => handleEdit(product)}
                          >
                            Edit
                          </button>

                          <button
                            className="product-edit-btn"
                            onClick={() => handleManageVariants(product)}
                          >
                            Manage Variants
                          </button>

                          <button
                            className="product-delete-btn"
                            onClick={() => handleDelete(product.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan="6" className="product-empty">
                        No products found.
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Products;

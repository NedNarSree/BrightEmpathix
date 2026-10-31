
import { useState } from "react";
import "../Products.css";

function Products({ products, setProducts, plans }) {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const emptyForm = {
    name: "",
    type: "Software",
    salesPrice: "",
    costPrice: "",
    notes: "",
  };
  const [form, setForm] = useState(emptyForm);

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

  function handleSubmit(e) {
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

    if (editingId !== null) {
      setProducts((previous) =>
        previous.map((product) =>
          product.id === editingId
            ? { ...product, ...productData }
            : product
        )
      );
    } else {
      setProducts((previous) => [
        ...previous,
        {
          id: Date.now(),
          ...productData,
        },
      ]);
    }

    setForm(emptyForm);
    setShowForm(false);
    setEditingId(null);
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

  function handleDelete(id) {
    const isLinkedToPlan = plans.some(
      (plan) => String(plan.productId) === String(id)
    );

    if (isLinkedToPlan) {
      alert("This product is linked to a plan. Delete the plan first.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts((previous) =>
        previous.filter((product) => product.id !== id)
      );
    }
  }

  function handleCancel() {
    setForm(emptyForm);
    setShowForm(false);
    setEditingId(null);
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

            <button type="submit" className="product-primary-btn">
              {editingId !== null ? "Save Changes" : "Create Product"}
            </button>
          </div>
        </form>
      )}

      <div className="product-table-card">
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
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td className="product-name">{product.name}</td>
                  <td>{product.type}</td>
                  <td>₹{product.salesPrice.toLocaleString("en-IN")}</td>
                  <td>₹{product.costPrice.toLocaleString("en-IN")}</td>
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Products;

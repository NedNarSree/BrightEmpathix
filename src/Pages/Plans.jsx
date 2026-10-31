
import { useState, useEffect } from "react";
import "../Plans.css";

import {
  getPlans,
  addPlan,
  updatePlan,
  deletePlan,
} from "../services/planService";

function Plans({ products, plans, setPlans }) {
  const emptyForm = {
    name: "",
    productId: "",
    billingCycle: "Monthly",
    price: "",
    minQuantity: 1,
    availableFrom: "",
    availableTo: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);
const [error, setError] = useState("");
useEffect(() => {
  async function loadPlans() {
    try {
      setLoading(true);
      setError("");

      const data = await getPlans();
      setPlans(data);
    } catch (err) {
      console.error("Error loading plans:", err);
      setError(err.message || "Could not load plans.");
    } finally {
      setLoading(false);
    }
  }

  loadPlans();
}, [setPlans]);

  const filteredPlans = plans.filter((plan) =>
    plan.name.toLowerCase().includes(search.toLowerCase())
  );

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }


async function handleSubmit(e) {
  e.preventDefault();

  if (!form.name.trim()) {
    alert("Please enter a plan name.");
    return;
  }

  if (!form.productId) {
    alert("Please select a product.");
    return;
  }

  if (
    form.price === "" ||
    !Number.isFinite(Number(form.price)) ||
    Number(form.price) < 0 ||
    form.minQuantity === "" ||
    !Number.isInteger(Number(form.minQuantity)) ||
    Number(form.minQuantity) < 1
  ) {
    alert("Please enter a valid price and minimum quantity.");
    return;
  }

  if (
    form.availableFrom &&
    form.availableTo &&
    form.availableTo < form.availableFrom
  ) {
    alert("Availability end date cannot be before the start date.");
    return;
  }

  const planData = {
    ...form,
    price: Number(form.price),
    minQuantity: Number(form.minQuantity),
  };

  try {
    setSaving(true);
    setError("");

    if (editingId !== null) {
      const updatedPlan = await updatePlan(editingId, planData);

      setPlans((previous) =>
        previous.map((plan) =>
          plan.id === editingId ? updatedPlan : plan
        )
      );
    } else {
      const newPlan = await addPlan(planData);

      setPlans((previous) => [...previous, newPlan]);
    }

    handleCancel();
  } catch (err) {
    console.error("Error saving plan:", err);
    setError(err.message || "Could not save plan.");
  } finally {
    setSaving(false);
  }
}

  function handleEdit(plan) {
    setForm({
      name: plan.name,
      productId: plan.productId,
      billingCycle: plan.billingCycle,
      price: String(plan.price),
      minQuantity: String(plan.minQuantity),
      availableFrom: plan.availableFrom,
      availableTo: plan.availableTo,
    });

    setEditingId(plan.id);
    setShowForm(true);
  }

async function handleDelete(id) {
  if (!window.confirm("Are you sure you want to delete this plan?")) {
    return;
  }

  try {
    setError("");

    await deletePlan(id);

    setPlans((previous) =>
      previous.filter((plan) => plan.id !== id)
    );
  } catch (err) {
    console.error("Error deleting plan:", err);
    setError(err.message || "Could not delete plan.");
  }
}
  function handleCancel() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  }

  function getProductName(productId) {
    return (
      products.find((product) => String(product.id) === String(productId))
        ?.name || "Unknown product"
    );
  }

  return (
    <div className="plans-page">
      <div className="plans-header">
        <div>
          <h2>Plan Management</h2>
          <p>Create and manage subscription plans and billing cycles.</p>
        </div>

        <button
          className="plan-primary-btn"
          onClick={() => {
            setForm(emptyForm);
            setEditingId(null);
            setShowForm(true);
          }}
        >
          + Add Plan
        </button>
      </div>

      <div className="plan-stats">
        <div className="plan-stat-card">
          <span>Total Plans</span>
          <h3>{plans.length}</h3>
        </div>

        <div className="plan-stat-card">
          <span>Billing Cycles</span>
          <h3>{new Set(plans.map((plan) => plan.billingCycle)).size}</h3>
        </div>
      </div>

      {showForm && (
        <form className="plan-form" onSubmit={handleSubmit}>
          <h3>{editingId !== null ? "Edit Plan" : "Create New Plan"}</h3>

          <div className="plan-form-grid">
            <label>
              Plan Name *
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Business Pro Monthly"
                required
              />
            </label>

            <label>
              Select Product *
              <select
                name="productId"
                value={form.productId}
                onChange={handleChange}
                required
              >
                <option value="">Choose a product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Billing Cycle *
              <select
                name="billingCycle"
                value={form.billingCycle}
                onChange={handleChange}
                required
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </label>

            <label>
              Plan Price (₹) *
              <input
                type="number"
                name="price"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                placeholder="Enter plan price"
                required
              />
            </label>

            <label>
              Minimum Quantity *
              <input
                type="number"
                name="minQuantity"
                min="1"
                step="1"
                value={form.minQuantity}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Available From
              <input
                type="date"
                name="availableFrom"
                value={form.availableFrom}
                onChange={handleChange}
              />
            </label>

            <label>
              Available To
              <input
                type="date"
                name="availableTo"
                min={form.availableFrom || undefined}
                value={form.availableTo}
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="plan-form-actions">
            <button
              type="button"
              className="plan-cancel-btn"
              onClick={handleCancel}
            >
              Cancel
            </button>

            <button
  type="submit"
  className="plan-primary-btn"
  disabled={saving}
>
  {saving
    ? "Saving..."
    : editingId !== null
      ? "Save Changes"
      : "Create Plan"}
</button>
          </div>
        </form>
      )}

      <div className="plan-table-card">
        {error && (
  <p style={{ color: "red", padding: "10px" }}>
    {error}
  </p>
)}
        <div className="plan-table-header">
          <h3>All Plans</h3>

          <input
            className="plan-search"
            placeholder="Search plans..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="plan-table-scroll">
          <table className="plan-table">
            <thead>
              <tr>
                <th>Plan Name</th>
                <th>Product</th>
                <th>Billing Cycle</th>
                <th>Price</th>
                <th>Min. Quantity</th>
                <th>Availability</th>
                <th>Actions</th>
              </tr>
            </thead>

           
<tbody>
  {loading ? (
    <tr>
      <td colSpan="7" className="plan-empty">
        Loading plans...
      </td>
    </tr>
  ) : (
    <>
      {filteredPlans.map((plan) => (
        <tr key={plan.id}>
          <td className="plan-name">{plan.name}</td>
          <td>{getProductName(plan.productId)}</td>
          <td>
            <span className="billing-badge">
              {plan.billingCycle}
            </span>
          </td>
          <td>₹{plan.price.toLocaleString("en-IN")}</td>
          <td>{plan.minQuantity}</td>
          <td>
            {plan.availableFrom || "—"}
            {plan.availableTo
              ? ` to ${plan.availableTo}`
              : " onwards"}
          </td>
          <td>
            <div className="plan-actions">
              <button
                className="plan-edit-btn"
                onClick={() => handleEdit(plan)}
              >
                Edit
              </button>

              <button
                className="plan-delete-btn"
                onClick={() => handleDelete(plan.id)}
              >
                Delete
              </button>
            </div>
          </td>
        </tr>
      ))}

      {filteredPlans.length === 0 && (
        <tr>
          <td colSpan="7" className="plan-empty">
            No plans found.
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

export default Plans;

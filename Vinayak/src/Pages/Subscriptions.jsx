
import { useState } from "react";
import "./Subscriptions.css";

// Temporary sample customers
const customers = [
  { id: "C001", name: "Arun Kumar", email: "arun@gmail.com" },
  { id: "C002", name: "Meera Nair", email: "meera@gmail.com" },
  { id: "C003", name: "Rahul Das", email: "rahul@gmail.com" },
];

// Temporary sample plans
const plans = [
  { id: "P001", name: "Basic Plan", price: 499 },
  { id: "P002", name: "Standard Plan", price: 999 },
  { id: "P003", name: "Premium Plan", price: 1999 },
];

const initialFormData = {
  customer_id: "",
  plan_id: "",
  start_date: "",
  expiry_date: "",
  status: "Draft",
};

function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState(initialFormData);

  const selectedPlan = plans.find(
    (plan) => plan.id === formData.plan_id
  );

  const unitPrice = selectedPlan ? selectedPlan.price : "";

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const customer = customers.find(
      (c) => c.id === sub.customer_id
    );

    const plan = plans.find(
      (p) => p.id === sub.plan_id
    );

    const search = searchTerm.toLowerCase();

    const matchesSearch =
      sub.subscription_number.toLowerCase().includes(search) ||
      customer?.name.toLowerCase().includes(search) ||
      plan?.name.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "All" || sub.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleStatusChange(subscriptionId, newStatus) {
    setSubscriptions((previous) =>
      previous.map((sub) =>
        sub.id === subscriptionId
          ? { ...sub, status: newStatus }
          : sub
      )
    );
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (
      formData.expiry_date &&
      formData.expiry_date < formData.start_date
    ) {
      alert("Expiry date cannot be before start date.");
      return;
    }

    if (editingId) {
      setSubscriptions((previous) =>
        previous.map((sub) =>
          sub.id === editingId
            ? {
                ...sub,
                customer_id: formData.customer_id,
                plan_id: formData.plan_id,
                start_date: formData.start_date,
                expiry_date: formData.expiry_date || null,
                status: formData.status,
                unit_price: unitPrice,
              }
            : sub
        )
      );

      alert("Subscription updated successfully!");
    } else {
      const newSubscription = {
        id: String(Date.now()),
        subscription_number: `SUB-${Date.now()}`,
        customer_id: formData.customer_id,
        plan_id: formData.plan_id,
        start_date: formData.start_date,
        expiry_date: formData.expiry_date || null,
        status: formData.status,
        unit_price: unitPrice,
      };

      setSubscriptions((previous) => [
        ...previous,
        newSubscription,
      ]);

      alert("Subscription created successfully!");
    }

    setFormData(initialFormData);
    setEditingId(null);
  }

  function handleEdit(sub) {
    setEditingId(sub.id);

    setFormData({
      customer_id: sub.customer_id,
      plan_id: sub.plan_id,
      start_date: sub.start_date,
      expiry_date: sub.expiry_date || "",
      status: sub.status,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleCancelEdit() {
    setEditingId(null);
    setFormData(initialFormData);
  }

  function handleDelete(subscriptionId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this subscription?"
    );

    if (!confirmed) return;

    setSubscriptions((previous) =>
      previous.filter((sub) => sub.id !== subscriptionId)
    );

    if (editingId === subscriptionId) {
      handleCancelEdit();
    }

    alert("Subscription deleted successfully!");
  }

  return (
    <div className="subscription-app">
      <header className="top-navbar">
        <div className="brand">
          <div className="brand-icon">E</div>
          <div>
            <h2>Bright Empathix</h2>
            <span>Subscription Management</span>
          </div>
        </div>
        <div className="nav-label">MEMBER 3</div>
      </header>

      <main className="subscription-container">
        <div className="page-heading">
          <div>
            <p className="eyebrow">MANAGEMENT / SUBSCRIPTIONS</p>
            <h1>Subscriptions</h1>
            <p className="subtitle">
              Create and manage customer subscriptions.
            </p>
          </div>

          <div className="total-card">
            <span>Total Subscriptions</span>
            <strong>{subscriptions.length}</strong>
          </div>
        </div>

        <section className="form-card">
          <div className="card-heading">
            <div>
              <h2>
                {editingId
                  ? "Edit Subscription"
                  : "Create New Subscription"}
              </h2>
              <p>
                {editingId
                  ? "Update the subscription details below."
                  : "Enter the details below."}
              </p>
            </div>
            <span className="card-icon">＋</span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Choose Customer</label>
                <select
                  name="customer_id"
                  value={formData.customer_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Choose Plan</label>
                <select
                  name="plan_id"
                  value={formData.plan_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a plan</option>
                  {plans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Expiry Date</label>
                <input
                  type="date"
                  name="expiry_date"
                  value={formData.expiry_date}
                  onChange={handleChange}
                  min={formData.start_date || undefined}
                />
              </div>

              <div className="form-group">
                <label>Unit Price (₹)</label>
                <input
                  type="number"
                  value={unitPrice}
                  placeholder="Automatically selected from plan"
                  readOnly
                />
              </div>

              <div className="form-group">
                <label>Subscription Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Draft">Draft</option>
                  <option value="Active">Active</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="create-btn">
                {editingId
                  ? "Save Changes"
                  : "+ Create Subscription"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="table-card">
          <div className="card-heading">
            <div>
              <h2>Subscription Records</h2>
              <p>View and manage all subscriptions.</p>
            </div>

            <span className="record-count">
              {filteredSubscriptions.length} Records
            </span>
          </div>

          <div className="subscription-filters">
            <input
              type="text"
              placeholder="Search by customer, plan or subscription ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Active">Active</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {subscriptions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">▤</div>
              <h3>No subscriptions yet</h3>
              <p>Create your first subscription above.</p>
            </div>
          ) : filteredSubscriptions.length === 0 ? (
            <div className="empty-state">
              <h3>No matching subscriptions</h3>
              <p>Try changing your search or status filter.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Subscription No.</th>
                    <th>Customer</th>
                    <th>Plan</th>
                    <th>Start Date</th>
                    <th>Expiry Date</th>
                    <th>Unit Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredSubscriptions.map((sub) => {
                    const customer = customers.find(
                      (c) => c.id === sub.customer_id
                    );

                    const plan = plans.find(
                      (p) => p.id === sub.plan_id
                    );

                    return (
                      <tr key={sub.id}>
                        <td>{sub.subscription_number}</td>
                        <td>{customer?.name}</td>
                        <td>{plan?.name}</td>
                        <td>{sub.start_date}</td>
                        <td>{sub.expiry_date || "No expiry"}</td>
                        <td>₹{sub.unit_price}</td>

                        <td>
                          <select
                            className={`status-select ${sub.status.toLowerCase()}`}
                            value={sub.status}
                            onChange={(e) =>
                              handleStatusChange(
                                sub.id,
                                e.target.value
                              )
                            }
                          >
                            <option value="Draft">Draft</option>
                            <option value="Active">Active</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </td>

                        <td>
                          <div className="action-buttons">
                            <button
                              type="button"
                              className="edit-btn"
                              onClick={() => handleEdit(sub)}
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="delete-btn"
                              onClick={() => handleDelete(sub.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer className="page-footer">
          Bright Empathix · Subscription Management System
        </footer>
      </main>
    </div>
  );
}

export default Subscriptions;

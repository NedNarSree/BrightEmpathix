
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

function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
const [statusFilter, setStatusFilter] = useState("All");

  const [formData, setFormData] = useState({
    customer_id: "",
    plan_id: "",
    start_date: "",
    expiry_date: "",
    status: "Draft",
  });
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
  const selectedPlan = plans.find(
    (plan) => plan.id === formData.plan_id
  );

  const unitPrice = selectedPlan ? selectedPlan.price : "";

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
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

    setFormData({
      customer_id: "",
      plan_id: "",
      start_date: "",
      expiry_date: "",
      status: "Draft",
    });

    alert("Subscription created successfully!");
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
              <h2>Create New Subscription</h2>
              <p>Enter the details below.</p>
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
                + Create Subscription
              </button>
            </div>
          </form>
        </section>

        <section className="table-card">
          <div className="card-heading">
            <div>
              <h2>Subscription Records</h2>
              <p>View all created subscriptions.</p>
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

            <span className="record-count">
              {subscriptions.length} Records
            </span>
          </div>

          {subscriptions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">▤</div>
              <h3>No subscriptions yet</h3>
              <p>Create your first subscription above.</p>
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
                          <span className={`status ${sub.status.toLowerCase()}`}>
                            {sub.status}
                          </span>
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

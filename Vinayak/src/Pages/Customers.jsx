

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Fetch customers from Supabase
  async function fetchCustomers() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setCustomers(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Add a new customer
  async function addCustomer(e) {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      alert("Please enter both name and email.");
      return;
    }

    setSaving(true);
    setError("");

    const { data, error } = await supabase
      .from("customers")
      .insert([
        {
          name: name.trim(),
          email: email.trim().toLowerCase()
        }
      ])
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        setError("This email already exists.");
      } else {
        setError(error.message);
      }
    } else {
      setCustomers((previous) => [data, ...previous]);
      setName("");
      setEmail("");
    }

    setSaving(false);
  }

  // Delete a customer
  async function deleteCustomer(id) {
    const confirmDelete = window.confirm(
      "Are you sure? Deleting this customer may also delete their subscriptions."
    );

    if (!confirmDelete) return;

    setError("");

    const { error } = await supabase
      .from("customers")
      .delete()
      .eq("id", id);

    if (error) {
      setError(error.message);
      return;
    }

    setCustomers((previous) =>
      previous.filter((customer) => customer.id !== id)
    );
  }

  // Search customers
  const filteredCustomers = customers.filter((customer) =>
    `${customer.name} ${customer.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <h1>Customer Management</h1>
      <p>Manage your customers and their information.</p>

      <div style={styles.card}>
        <h2>Add New Customer</h2>

        <form onSubmit={addCustomer} style={styles.form}>
          <input
            style={styles.input}
            type="text"
            placeholder="Customer Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            style={styles.input}
            type="email"
            placeholder="Customer Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            style={styles.button}
            type="submit"
            disabled={saving}
          >
            {saving ? "Saving..." : "Add Customer"}
          </button>
        </form>
      </div>

      <div style={styles.card}>
        <h2>Customer List ({customers.length})</h2>

        <input
          style={styles.input}
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {error && <p style={styles.error}>{error}</p>}

        {loading ? (
          <p>Loading customers...</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.cell}>Customer ID</th>
                <th style={styles.cell}>Name</th>
                <th style={styles.cell}>Email</th>
                <th style={styles.cell}>Created Date</th>
                <th style={styles.cell}>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td style={styles.cell}>
                    {customer.id.slice(0, 8)}
                  </td>
                  <td style={styles.cell}>{customer.name}</td>
                  <td style={styles.cell}>{customer.email}</td>
                  <td style={styles.cell}>
                    {new Date(customer.created_at).toLocaleDateString()}
                  </td>
                  <td style={styles.cell}>
                    <button
                      style={styles.deleteButton}
                      onClick={() => deleteCustomer(customer.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filteredCustomers.length === 0 && (
                <tr>
                  <td style={styles.cell} colSpan="5">
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    fontFamily: "Arial, sans-serif",
    color: "#172820",
    background: "#F3F7F2",
    minHeight: "100vh"
  },
  card: {
    background: "#fff",
    padding: "20px",
    marginTop: "25px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
  },
  form: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap"
  },
  input: {
    padding: "12px",
    margin: "8px 0",
    border: "1px solid #ccc",
    borderRadius: "6px",
    flex: "1",
    minWidth: "180px"
  },
  button: {
    padding: "12px 20px",
    background: "#00592E",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },
  deleteButton: {
    padding: "7px 12px",
    background: "#417777",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },
  error: {
    color: "#b91c1c",
    marginTop: "10px"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "15px"
  },
  cell: {
    padding: "12px",
    borderBottom: "1px solid #ddd",
    textAlign: "left"
  }
};

export default Customers;

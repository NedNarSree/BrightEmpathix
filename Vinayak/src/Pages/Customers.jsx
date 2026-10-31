
import { useState } from "react";

function Customers() {
  // Temporary customer data for frontend development
  const [customers, setCustomers] = useState([
    {
      id: "C001",
      name: "Arun Kumar",
      email: "arun@gmail.com",
      created_at: "2026-10-30"
    },
    {
      id: "C002",
      name: "Meera Nair",
      email: "meera@gmail.com",
      created_at: "2026-10-31"
    }
  ]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [search, setSearch] = useState("");

  // Add a new customer
  function addCustomer(e) {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      alert("Please enter both name and email.");
      return;
    }

    const emailExists = customers.some(
      (customer) =>
        customer.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (emailExists) {
      alert("This email already exists.");
      return;
    }

    const newCustomer = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.trim(),
      created_at: new Date().toISOString().split("T")[0]
    };

    setCustomers([...customers, newCustomer]);

    setName("");
    setEmail("");
  }

  // Delete a customer
  function deleteCustomer(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (confirmDelete) {
      setCustomers(
        customers.filter((customer) => customer.id !== id)
      );
    }
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
          />

          <input
            style={styles.input}
            type="email"
            placeholder="Customer Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button style={styles.button} type="submit">
            Add Customer
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
                <td style={styles.cell}>{customer.id.slice(0, 8)}</td>
                <td style={styles.cell}>{customer.name}</td>
                <td style={styles.cell}>{customer.email}</td>
                <td style={styles.cell}>{customer.created_at}</td>
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
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    fontFamily: "Arial, sans-serif",
    color: "#222"
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
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },
  deleteButton: {
    padding: "7px 12px",
    background: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
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

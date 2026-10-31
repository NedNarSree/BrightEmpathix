
import { useState } from "react";
import Products from "./Pages/Products";
import Plans from "./Pages/Plans";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("products");

  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Business Pro",
      type: "Software",
      salesPrice: 999,
      costPrice: 450,
      notes: "Monthly business software subscription",
    },
    {
      id: 2,
      name: "Enterprise Suite",
      type: "Service",
      salesPrice: 2499,
      costPrice: 1200,
      notes: "Enterprise management package",
    },
  ]);

  const [plans, setPlans] = useState([
    {
      id: 1,
      name: "Business Pro Monthly",
      productId: "1",
      billingCycle: "Monthly",
      price: 999,
      minQuantity: 1,
      availableFrom: "2026-01-01",
      availableTo: "",
    },
    {
      id: 2,
      name: "Enterprise Yearly",
      productId: "2",
      billingCycle: "Yearly",
      price: 24999,
      minQuantity: 1,
      availableFrom: "2026-01-01",
      availableTo: "",
    },
  ]);

  return (
    <div className="app-container">
      <header className="app-header">
        <p className="app-eyebrow">BRIGHTLOOP SOFTWARE</p>
        <h1>Subscription Management</h1>
        <p className="app-subtitle">
          Manage your products, plans and subscriptions in one place.
        </p>
      </header>

      <nav className="app-navigation">
        <button
          className={activeTab === "products" ? "active" : ""}
          onClick={() => setActiveTab("products")}
        >
          <span>▦</span> Products
        </button>

        <button
          className={activeTab === "plans" ? "active" : ""}
          onClick={() => setActiveTab("plans")}
        >
          <span>◫</span> Plans
        </button>
      </nav>

      <main className="app-content">
        {activeTab === "products" ? (
          <Products
            products={products}
            setProducts={setProducts}
            plans={plans}
          />
        ) : (
          <Plans
            products={products}
            plans={plans}
            setPlans={setPlans}
          />
        )}
      </main>
    </div>
  );
}

export default App;

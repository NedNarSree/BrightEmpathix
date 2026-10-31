
import { useState } from "react";
import Products from "./Pages/Products";
import Plans from "./Pages/Plans";

function App() {
  const [activeTab, setActiveTab] = useState("products");

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>Brightloop Subscription Management</h1>

      <nav style={{ display: "flex", gap: "12px", marginBottom: "25px" }}>
        <button onClick={() => setActiveTab("products")}>
          Products
        </button>

        <button onClick={() => setActiveTab("plans")}>
          Plans
        </button>
      </nav>

      {activeTab === "products" ? <Products /> : <Plans />}
    </div>
  );
}

export default App;

import React from "react";

function PlanForm() {
  return (
    <form>
      <h2>Create Subscription Plan</h2>

      <input placeholder="Plan Name" />
      <input type="number" placeholder="Plan Price" />

      <select defaultValue="monthly">
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
        <option value="yearly">Yearly</option>
      </select>

      <button type="button">Create Plan</button>
    </form>
  );
}

export default PlanForm;
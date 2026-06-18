import { useState, useEffect } from "react";

function App() {

  const [name, setName] = useState("");
  const [spend, setSpend] = useState("");
  const [bonus, setBonus] = useState("");
  const [reason, setReason] = useState("");
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);

  useEffect(() => {

    const savedCustomers = JSON.parse(
      localStorage.getItem("customers")
    );

    if (savedCustomers) {
      setCustomers(savedCustomers);
    }

  }, []);

  useEffect(() => {

    localStorage.setItem(
      "customers",
      JSON.stringify(customers)
    );

  }, [customers]);

  const calculatePoints = (
  spendAmount,
  bonusPoints
) => {

  let spendPoints = 0;

  if (spendAmount <= 1000) {
    spendPoints =
      Math.floor(spendAmount / 10);
  }
  else if (spendAmount <= 5000) {
    spendPoints =
      Math.floor(spendAmount / 8);
  }
  else {
    spendPoints =
      Math.floor(spendAmount / 5);
  }

  return spendPoints +
    Number(bonusPoints);
};
  const getTier = (points) => {

    if (points >= 2000)
      return "Diamond";

    if (points >= 1000)
      return "Platinum";

    if (points >= 500)
      return "Gold";

    return "Silver";
  };

  const addCustomer = () => {

    if (
      !name ||
      !spend ||
      Number(spend) < 0 ||
      Number(bonus) < 0
    ) {

      alert(
        "Please enter valid details"
      );

      return;
    }

    const totalPoints =
      calculatePoints(
        Number(spend),
        Number(bonus || 0)
      );

    const tier =
      getTier(totalPoints);

    const newCustomer = {

      id: Date.now(),

      customerCode:
        "CUS" + Date.now(),

      name,

      spend,

      bonus,

      reason,

      totalPoints,

      tier,
    };

    setCustomers([
      ...customers,
      newCustomer,
    ]);

    setName("");
    setSpend("");
    setBonus("");
    setReason("");
  };

  const deleteCustomer = (id) => {

    setCustomers(
      customers.filter(
        (customer) =>
          customer.id !== id
      )
    );
  };

  const exportData = () => {

  const data = JSON.stringify(
    customers,
    null,
    2
  );

  const blob = new Blob(
    [data],
    {
      type:
        "application/json"
    }
  );

  const link =
    document.createElement("a");

  link.href =
    URL.createObjectURL(blob);

  link.download =
    "customer-report.json";

  link.click();
};

  const totalCustomers =
    customers.length;

  const totalSpend =
    customers.reduce(
      (sum, customer) =>
        sum +
        Number(customer.spend),
      0
    );

  const totalPoints =
    customers.reduce(
      (sum, customer) =>
        sum +
        customer.totalPoints,
      0
    );

  const topCustomer =
    customers.length > 0
      ? customers.reduce((a, b) =>
          a.totalPoints >
          b.totalPoints
            ? a
            : b
        ).name
      : "N/A";

  return (
    <div className="container mt-5">

      <h1 className="text-center mb-4">
        Customer Loyalty Management System
      </h1>

      <div className="card p-4">

    

        <input
          className="form-control mb-3"
          placeholder="Customer Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <input
          className="form-control mb-3"
          placeholder="Amount Spent"
          type="number"
          value={spend}
          onChange={(e) =>
            setSpend(e.target.value)
          }
        />

        <input
          className="form-control mb-3"
          placeholder="Bonus Points"
          type="number"
          value={bonus}
          onChange={(e) =>
            setBonus(e.target.value)
          }
        />

        <select
          className="form-control mb-3"
          value={reason}
          onChange={(e) =>
            setReason(e.target.value)
          }
        >
          <option value="">
            Select Bonus Reason
          </option>

          <option>
            Festival Bonus
          </option>

          <option>
            Referral Bonus
          </option>

          <option>
            Manual Adjustment
          </option>

        </select>

        <button
          className="btn btn-primary"
          onClick={addCustomer}
        >
          Add Customer
        </button>

      </div>

      <div className="row mt-4">

        <div className="col-md-3">
          <div className="card p-3 text-center">
            <h5>Total Customers</h5>
            <h2>{totalCustomers}</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 text-center">
            <h5>Total Spend</h5>
            <h2>₹{totalSpend}</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 text-center">
            <h5>Total Points</h5>
            <h2>{totalPoints}</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 text-center">
            <h5>Top Customer</h5>
            <h2>{topCustomer}</h2>
          </div>
        </div>

      </div>

      <div className="card mt-4 p-3">

        <div className="d-flex justify-content-between align-items-center mb-3">

  <h3>Customer Records</h3>

  <button
    className="btn btn-success"
    onClick={exportData}
  >
    Export Report
  </button>

</div>

  <input
  className="form-control mb-3"
  placeholder="Search Customer"
  value={search}
  onChange={(e) =>
    setSearch(e.target.value)
  }
/>
        

        <table className="table table-striped">

          <thead>

            <tr>
              <th>Customer ID</th>
              <th>Name</th>
              <th>Spend</th>
              <th>Bonus</th>
              <th>Points</th>
              <th>Tier</th>
              <th>Reason</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>

            {customers
              .filter((customer) =>
                customer.name
                  .toLowerCase()
                  .includes(
                    search.toLowerCase()
                  )
              )
              .map((customer) => (

                <tr key={customer.id}>

                  <td>{customer.customerCode} </td>

                  <td>{customer.name}</td>

                  <td>
                    ₹{customer.spend}
                  </td>

                  <td>
                    {customer.bonus}
                  </td>

                  <td>
                    {customer.totalPoints}
                  </td>

                  <td>

                    <span
                      className={
                        customer.tier ===
                        "Diamond"
                          ? "badge bg-dark"
                          : customer.tier ===
                            "Platinum"
                          ? "badge bg-info"
                          : customer.tier ===
                            "Gold"
                          ? "badge bg-warning text-dark"
                          : "badge bg-secondary"
                      }
                    >
                      {customer.tier}
                    </span>

                  </td>

                  <td>
                    {customer.reason}
                  </td>

                  <td>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() =>
                        deleteCustomer(
                          customer.id
                        )
                      }
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

          </tbody>

        </table>

      </div>

      <div className="card mt-4 p-3">

        <h3>
          🏆 Loyalty Leaderboard
        </h3>

        <ol>

          {[...customers]
            .sort(
              (a, b) =>
                b.totalPoints -
                a.totalPoints
            )
            .slice(0, 5)
            .map((customer) => (

              <li key={customer.id}>

                {customer.customerCode}
                {" - "}
                {customer.name}
                {" - "}
                {customer.totalPoints}
                pts
              </li>

            ))}

        </ol>

      </div>

    </div>
  );
}

export default App;
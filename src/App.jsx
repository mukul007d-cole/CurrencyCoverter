import React, { useRef, useState, useEffect } from 'react';

function App() {
  const [convertedAmount, setConvertedAmount] = useState(0.00);
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);

  const amountRef = useRef(null);
  const fromRef = useRef(null);
  const toRef = useRef(null);

  const currencies = [
    "USD", "EUR", "JPY", "GBP", "AUD",
    "CAD", "CHF", "CNY", "HKD", "INR"
  ];

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch("https://open.er-api.com/v6/latest/USD");
        const data = await response.json();
        setRates(data.rates);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      }
    };

    fetchRates();
  }, []);

  const convert = () => {
    const amount = parseFloat(amountRef.current.value);
    const from = fromRef.current.value;
    const to = toRef.current.value;

    if (!amount || isNaN(amount)) {
      alert("Please enter a valid amount.");
      return;
    }

    if (!rates[from] || !rates[to]) {
      alert("Exchange rate unavailable.");
      return;
    }

    const baseToUSD = amount / rates[from]; // Convert to USD
    const converted = baseToUSD * rates[to]; // Convert to target

    setConvertedAmount(converted.toFixed(2));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-4xl md:text-6xl text-center mt-10 font-bold text-blue-700 shadow-md">
        Currency Converter
      </h1>

      <div className="bg-white shadow-lg rounded-xl p-8 mt-10 w-full max-w-xl flex flex-col gap-6">
        <input
          ref={amountRef}
          type="number"
          placeholder="Enter amount"
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex gap-4">
          <select ref={fromRef} className="flex-1 border border-gray-300 p-3 rounded-lg">
            {currencies.map((cur) => (
              <option key={cur} value={cur}>{cur}</option>
            ))}
          </select>

          <select ref={toRef} className="flex-1 border border-gray-300 p-3 rounded-lg">
            {currencies.map((cur) => (
              <option key={cur} value={cur}>{cur}</option>
            ))}
          </select>
        </div>

        <button
          onClick={convert}
          disabled={loading}
          className={`p-3 rounded-lg transition text-white ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Loading rates..." : "Convert"}
        </button>

        <div className="text-xl text-center font-semibold text-green-600">
          Converted Amount: {convertedAmount}
        </div>
      </div>
    </div>
  );
}

export default App;

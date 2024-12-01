import React from "react";

const StockDetailsCard = ({ stock }) => {
  const {
    name,
    ticker,
    assetType,
    quantity,
    purchasePrice,
    brokerageFees,
    purchaseDate
  } = stock;

  // Calculate total cost
  const totalCost = (purchasePrice * quantity) + brokerageFees;

  return (
    <div className="bg-white shadow-md rounded p-4">
      <h3 className="text-xl font-bold mb-2">{name} ({ticker})</h3>
      <p><strong>Asset Type:</strong> {assetType}</p>
      <p><strong>Purchase Date:</strong> {new Date(purchaseDate).toLocaleDateString()}</p>
      <p><strong>Quantity:</strong> {quantity}</p>
      <p><strong>Purchase Price:</strong> ${purchasePrice ? purchasePrice.toFixed(2) : "0.00"}</p>
      <p><strong>Brokerage Fees:</strong> ${brokerageFees ? brokerageFees.toFixed(2) : "0.00"}</p>
      <p><strong>Total Cost:</strong> ${totalCost.toFixed(2)}</p>
    </div>
  );
};

export default StockDetailsCard;


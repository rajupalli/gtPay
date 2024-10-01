
"use client";

import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/table";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { IPaymentHistory } from "@/model/paymentHistory"; // Import the model interface
import { url } from "inspector";

const statusColors: { [key: string]: string } = {
  Approved: "#289317",
  Pending: "#FFA500",
  Rejected: "#D31812",
};

export const PaymentHistoryContent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOption, setFilterOption] = useState("All");
  const [transactionType, setTransactionType] = useState("All");
  const [beneficiaryFilter, setBeneficiaryFilter] = useState("All");
  
  const [paymentData, setPaymentData] = useState<IPaymentHistory[]>([]); // Use IPaymentHistory directly as type
  const [loading, setLoading] = useState(true); // State to manage loading
  const [menuOpen, setMenuOpen] = useState<string | null>(null); // Track which row's menu is open

  // Fetch payment history from the backend
  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const response = await axios.get("/api/payment-history");
        const fetchedData = response.data.data.map((item: IPaymentHistory) => ({
          ...item,
          dateTime: new Date(item.dateTime).toLocaleString(), // Format date for display
        }));
        setPaymentData(fetchedData);
      } catch (error) {
        console.error("Error fetching payment history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, []);

  const handleMenuAction = async (action: string, utrNo: string) => {
    try {
      // Check if the action is 'Approved' or 'Rejected'
      if (action === 'Approved' || action === 'Rejected') {
        // Send the PUT request to update the payment status using utrNo
        const response = await axios.put(`/api/payment-history`, {
          utrNo: utrNo,
          status: action // The new status (Approved or Rejected)
        });
  
        // Check the response and handle accordingly
        if (response.status === 200) {
          // Update the paymentData state with the new status
          setPaymentData((prevData: IPaymentHistory[]) =>
            prevData.map((item: IPaymentHistory) =>
              item.utrNo === utrNo
                ? { ...item, status: action } as IPaymentHistory // Explicitly type the object as IPaymentHistory
                : item
            )
          );
          console.log(`Payment status updated successfully for UTR: ${utrNo} to ${action}`);
        } else {
          console.error(`Failed to update payment status for UTR: ${utrNo}`);
        }
      }
    } catch (error) {
      console.error('Error updating payment history:', error);
    }
  
    setMenuOpen(null); // Close the menu after action
  };
  
  const uniqueBeneficiaries = Array.from(new Set(paymentData.map(item => item.beneficiaryName)));


  // Toggle the menu open/close state for a specific row
  const toggleMenu = (rowId: string) => {
    setMenuOpen((prev) => (prev === rowId ? null : rowId));
  };

  const filteredData = paymentData.filter(row => {
    const matchesSearch = row.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.mobile.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.utrNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
  
    const matchesFilter = filterOption === "All" || row.status === filterOption;
    const matchesTransactionType = transactionType === "All" || row.paymentType === transactionType;
    const matchesBeneficiary = beneficiaryFilter === "All" || row.beneficiaryName === beneficiaryFilter;
  
    return matchesSearch && matchesFilter && matchesTransactionType && matchesBeneficiary;
  });
  

  if (loading) {
    return <div>Loading...</div>; // Loading indicator while data is being fetched
  }

  return (
    <div>
     <div className="flex justify-between items-center mb-4">
  {/* Search input on the left side */}
  <input
    type="text"
    placeholder="Search Transaction"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="p-2 border rounded flex-grow mr-4"
  />

  {/* Filters on the right side */}
  <div className="flex space-x-4">
    <select
      value={transactionType}
      onChange={(e) => setTransactionType(e.target.value)}
      className="p-2 border rounded"
    >
      <option value="All">All</option>
      <option value="UPI">UPI</option>
      <option value="Bank Transfer">Bank Transfer</option>
    </select>

    <select
      value={beneficiaryFilter}
      onChange={(e) => setBeneficiaryFilter(e.target.value)}
      className="p-2 border rounded"
    >
      <option value="All">All Beneficiaries</option>
      {uniqueBeneficiaries.map((name, index) => (
        <option key={index} value={name}>{name}</option>
      ))}
    </select>

    <select
      value={filterOption}
      onChange={(e) => setFilterOption(e.target.value)}
      className="p-2 border rounded"
    >
      <option value="All">All</option>
      <option value="Approved">Success</option>
      <option value="Pending">Pending</option>
      <option value="Rejected">Failed</option>
    </select>
  </div>
</div>

      <Table aria-label="Payment history table">
        <TableHeader>
          <TableColumn>Sl.No.</TableColumn>
          <TableColumn>Transaction Id</TableColumn>
          <TableColumn>Mobile</TableColumn>
          <TableColumn>UTR No.</TableColumn>
          <TableColumn>Payment Type</TableColumn>
          <TableColumn>Beneficiary Name</TableColumn>
          <TableColumn>Date/Time</TableColumn>
          <TableColumn>Amount</TableColumn>
          <TableColumn>Screenshot</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Actions</TableColumn>  
        </TableHeader>
        <TableBody>
          {filteredData.map((row, index) => (
            <TableRow key={String(row._id)}>
              <TableCell>{index + 1}.</TableCell>
              <TableCell>{row.transactionId}</TableCell>
              <TableCell>{row.mobile}</TableCell>
              <TableCell>{row.utrNo}</TableCell>
              <TableCell>{row.paymentType}</TableCell>
              <TableCell>{row.beneficiaryName}</TableCell>
              <TableCell>{row.dateTime.toString()}</TableCell>
              <TableCell>{row.amount}</TableCell>
              <TableCell>{row.screenshot}</TableCell>
              <TableCell className="font-bold" style={{ color: statusColors[row.status] }}>
                {row.status}
              </TableCell>
              <TableCell>
  <div className="relative">
    {/* Check if the status is "Pending", show 3 Dots button, otherwise show a checked icon */}
    {row.status === "Pending" ? (
      <button onClick={() => toggleMenu(row.utrNo)}>
       &#x270E;
      </button>
    ) : (
      <span>&#x2713; {/* Checkmark icon */}</span>
    )}

    {/* Dropdown menu */}
    {menuOpen === row.utrNo && row.status === "Pending" && (
      <div className="absolute right-0 bg-white border rounded shadow p-2 z-10">
        <button onClick={() => handleMenuAction("Pending", row.utrNo)} className="block px-4 py-2">Pending</button>
        <button onClick={() => handleMenuAction("Approved", row.utrNo)} className="block px-4 py-2">Approve</button>
        <button onClick={() => handleMenuAction("Rejected", row.utrNo)} className="block px-4 py-2">Reject</button>
      </div>
    )}
  </div>
</TableCell>


            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

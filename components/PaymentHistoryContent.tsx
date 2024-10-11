"use client";

import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/table";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { IPaymentHistory } from "@/model/paymentHistory"; // Import the model interface

const statusColors: { [key: string]: string } = {
  Approved: "#289317",
  Pending: "#FFA500",
  Rejected: "#D31812",
};
interface PaymentHistoryProps {
  clientId:string; // Add the prop type for transactionId
}

export const PaymentHistoryContent = ({clientId }: PaymentHistoryProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOption, setFilterOption] = useState("All");
  const [transactionType, setTransactionType] = useState("All");
  const [beneficiaryFilter, setBeneficiaryFilter] = useState("All");
  const [startDate, setStartDate] = useState<string | null>(null); // Start date for range
  const [endDate, setEndDate] = useState<string | null>(null); // End date for range
  const [paymentData, setPaymentData] = useState<IPaymentHistory[]>([]); // Use IPaymentHistory directly as type
  const [loading, setLoading] = useState(true); // State to manage loading
  const [menuOpen, setMenuOpen] = useState<string | null>(null); // Track which row's menu is open
  const [error, setError] = useState<string | null>(null); 
  // Fetch payment history from the backend
  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const response = await axios.get("/api/payment-history", { params: { clientId } });
        const fetchedData = response.data.data.map((item: IPaymentHistory) => ({
          ...item,
          dateTime: new Date(item.dateTime), // Keep as a Date object for comparison
        }));
        setPaymentData(fetchedData);
      } catch (error) {
        console.error("Error fetching payment history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, [clientId]);

  const handleMenuAction = async (action: string, utrNo: string) => {
    try {
      if (action === 'Approved' || action === 'Rejected') {
        const response = await axios.put(`/api/payment-history`, {
          utrNo: utrNo,
          status: action, clientId:clientId
        });
  
        if (response.status === 200) {
          setPaymentData((prevData: IPaymentHistory[]) =>
            prevData.map((item: IPaymentHistory) =>
              item.utrNo === utrNo
                ? { ...item, status: action } as IPaymentHistory
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
  
    setMenuOpen(null);
  };
  
  const uniqueBeneficiaries = Array.from(new Set(paymentData.map(item => item.beneficiaryName)));

  // Toggle the menu open/close state for a specific row
  const toggleMenu = (rowId: string) => {
    setMenuOpen((prev) => (prev === rowId ? null : rowId));
  };

  // Function to clear date range filter
  const clearDateRangeFilter = () => {
    setStartDate(null);
    setEndDate(null); // Reset the date range
  };

  const filteredData = paymentData.filter(row => {
    const matchesSearch = row.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.mobile?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.utrNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.transactionId?.toLowerCase().includes(searchTerm.toLowerCase());
  
    const matchesFilter = filterOption === "All" || row.status === filterOption;
    const matchesTransactionType = transactionType === "All" || row.paymentType === transactionType;
    const matchesBeneficiary = beneficiaryFilter === "All" || row.beneficiaryName === beneficiaryFilter;
    
    // Date range filter
    const matchesDateRange = (!startDate || new Date(row.dateTime) >= new Date(startDate)) &&
                             (!endDate || new Date(row.dateTime) <= new Date(endDate));
  
    return matchesSearch && matchesFilter && matchesTransactionType && matchesBeneficiary && matchesDateRange;
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
        {/* Start date input */}
        <input
          type="date"
          value={startDate || ""}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-2 border rounded"
        />
        {/* End date input */}
        <input
          type="date"
          value={endDate || ""}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 border rounded"
        />
        <button onClick={clearDateRangeFilter} className="p-2 border rounded bg-red-500 text-white">
          Clear Date Range
        </button>

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
              <TableCell>{row.dateTime.toLocaleString()}</TableCell>
              <TableCell>{row.amount}</TableCell>
              <TableCell>{row.screenshot}</TableCell>
              <TableCell className="font-bold" style={{ color: statusColors[row.status] }}>
                {row.status}
              </TableCell>
              <TableCell>
                <div className="relative">
                  {row.status === "Pending" ? (
                    <button onClick={() => toggleMenu(row.utrNo)}>
                     &#x270E;
                    </button>
                  ) : (
                    <span>&#x2713;</span>
                  )}

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

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

export const PaymentHistoryContent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOption, setFilterOption] = useState("All");
  const [paymentData, setPaymentData] = useState<IPaymentHistory[]>([]); // Use IPaymentHistory directly as type
  const [loading, setLoading] = useState(true); // State to manage loading

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

  // Filter payment data based on the search term and filter option
  const filteredData = paymentData.filter(row => {
    const matchesSearch = row.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.mobile.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.utrNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.paymentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.dateTime.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.amount.toString().includes(searchTerm.toLowerCase()) || // Convert amount to string
      row.screenshot.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.status.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterOption === "All" || row.status === filterOption;

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return <div>Loading...</div>; // Loading indicator while data is being fetched
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search Transaction"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 p-2 border rounded"
        />
        <select
          value={filterOption}
          onChange={(e) => setFilterOption(e.target.value)}
          className="p-2 mb-4 border rounded"
        >
          <option value="All">Filter</option>
          <option value="Approved">Success</option>
          <option value="Pending">Pending</option>
          <option value="Rejected">Failed</option>
        </select>
      </div>
      <Table aria-label="Payment history table">
        <TableHeader>
          <TableColumn>Sl.No.</TableColumn>
          <TableColumn>User Name</TableColumn>
          <TableColumn>Mobile</TableColumn>
          <TableColumn>UTR No.</TableColumn>
          <TableColumn>Payment Type</TableColumn>
          <TableColumn>Beneficiary Name</TableColumn>
          <TableColumn>Date/Time</TableColumn>
          <TableColumn>Amount</TableColumn>
          <TableColumn>Screenshot</TableColumn>
          <TableColumn>Status</TableColumn>
        </TableHeader>
        <TableBody>
          {filteredData.map((row, index) => (
            <TableRow key={String(row._id)}>

              <TableCell>{index + 1}.</TableCell>
              <TableCell>{row.userName}</TableCell>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

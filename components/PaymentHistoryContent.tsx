"use client";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/table";
import React, { useState } from "react";

const statusColors: { [key: string]: string } = {
  Approved: "#289317",
  Pending: "#FFA500",
  Rejected: "#D31812",
};

interface PaymentRow {
  serialNo: number;
  userName: string;
  mobile: string;
  utrNo: string;
  paymentType: string;
  dateTime: string;
  amount: string;
  screenshot: string;
  status: string;
}

const paymentData: PaymentRow[] = [
  { serialNo: 1, userName: "Harshit", mobile: "+91 0123456789", utrNo: "43125625621", paymentType: "UPI", dateTime: "29-08-2024 (11:54:22)", amount: "10000", screenshot: "imgg-inggnam-1244.jpg", status: "Approved" },
  { serialNo: 2, userName: "Harshit", mobile: "+91 0123456789", utrNo: "43125625621", paymentType: "UPI", dateTime: "29-08-2024 (11:54:22)", amount: "10000", screenshot: "imgg-inggnam-1244.jpg", status: "Pending" },
  { serialNo: 3, userName: "Harshit", mobile: "+91 0123456789", utrNo: "43125625621", paymentType: "UPI", dateTime: "29-08-2024 (11:54:22)", amount: "10000", screenshot: "imgg-inggnam-1244.jpg", status: "Rejected" },
  { serialNo: 4, userName: "Harshit", mobile: "+91 0123456789", utrNo: "43125625621", paymentType: "UPI", dateTime: "29-08-2024 (11:54:22)", amount: "10000", screenshot: "imgg-inggnam-1244.jpg", status: "Approved" },
];

export const PaymentHistoryContent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOption, setFilterOption] = useState("All");

  // Filter payment data based on the search term
  const filteredData = paymentData.filter(row => {
    const matchesSearch = row.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.mobile.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.utrNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.paymentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.dateTime.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.amount.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.screenshot.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.status.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterOption === "All" || row.status === filterOption;

    return matchesSearch && matchesFilter;
  });

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
          {/* Add other filter options here */}
        </select>
      </div>
      <Table aria-label="Example static collection table">
        <TableHeader>
          <TableColumn>Sl.No.</TableColumn>
          <TableColumn>User Name</TableColumn>
          <TableColumn>Mobile</TableColumn>
          <TableColumn>UTR No.</TableColumn>
          <TableColumn>Payment Type</TableColumn>
          <TableColumn>Date/Time</TableColumn>
          <TableColumn>Amount</TableColumn>
          <TableColumn>Screenshot</TableColumn>
          <TableColumn>Status</TableColumn>
        </TableHeader>
        <TableBody>
          {paymentData.map(row => (
            <TableRow key={row.serialNo}>
              <TableCell>{row.serialNo}.</TableCell>
              <TableCell>{row.userName}</TableCell>
              <TableCell>{row.mobile}</TableCell>
              <TableCell>{row.utrNo}</TableCell>
              <TableCell>{row.paymentType}</TableCell>
              <TableCell>{row.dateTime}</TableCell>
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
  )
};

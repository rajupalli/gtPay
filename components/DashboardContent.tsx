"use client";

import { IPaymentHistory } from '@/model/paymentHistory';
import axios from 'axios';
import { useEffect, useState } from 'react';




interface IBeneficiary {
  beneficiaryName: string;
  percentage: string;
  limit: number;
  dailyLimit:number,
}

interface dashboardProps {
  clientId:string; // Add the prop type for transactionId
}

export const DashboardContent = ({ clientId }:dashboardProps) => {
  // Initialize state variables for amounts
  const [totalDeposit, setTotalDeposit] = useState(0); // for Card 1
  const [totalTransaction, setTotalTransaction] = useState(0); // for Card 2
  const [approvedAmount, setApprovedAmount] = useState(0); // for Card 3
  const [pendingTransaction, setPendingTransaction] = useState(0); // for Card 4
  const [rejectedTransaction, setRejectedTransaction] = useState(0); // for Card 5
  const [startDate, setStartDate] = useState(''); // Start date for filtering
  const [endDate, setEndDate] = useState(''); // End date for filtering
  const [paymentData, setPaymentData] = useState<IPaymentHistory[]>([]); 
  const [loading, setLoading] = useState(true); 
  const [bankData, setBankData] = useState([]);
  const [upiData, setUpiData] = useState([]);

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        // Fetch Payment history data
        const response = await axios.get("/api/payment-history", { params: { clientId } });
        const fetchedData = response.data.data.map((item: IPaymentHistory) => ({
          ...item,
          dateTime: new Date(item.dateTime),
        }));

        let filteredData = [];
        if (startDate && endDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          filteredData = fetchedData.filter((item: IPaymentHistory) => isDateInRange(item.dateTime, start, end));
        } else if (startDate) {
          const start = new Date(startDate);
          filteredData = fetchedData.filter((item: IPaymentHistory) => isSameDay(item.dateTime, start));
        } else {
          filteredData = fetchedData.filter((item: IPaymentHistory) => isToday(item.dateTime));
        }

        const totalDeposit = filteredData.filter((item: { status: string }) => item.status === 'Approved')
          .reduce((sum: number, item: { amount: number }) => sum + item.amount, 0);
        const totalTransaction = filteredData.length;
        const approvedAmount = filteredData.filter((item: { status: string }) => item.status === 'Approved').length;
        const pendingTransaction = filteredData.filter((item: { status: string }) => item.status === 'Pending').length;
        const rejectedTransaction = filteredData.filter((item: { status: string }) => item.status === 'Rejected').length;

        setTotalDeposit(totalDeposit);
        setTotalTransaction(totalTransaction);
        setApprovedAmount(approvedAmount);
        setPendingTransaction(pendingTransaction);
        setRejectedTransaction(rejectedTransaction);
        setPaymentData(filteredData);
      } catch (error) {
        console.error("Error fetching payment history:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchBankAndUpiData = async () => {
      try {
        // Fetch both Bank and UPI data
        const [bankResponse, upiResponse] = await Promise.all([
          axios.get("/api/bank", { params: { clientId } }),
          axios.get("/api/upi", { params: { clientId } }),
        ]);

        // Set data in respective states
        setBankData(bankResponse.data.data);
        setUpiData(upiResponse.data.data);
      } catch (error) {
        console.error("Error fetching Bank and UPI data:", error);
      }
    };

    fetchPaymentHistory();
    fetchBankAndUpiData();
  }, [clientId, startDate, endDate]);



  // Helper function to check if two dates are the same day
  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };
  

  const calculateApprovedAmountByBeneficiary = (beneficiaryName: string) => {
    return paymentData
      .filter((payment) => payment.status === 'Approved' && payment.beneficiaryName === beneficiaryName)
      .reduce((sum, payment) => sum + payment.amount, 0); // Sum the approved amounts
  };



  // Helper function to check if a date is in range
  const isDateInRange = (date: Date, start: Date, end: Date) => {
    return date >= start && date <= end;
  };
  
  // Helper function to check if a date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };
  
  const combinedData: IBeneficiary[] = [...bankData, ...upiData];
  return (
    <div>


<div className="flex justify-end mb-4">
        <div className="flex space-x-2">
          <div>
            <label htmlFor="start-date" className="mr-2">Start Date:</label>
            <input
              type="date"
              id="start-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded p-2"
            />
          </div>
          <div>
            <label htmlFor="end-date" className="mr-2">End Date:</label>
            <input
              type="date"
              id="end-date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded p-2"
            />
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <img
            src="/sum.png"
            alt="Card 1"
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <h3 className="text-base text-grey leading-[22.4px]">Total Deposit</h3>
            <p className="text-blue font-semibold text-2xl leading-8">Rs {totalDeposit}</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <img
            src="/rupee-symbol.png"
            alt="Card 1"
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <h3 className="text-base text-grey leading-[22.4px]">Total Transactions</h3>
            <p className="text-blue font-semibold text-2xl leading-8">{totalTransaction}</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <img
            src="/checkmark.png"
            alt="Card 1"
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <h3 className="text-base text-grey leading-[22.4px]">Approved</h3>
            <p className="text-blue font-semibold text-2xl leading-8">{approvedAmount}</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <img
            src="/time.png"
            alt="Card 1"
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <h3 className="text-sm text-grey leading-[22.4px]">Manual Approval Required</h3>
            <p className="text-blue font-semibold text-2xl leading-8">{pendingTransaction}</p>
          </div>
        </div>

        {/* Card 5 */}
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <img
            src="/delete.png"
            alt="Card 1"
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <h3 className="text-base text-grey leading-[22.4px]">Failed Transactions</h3>
            <p className="text-blue font-semibold text-2xl leading-8">{rejectedTransaction}</p>
          </div>
        </div>

        {/* Card 6 */}
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <img
            src="/customize.png"
            alt="Card 1"
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <h3 className="text-base text-grey leading-[22.4px]">Custom Option 1</h3>
            <p className="text-blue font-semibold">------</p>
          </div>
        </div>

        {/* Card 7 */}
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <img
            src="/customize.png"
            alt="Card 1"
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <h3 className="text-base text-grey leading-[22.4px]">Custom Option 2</h3>
            <p className="text-blue font-semibold">-------</p>
          </div>
        </div>

        {/* Card 8 (BANKING LIMITS, with reduced height) */}
        <div className="bg-white p-4 rounded-lg shadow-md row-span-2 h-100">
          <div className="flex items-center mb-4">
            <img
              src="/warning.png"
              alt="Banking Limits"
              className="w-6 h-6 rounded-full mr-4"
            />
            <h3 className="text-lg font-bold leading-5">BANKING LIMITS</h3>
          </div>

          <div className="mt-7">
            <ul className="space-y-5">
            {combinedData.map((beneficiary, index) => {
            const approvedAmount = calculateApprovedAmountByBeneficiary(beneficiary.beneficiaryName);
            const remainingPercentage = ((beneficiary.dailyLimit - approvedAmount) / beneficiary.dailyLimit) * 100;

            return (
              <li key={index} className="bg-gray-200 p-3 rounded-3xl flex justify-between items-center">
                <span className="text-black font-medium text-xs leading-6">{beneficiary.beneficiaryName}</span>
                <span className="text-stocksRed font-bold text-sm leading-5">
                  {isNaN(remainingPercentage) ? '-' : `${Math.round(remainingPercentage)}%`}
                </span>
                <span className="text-stocksGreen font-bold text-xs leading-4">
                  {approvedAmount}
                </span>
              </li>
            );
          })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

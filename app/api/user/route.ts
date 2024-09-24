// fetch bank details
import { NextRequest, NextResponse } from 'next/server';
import BankModel from '@/model/BankDetails';
import UpiModel from '@/model/UpiDetails';
import UserModel from '@/model/UserModel';
import { connectToDatabase } from '@/lib/dbConnect';

export async function GET(req: NextRequest) {
    try {
      await connectToDatabase();
  
      const url = new URL(req.url);
        const amount = url.searchParams.get('amount');
        const paymentType = url.searchParams.get('paymentType');
  
      if (!amount || isNaN(Number(amount))) {
        return NextResponse.json({ error: 'Amount is required and must be a number.' }, { status: 400 });
      }
  
      const amountNumber = Number(amount);
  
      if (paymentType === "UPI") {
        const upiDetails = await UpiModel.find({}).sort({ dailyLimit: 1 }).exec();
        if (!upiDetails.length) {
          return NextResponse.json({ message: 'No UPI details found in the database.' }, { status: 404 });
        }
  
        const suitableUpi = upiDetails.find(upi => Number(upi.dailyLimit) >= amountNumber);
  
        if (suitableUpi) {
          const requiredUPI = await UpiModel.findByIdAndUpdate(suitableUpi._id, {
            dailyLimit: String(Number(suitableUpi.dailyLimit) - amountNumber)
          }, { new: true })
          return NextResponse.json({ data: requiredUPI }, { status: 200 });
        } else {
          const upiWithMinLimit = upiDetails[0];
          const requiredUPI = await UpiModel.findByIdAndUpdate(upiWithMinLimit._id, {
            dailyLimit: String(Number(upiWithMinLimit.dailyLimit) - amountNumber)
          }, { new: true })
          return NextResponse.json({ data: requiredUPI }, { status: 200 });
        }
      }
  
      const banksSortedByLimit = await BankModel.find({}).sort({ dailyLimit: 1 }).exec();
  
      if (!banksSortedByLimit.length) {
        return NextResponse.json({ message: 'No banks found in the database.' }, { status: 404 });
      }
  
      let suitableBanks: any[] = []; // find sorted list 


      banksSortedByLimit.forEach((bank) => {
        if (Number(bank.dailyLimit) >= amountNumber) {
          suitableBanks.push(bank);
        }
      });
  
      // if suitable found - return the first one
      if (suitableBanks.length > 0) {
        const requiredBankID = suitableBanks[0]._id;
        const requiredBank = await BankModel.findByIdAndUpdate(requiredBankID, {
          dailyLimit: String(Number(suitableBanks[0].dailyLimit) - amountNumber),
        }, { new: true });
        return NextResponse.json({ data: requiredBank }, { status: 200 });
      } else {
        const bankWithMinLimit = banksSortedByLimit[0];
        const requiredBank = await BankModel.findByIdAndUpdate(bankWithMinLimit._id, {
          dailyLimit: String(Number(bankWithMinLimit.dailyLimit) - amountNumber)
        }, { new: true })
        return NextResponse.json({ data: requiredBank }, { status: 200 });
      }
    } catch (error) {
      console.error('Error fetching bank details:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }

export async function POST (req: NextRequest, res: NextResponse) {
    try {
        await connectToDatabase()
        const { 
            beneficiaryName, 
            accountNo, 
            IFSCcode, 
            bankName, 
            amount, 
            paymentType, 
            randomTransactionNumber, 
            transactionNumber, 
            upiId, 
            screenshot
         } = await req.json() as any;
    
        if(paymentType === "UPI") {
            const upiDetails = await UserModel.create({
                upiId,
                screenshot,
                amount,
                transactionNumber,
                randomTransactionNumber,
                paymentType,
            });
            if(!upiDetails) {
                return NextResponse.json({ error: 'Error saving UPI details.' }, { status: 400 });
            }
            return NextResponse.json({ message: 'UPI details saved', data: upiDetails }, { status: 200 });
        } 
        const newBankDetail = await UserModel.create({
            bankName,
            beneficiaryName,
            accountNo,
            IFSCcode,
            amount,
            transactionNumber,
            randomTransactionNumber,
            paymentType,
        });

        if(!newBankDetail) {
            return NextResponse.json({ error: 'Error saving bank details.' }, { status: 400 });
        }
        return NextResponse.json({ message: 'Bank details saved', data: newBankDetail }, { status: 200 });
    } catch (error) {
        console.error('Error is user creation:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
};



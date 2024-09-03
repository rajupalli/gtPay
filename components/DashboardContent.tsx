"use client";

export const DashboardContent = () => {
  return (
    <div>
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
            <p className="text-blue font-semibold text-2xl leading-8">Rs 1652892</p>
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
            <p className="text-blue font-semibold text-2xl leading-8">2453</p>
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
            <p className="text-blue font-semibold text-2xl leading-8">1351</p>
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
            <p className="text-blue font-semibold text-2xl leading-8">23</p>
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
            <p className="text-blue font-semibold text-2xl leading-8">643</p>
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

        {/* Card 8 (Taller Card) */}
        <div className="bg-white p-4 rounded-lg shadow-md row-span-2 h-lvh">
          {/* Image and Title Row */}
          <div className="flex items-center mb-4">
            <img
              src="/warning.png" // Replace with your image URL
              alt="Banking Limits"
              className="w-6 h-6 rounded-full mr-4"
            />
            <h3 className="text-lg font-bold leading-5">BANKING LIMITS</h3>
          </div>

          {/* Limits List */}
          <div className="mt-7">
            <ul className="space-y-5">
              <li className="bg-gray-200 p-3 rounded-3xl flex justify-between items-center">
                <span className="text-black font-medium text-xs leading-6">RK EXPORTS</span>
                <span className="text-stocksRed font-bold text-sm leading-5">80%</span>
                <span className="text-stocksGreen font-bold text-xs leading-4">184000</span>
              </li>
              <li className="bg-gray-200 p-3 rounded-3xl flex justify-between items-center">
                <span className="text-black font-medium text-xs leading-6">BALAJI TRADERS</span>
                <span className="text-stocksRed font-bold text-sm leading-5">34%</span>
                <span className="text-stocksGreen font-bold text-xs leading-4">64000</span>
              </li>
              <li className="bg-gray-200 p-3 rounded-3xl flex justify-between items-center">
                <span className="text-black font-medium text-xs leading-6">ASHISH TRADERS</span>
                <span className="text-stocksRed font-bold text-sm leading-5">8%</span>
                <span className="text-stocksGreen font-bold text-xs leading-4">46000</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
};

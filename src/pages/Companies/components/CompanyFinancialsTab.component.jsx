import React from 'react'

/**
 * CompanyFinancialsTab Component
 * Displays credit limit facility, banking & GST details, and issued invoices table (Tab 5.3)
 */
export const CompanyFinancialsTab = ({ company }) => {
  if (!company) return null
  const financialInfo = company.financialInfo || {}

  return (
    <div className="space-y-5">
      {/* Credit Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">Credit Limit</span>
          <p className="text-lg font-extrabold text-slate-900 mt-1">
            {financialInfo.creditLimit || '₹25,00,000'}
          </p>
          <span className="text-[10px] text-slate-400">Approved corporate facility</span>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">Utilized Credit</span>
          <p className="text-lg font-extrabold text-indigo-700 mt-1">
            {financialInfo.creditUtilized || '₹8,45,000'}
          </p>
          <span className="text-[10px] text-slate-400">Ongoing active bookings</span>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">Available Balance</span>
          <p className="text-lg font-extrabold text-emerald-700 mt-1">
            {financialInfo.creditAvailable || '₹16,55,000'}
          </p>
          <span className="text-[10px] text-slate-400">Ready for instant issuance</span>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">Payment Terms</span>
          <p className="text-lg font-extrabold text-slate-900 mt-1">
            {financialInfo.paymentTerms || 'Net 30 Days'}
          </p>
          <span className="text-[10px] text-slate-400">Monthly consolidated billing</span>
        </div>
      </div>

      {/* Corporate Tax & Banking Details */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
          Corporate Billing & Tax Registration
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-500 block text-[11px]">GST / Tax ID</span>
            <span className="font-bold text-slate-800">{financialInfo.gstNumber || '27AAACA1234F1Z8'}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">PAN Number</span>
            <span className="font-bold text-slate-800">{financialInfo.panNumber || 'AAACA1234F'}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Corporate Bank</span>
            <span className="font-bold text-slate-800">{financialInfo.bankName || 'HDFC Bank, Fort'}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Account / IFSC</span>
            <span className="font-mono text-slate-800">
              {financialInfo.accountNo || '50200041289123'} • {financialInfo.ifscCode || 'HDFC0000060'}
            </span>
          </div>
        </div>
      </div>

      {/* Issued Invoices & Booking Ledger */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Issued Corporate Invoices & Statements
            </h3>
            <p className="text-[11px] text-slate-500">Official billing records generated for corporate account</p>
          </div>
          <button
            type="button"
            onClick={() => alert('Exporting corporate financial ledger...')}
            className="px-3 py-1.5 text-xs font-semibold rounded border border-slate-300 hover:bg-slate-50 text-slate-700 cursor-pointer"
          >
            Download Ledger (PDF)
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-900 uppercase border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">INVOICE NO</th>
                <th className="px-4 py-3">ISSUE DATE</th>
                <th className="px-4 py-3">PARTICULARS</th>
                <th className="px-4 py-3">AMOUNT</th>
                <th className="px-4 py-3">DUE DATE</th>
                <th className="px-4 py-3">STATUS</th>
                <th className="px-4 py-3">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(financialInfo.invoices || []).length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-slate-400">
                    No generated invoices found for this company account yet.
                  </td>
                </tr>
              ) : (
                financialInfo.invoices.map((inv, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">{inv.invoiceNo}</td>
                    <td className="px-4 py-3 text-slate-600">{inv.date}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{inv.particulars}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">{inv.amount}</td>
                    <td className="px-4 py-3 text-slate-600">{inv.dueDate}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          inv.status === 'PAID'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => alert(`Viewing receipt for ${inv.invoiceNo}`)}
                        className="text-xs text-primary hover:underline font-semibold cursor-pointer"
                      >
                        View Invoice
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default CompanyFinancialsTab

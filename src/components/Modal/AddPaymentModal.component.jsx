import React, { useState, useEffect } from 'react'

const formatINR = (val) => {
  if (val === undefined || val === null) return '₹0'
  return `₹${Number(val).toLocaleString('en-IN')}`
}

/**
 * AddPaymentModal Component
 * Interactive modal popup to record payments against Visa and Holiday cases.
 * Calculates paid & pending balances in real time, allows payment method selection,
 * reference recording, and instant ledger update.
 */
export const AddPaymentModal = ({
  isOpen,
  onClose,
  caseItem,
  onRecordPayment,
}) => {
  if (!isOpen || !caseItem) return null

  const totalFee = Number(caseItem.amount || caseItem.price || 0)
  const currentPaid = Number(caseItem.paidAmount || 0)
  const pendingBalance = Math.max(0, totalFee - currentPaid)

  const [paymentAmount, setPaymentAmount] = useState(pendingBalance > 0 ? String(pendingBalance) : '5000')
  const [paymentMode, setPaymentMode] = useState('Bank Transfer')
  const [referenceNo, setReferenceNo] = useState('')
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0])
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (caseItem) {
      const pending = Math.max(0, totalFee - currentPaid)
      setPaymentAmount(pending > 0 ? String(pending) : '5000')
      setReferenceNo(`TXN-${Math.floor(100000 + Math.random() * 900000)}`)
      setPaymentMode('Bank Transfer')
      setPaymentDate(new Date().toISOString().split('T')[0])
      setNotes('')
      setError('')
    }
  }, [caseItem, isOpen])

  const parsedAmount = Number(paymentAmount) || 0
  const willCompleteBalance = parsedAmount >= pendingBalance && pendingBalance > 0
  const remainingAfterPayment = Math.max(0, pendingBalance - parsedAmount)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!parsedAmount || parsedAmount <= 0) {
      setError('Please enter a valid payment amount greater than 0.')
      return
    }

    const newPaidAmount = currentPaid + parsedAmount
    const newStatus =
      newPaidAmount >= totalFee ? 'COMPLETED' : newPaidAmount > 0 ? 'PARTIAL' : 'PENDING'

    if (onRecordPayment) {
      onRecordPayment({
        paidAmountAdded: parsedAmount,
        newPaidTotal: newPaidAmount,
        newPaymentStatus: newStatus,
        paymentMode,
        referenceNo: referenceNo.trim() || `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        paymentDate,
        notes: notes.trim(),
      })
    }

    onClose()
  }

  const applicantName =
    caseItem.applicantName || caseItem.applicant || caseItem.customer || 'Applicant'
  const caseId = caseItem.id || 'CASE-000'

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-slate-200 space-y-4 max-h-[92vh] overflow-y-auto font-sans text-xs animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center text-lg font-bold shadow-2xs">
              💳
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm sm:text-base text-slate-900 leading-tight">
                  Record Payment
                </h3>
                <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                  {caseId}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Client: <strong className="text-slate-800">{applicantName}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1 cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Financial Summary Cards */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <p className="text-[9px] uppercase font-bold text-slate-400">Total Fee</p>
            <p className="text-xs sm:text-sm font-black text-slate-900 mt-0.5">
              {formatINR(totalFee)}
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-center">
            <p className="text-[9px] uppercase font-bold text-emerald-700">Currently Paid</p>
            <p className="text-xs sm:text-sm font-black text-emerald-700 mt-0.5">
              {formatINR(currentPaid)}
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200 text-center">
            <p className="text-[9px] uppercase font-bold text-rose-700">Pending Balance</p>
            <p className="text-xs sm:text-sm font-black text-rose-700 mt-0.5">
              {formatINR(pendingBalance)}
            </p>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {error && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Payment Amount */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase text-slate-700 tracking-wider flex items-center justify-between">
              <span>Payment Amount (₹) *</span>
              {remainingAfterPayment === 0 && parsedAmount > 0 ? (
                <span className="text-emerald-700 font-bold lowercase text-[10px]">
                  (full clearance)
                </span>
              ) : remainingAfterPayment > 0 ? (
                <span className="text-slate-400 font-normal lowercase text-[10px]">
                  Remaining: {formatINR(remainingAfterPayment)}
                </span>
              ) : null}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-slate-400 font-bold text-sm">₹</span>
              <input
                type="number"
                min="1"
                step="1"
                value={paymentAmount}
                onChange={(e) => {
                  setPaymentAmount(e.target.value)
                  setError('')
                }}
                placeholder="Enter amount..."
                className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-300 text-sm font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                required
              />
            </div>

            {/* Quick Fill Chips */}
            {pendingBalance > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                <button
                  type="button"
                  onClick={() => setPaymentAmount(String(pendingBalance))}
                  className="px-2 py-0.5 rounded-md border border-emerald-300 bg-emerald-50 text-emerald-800 text-[10px] font-bold hover:bg-emerald-100 cursor-pointer transition-colors"
                >
                  Pay Full Pending: {formatINR(pendingBalance)}
                </button>
                {pendingBalance > 2000 && (
                  <button
                    type="button"
                    onClick={() => setPaymentAmount(String(Math.round(pendingBalance / 2)))}
                    className="px-2 py-0.5 rounded-md border border-slate-200 bg-slate-100 text-slate-700 text-[10px] font-semibold hover:bg-slate-200 cursor-pointer transition-colors"
                  >
                    50% ({formatINR(Math.round(pendingBalance / 2))})
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Payment Mode & Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-700 tracking-wider block">
                Payment Mode *
              </label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="Bank Transfer">Bank Transfer (NEFT / RTGS / IMPS)</option>
                <option value="UPI / QR Code">UPI / QR Code (GPay, PhonePe, Paytm)</option>
                <option value="Credit / Debit Card">Credit / Debit Card</option>
                <option value="Cash">Cash Payment</option>
                <option value="Cheque / DD">Cheque / Demand Draft</option>
                <option value="Corporate Credit">Corporate Credit / Ledger</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-700 tracking-wider block">
                Payment Date *
              </label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                required
              />
            </div>
          </div>

          {/* Transaction Reference / Receipt No */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-slate-700 tracking-wider block">
              Transaction Ref / UTR / Receipt No
            </label>
            <input
              type="text"
              value={referenceNo}
              onChange={(e) => setReferenceNo(e.target.value)}
              placeholder="e.g. TXN-998310 or Bank UTR Ref"
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Remarks */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-slate-700 tracking-wider block">
              Payment Remarks & Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes on billing clearance, invoice reference, bank account, etc..."
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Full settlement banner notice */}
          {willCompleteBalance && (
            <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-300 text-emerald-800 text-[11px] font-semibold flex items-center gap-2">
              <span className="text-emerald-600 font-bold text-sm">✔</span>
              <span>This payment will clear the pending balance and mark this case as Fully Paid.</span>
            </div>
          )}

          {/* Modal Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>💳</span>
              <span>Confirm & Record Payment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddPaymentModal

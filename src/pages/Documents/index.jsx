import React from 'react'
import Table from '../../components/Table'
import Button from '../../components/Button'

export const Documents = () => {
  const documents = [
    { id: 'DOC-101', name: 'Passport_Copy_Bio.pdf', category: 'Identification', applicant: 'Emma Watson', size: '2.4 MB', status: 'Verified', date: '2026-10-04' },
    { id: 'DOC-102', name: 'Bank_Statement_6M.pdf', category: 'Financial', applicant: 'Emma Watson', size: '5.1 MB', status: 'Pending Review', date: '2026-10-04' },
    { id: 'DOC-103', name: 'Employment_Offer_Letter.pdf', category: 'Employment', applicant: 'Carlos Mendoza', size: '1.2 MB', status: 'Verified', date: '2026-10-02' },
    { id: 'DOC-104', name: 'Travel_Insurance_Policy.pdf', category: 'Insurance', applicant: 'Amina Al-Mansoor', size: '840 KB', status: 'Verified', date: '2026-10-01' },
  ]

  const columns = [
    { key: 'name', header: 'Document Name', render: (val) => <span className="font-medium text-slate-900">{val}</span> },
    { key: 'category', header: 'Category' },
    { key: 'applicant', header: 'Linked Applicant' },
    { key: 'size', header: 'File Size' },
    {
      key: 'status',
      header: 'Verification Status',
      render: (val) => (
        <span
          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
            val === 'Verified'
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-amber-50 text-amber-700'
          }`}
        >
          {val}
        </span>
      ),
    },
    { key: 'date', header: 'Uploaded Date' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Document Management</h1>
          <p className="text-sm text-slate-500 mt-1">Securely manage client files, uploads, and compliance checklists</p>
        </div>
        <Button variant="primary" size="md">+ Upload Document</Button>
      </div>

      <Table columns={columns} data={documents} />
    </div>
  )
}

export default Documents

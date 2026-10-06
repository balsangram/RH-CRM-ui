import React from 'react'
import { useNavigate } from 'react-router-dom'
import Table from '../../components/Table/Table.component'
import Button from '../../components/Button/Button.component'

export const Documents = () => {
  const navigate = useNavigate()
  const documents = [
    { id: 'DOC-101', name: 'Passport_Copy_Bio.pdf', category: 'Identification', applicant: 'Emma Watson', size: '2.4 MB', status: 'Verified', date: '2026-10-04' },
    { id: 'DOC-102', name: 'Bank_Statement_6M.pdf', category: 'Financial', applicant: 'Emma Watson', size: '5.1 MB', status: 'Pending Review', date: '2026-10-04' },
    { id: 'DOC-103', name: 'Employment_Offer_Letter.pdf', category: 'Employment', applicant: 'Carlos Mendoza', size: '1.2 MB', status: 'Verified', date: '2026-10-02' },
    { id: 'DOC-104', name: 'Travel_Insurance_Policy.pdf', category: 'Insurance', applicant: 'Amina Al-Mansoor', size: '840 KB', status: 'Verified', date: '2026-10-01' },
  ]

  const columns = [
    { key: 'id', header: 'Document ID', render: (val) => <span className="font-semibold text-main">{val}</span> },
    { key: 'name', header: 'File Name' },
    { key: 'category', header: 'Category' },
    { key: 'applicant', header: 'Applicant' },
    { key: 'size', header: 'File Size' },
    {
      key: 'status',
      header: 'Status',
      render: (val) => (
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
            val === 'Verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
          }`}
        >
          {val}
        </span>
      ),
    },
    { key: 'date', header: 'Uploaded' },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <button
          onClick={(e) => {
            e.stopPropagation()
            navigate(`/documents/edit/${row.id}`)
          }}
          className="text-xs font-semibold text-primary hover:text-primary-hover underline"
        >
          Edit
        </button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-main">Documents Vault</h1>
          <p className="text-sm text-muted mt-1">Repository of client passport scans, bank statements, and filings</p>
        </div>
        <Button onClick={() => navigate('/documents/add')} variant="primary" size="md">+ Upload Document</Button>
      </div>

      <Table columns={columns} data={documents} />
    </div>
  )
}

export default Documents

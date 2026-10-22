import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ROUTES from '../../config/routes'
import Modal from '../../components/Modal/Modal.component'
import leadsService, { STAFF_MEMBERS } from '../../services/leads'
import masterWorkflowTemplatesService from '../../services/masterWorkflowTemplates'

export const Leads = () => {
  const navigate = useNavigate()

  // Data states
  const [leads, setLeads] = useState(() => leadsService.getLeads())
  const [stages, setStages] = useState(() => leadsService.getStages())

  // View Mode: 'KANBAN' | 'TABLE'
  const [viewMode, setViewMode] = useState('KANBAN')

  // Filter & Search states
  const [leadTypeFilter, setLeadTypeFilter] = useState('ALL') // 'ALL' | 'VISA' | 'HOLIDAY'
  const [sourceFilter, setSourceFilter] = useState('ALL')
  const [searchOption, setSearchOption] = useState('ALL') // 'ALL' | 'name' | 'phone' | 'package' | 'quote'
  const [searchQuery, setSearchQuery] = useState('')

  // Active Side Sheet Drawer
  const [activeLeadId, setActiveLeadId] = useState(null)
  const activeLead = useMemo(() => {
    return leads.find((l) => l.id === activeLeadId) || null
  }, [leads, activeLeadId])

  // Modals state
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false)
  const [editingLead, setEditingLead] = useState(null)
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false)
  const [proposalLead, setProposalLead] = useState(null)
  const [isCaseModalOpen, setIsCaseModalOpen] = useState(false)
  const [caseLead, setCaseLead] = useState(null)
  const [isManageStagesModalOpen, setIsManageStagesModalOpen] = useState(false)

  // Drag and Drop state
  const [draggedLeadId, setDraggedLeadId] = useState(null)

  // Forms state
  const [leadFormData, setLeadFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    type: 'VISA',
    source: 'Website Form',
    targetCountry: 'United States',
    serviceRequired: 'B1/B2 Visitor Visa',
    value: 25000,
    stage: 'LEAD',
    customFields: [],
  })

  // Quotation Creator Form State
  const [quotationFormData, setQuotationFormData] = useState({
    code: '',
    items: [{ description: '', amount: 0 }],
    discount: 0,
    validUntil: '',
    notes: '',
  })

  // Case Conversion Form State
  const [caseFormData, setCaseFormData] = useState({
    caseId: '',
    caseType: 'Visa Application Filing',
    specialist: 'Amit Verma',
    priority: 'Normal',
    notes: '',
  })

  // Stage Management Form State
  const [newStageName, setNewStageName] = useState('')
  const [newStageSubtitle, setNewStageSubtitle] = useState('')

  const reloadData = () => {
    setLeads(leadsService.getLeads())
    setStages(leadsService.getStages())
  }

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // Type filter
      if (leadTypeFilter !== 'ALL' && lead.type !== leadTypeFilter) return false
      // Source filter
      if (sourceFilter !== 'ALL' && lead.source !== sourceFilter) return false

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        if (searchOption === 'name') {
          return lead.name.toLowerCase().includes(q)
        } else if (searchOption === 'phone') {
          return lead.phone.toLowerCase().includes(q)
        } else if (searchOption === 'package') {
          return (
            lead.serviceRequired.toLowerCase().includes(q) ||
            lead.targetCountry.toLowerCase().includes(q)
          )
        } else if (searchOption === 'quote') {
          return lead.quotation?.code?.toLowerCase().includes(q)
        } else {
          // All Fields
          return (
            lead.name.toLowerCase().includes(q) ||
            lead.phone.toLowerCase().includes(q) ||
            lead.email.toLowerCase().includes(q) ||
            lead.id.toLowerCase().includes(q) ||
            lead.company.toLowerCase().includes(q) ||
            lead.targetCountry.toLowerCase().includes(q) ||
            lead.serviceRequired.toLowerCase().includes(q) ||
            (lead.quotation?.code && lead.quotation.code.toLowerCase().includes(q)) ||
            (lead.caseId && lead.caseId.toLowerCase().includes(q))
          )
        }
      }

      return true
    })
  }, [leads, leadTypeFilter, sourceFilter, searchOption, searchQuery])

  // Aggregate Metrics
  const totalPipelineValue = useMemo(() => {
    return filteredLeads.reduce((acc, lead) => acc + (Number(lead.value) || 0), 0)
  }, [filteredLeads])

  const conversionRate = useMemo(() => {
    if (filteredLeads.length === 0) return '0.0'
    const convertedCount = filteredLeads.filter((l) => l.stage === 'CONVERTED').length
    return ((convertedCount / filteredLeads.length) * 100).toFixed(1)
  }, [filteredLeads])

  // Stage calculations
  const stageStats = useMemo(() => {
    return stages.map((stg) => {
      const stageLeads = filteredLeads.filter((l) => l.stage === stg.id)
      const count = stageLeads.length
      const totalVal = stageLeads.reduce((acc, l) => acc + (Number(l.value) || 0), 0)
      return {
        stage: stg,
        count,
        totalVal,
        leads: stageLeads,
      }
    })
  }, [stages, filteredLeads])

  // Distinct sources for dropdown
  const availableSources = useMemo(() => {
    const set = new Set(leads.map((l) => l.source).filter(Boolean))
    return Array.from(set)
  }, [leads])

  // -------------------------------------------------------------
  // HANDLERS
  // -------------------------------------------------------------
  const handleAdvanceStage = (leadId, e) => {
    e?.stopPropagation()
    leadsService.advanceStage(leadId)
    reloadData()
  }

  const handlePreviousStage = (leadId, e) => {
    e?.stopPropagation()
    leadsService.previousStage(leadId)
    reloadData()
  }

  const handleMoveToStage = (leadId, stageId) => {
    leadsService.moveToStage(leadId, stageId)
    reloadData()
  }

  const handleDeleteLead = (leadId, e) => {
    e?.stopPropagation()
    if (window.confirm(`Are you sure you want to delete lead ${leadId}?`)) {
      leadsService.deleteLead(leadId)
      if (activeLeadId === leadId) setActiveLeadId(null)
      reloadData()
    }
  }

  const handleToggleChecklist = (leadId, checkId) => {
    leadsService.toggleChecklistItem(leadId, checkId)
    reloadData()
  }

  // Open Proposal Modal
  const handleOpenProposalModal = (lead, e) => {
    e?.stopPropagation()
    setProposalLead(lead)
    if (lead.quotation) {
      setQuotationFormData({
        code: lead.quotation.code || '',
        items: lead.quotation.items?.length > 0 ? lead.quotation.items : [{ description: '', amount: 0 }],
        discount: lead.quotation.discount || 0,
        validUntil: lead.quotation.validUntil || '',
        notes: lead.quotation.notes || '',
      })
    } else {
      const defaultItems =
        lead.type === 'VISA'
          ? [
              { description: `${lead.targetCountry} Consulate Application & Visa Fee`, amount: Math.round(lead.value * 0.5) },
              { description: 'RH Priority Express Slot Booking & Filing Services', amount: Math.round(lead.value * 0.35) },
              { description: 'Travel Medical Insurance & Document Vetting', amount: Math.round(lead.value * 0.15) },
            ]
          : [
              { description: `${lead.serviceRequired} (Accommodations & Breakfast)`, amount: Math.round(lead.value * 0.65) },
              { description: 'Private Airport Transfers & Sightseeing Tours', amount: Math.round(lead.value * 0.25) },
              { description: 'Visa Processing & Guided Excursion Package', amount: Math.round(lead.value * 0.1) },
            ]
      setQuotationFormData({
        code: `#QUO-2026-${Math.floor(200 + Math.random() * 800)}`,
        items: defaultItems,
        discount: 0,
        validUntil: '2026-11-30',
        notes: `Prepared for ${lead.name} (${lead.company})`,
      })
    }
    setIsProposalModalOpen(true)
  }

  const handleSaveQuotation = (e) => {
    e.preventDefault()
    if (!proposalLead) return

    const subtotal = quotationFormData.items.reduce((acc, it) => acc + (Number(it.amount) || 0), 0)
    const discount = Number(quotationFormData.discount) || 0
    const total = Math.max(0, subtotal - discount)

    leadsService.saveQuotation(proposalLead.id, {
      ...quotationFormData,
      total,
    })

    // If currently in Lead or Qualified, advance to Proposal
    if (proposalLead.stage === 'LEAD' || proposalLead.stage === 'QUALIFIED') {
      leadsService.moveToStage(proposalLead.id, 'PROPOSAL')
    }

    setIsProposalModalOpen(false)
    reloadData()
  }

  // Open Case Conversion Modal (Assigns Case Specialist & Master Workflow Template)
  const handleOpenCaseModal = (lead, e) => {
    e?.stopPropagation()
    setCaseLead(lead)

    // Lookup matching master workflow template for this lead
    const leadType = lead.type === 'VISA' ? 'VISA' : 'HOLIDAY'
    const availableTemplates = masterWorkflowTemplatesService.getTemplates(leadType)

    // Intelligent auto-matching based on serviceRequired / purpose
    const reqText = (lead.serviceRequired || lead.purpose || lead.targetCountry || '').toLowerCase()
    let matched = availableTemplates.find((t) => {
      if (reqText.includes('student') || reqText.includes('study') || reqText.includes('university') || reqText.includes('cas') || reqText.includes('i-20')) {
        return t.category === 'STUDENT_VISA'
      }
      if (reqText.includes('business') || reqText.includes('corp') || reqText.includes('deputation') || reqText.includes('conference')) {
        return t.category === 'BUSINESS_CORP'
      }
      if (reqText.includes('work') || reqText.includes('permit') || reqText.includes('employment')) {
        return t.category === 'WORK_PERMIT'
      }
      if (reqText.includes('luxury') || reqText.includes('honeymoon') || reqText.includes('overwater')) {
        return t.category === 'INTERNATIONAL_LUXURY'
      }
      return false
    })

    if (!matched) {
      matched = availableTemplates.find((t) => t.isDefault) || availableTemplates[0]
    }

    setCaseFormData({
      caseId: lead.caseId || `CASE-${3000 + Math.floor(Math.random() * 900)}`,
      caseType: lead.type === 'VISA' ? 'Visa Application Filing' : 'Holiday Tour Execution',
      specialist: lead.caseDetails?.specialist || lead.assignedStaff || 'Amit Verma',
      priority: 'Normal',
      notes: `Converted from lead ${lead.id} (${lead.name}) - Applied Master Workflow: ${matched?.name || ''}`,
      templateId: matched?.id || null,
      category: matched?.category || null,
      templateName: matched?.name || null,
      stages: matched?.stages || null,
      stage: matched?.stages ? matched.stages[0]?.id : (lead.type === 'VISA' ? 'UNDER_REVIEW' : 'BOOKING_CREATED'),
      amount: lead.value || matched?.defaultFee || 25000,
    })
    setIsCaseModalOpen(true)
  }

  const handleSaveCaseConversion = (e) => {
    e.preventDefault()
    if (!caseLead) return

    leadsService.convertToCase(caseLead.id, caseFormData)
    setIsCaseModalOpen(false)
    reloadData()
  }

  // Open Add / Edit Lead Modal
  const handleOpenAddLead = () => {
    setEditingLead(null)
    setLeadFormData({
      name: '',
      company: 'Individual Traveler',
      email: '',
      phone: '',
      type: 'VISA',
      source: 'Website Form',
      targetCountry: 'United States',
      serviceRequired: 'B1/B2 Visitor Visa',
      value: 28000,
      assignedStaff: 'Amit Verma',
      stage: 'LEAD',
      customFields: [],
    })
    setIsAddLeadModalOpen(true)
  }

  const handleOpenEditLead = (lead, e) => {
    e?.stopPropagation()
    setEditingLead(lead)
    setLeadFormData({
      name: lead.name,
      company: lead.company || '',
      email: lead.email || '',
      phone: lead.phone || '',
      type: lead.type || 'VISA',
      source: lead.source || 'Website Form',
      targetCountry: lead.targetCountry || '',
      serviceRequired: lead.serviceRequired || '',
      value: lead.value || 25000,
      assignedStaff: lead.assignedStaff || 'Amit Verma',
      stage: lead.stage || 'LEAD',
      customFields: lead.customFields || [],
    })
    setIsAddLeadModalOpen(true)
  }

  const handleSaveLead = (e) => {
    e.preventDefault()
    if (editingLead) {
      leadsService.updateLead(editingLead.id, {
        ...leadFormData,
        value: Number(leadFormData.value) || 0,
      })
    } else {
      leadsService.createLead({
        ...leadFormData,
        value: Number(leadFormData.value) || 0,
      })
    }
    setIsAddLeadModalOpen(false)
    reloadData()
  }

  // HTML5 Drag and Drop Handlers
  const handleDragStart = (e, leadId) => {
    e.dataTransfer.setData('text/plain', leadId)
    setDraggedLeadId(leadId)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e, targetStageId) => {
    e.preventDefault()
    const leadId = e.dataTransfer.getData('text/plain') || draggedLeadId
    if (leadId && targetStageId) {
      handleMoveToStage(leadId, targetStageId)
    }
    setDraggedLeadId(null)
  }

  return (
    <div className="space-y-4 pb-20 font-sans text-xs">
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP HEADER & WORKFLOW PROGRESSION BANNER                   */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Leads Management — Stage Pipeline
              </h1>
              {/* <span className="px-2 py-0.5 rounded-full font-mono text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                {filteredLeads.length} of {leads.length} Leads
              </span> */}
            </div>
            {/* <p className="text-slate-500 text-[11px] mt-0.5">
              Flow: Website / Social / Direct &rarr; Stage 1: Lead &rarr; Stage 2: Qualified &rarr; Stage 3: Proposal (with Quotation Creator) &rarr; Stage 4: Negotiation &rarr; Converted &rarr; Cases
            </p> */}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* View Mode Toggle */}
            <div className="inline-flex p-0.5 rounded-lg bg-slate-100 border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('KANBAN')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'KANBAN'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>■</span>
                <span>Kanban Board</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('TABLE')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'TABLE'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>▤</span>
                <span>Table View</span>
              </button>
            </div>

            {/* Manage Stages Button */}
            <button
              type="button"
              onClick={() => setIsManageStagesModalOpen(true)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
              title="Configure pipeline stages"
            >
              <span>⚙</span>
              <span className="hidden sm:inline">Stages</span>
            </button>

            {/* + Add Lead Button */}
            <button
              type="button"
              onClick={handleOpenAddLead}
              className="px-3.5 py-1.5 rounded-lg font-bold text-white bg-[#0F0E2B] hover:bg-[#181445] shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>+</span>
              <span>Add Lead</span>
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 2. ADVANCED MULTI-CRITERIA FILTERS BAR                        */}
        {/* ------------------------------------------------------------- */}
        <div className="pt-2 border-t border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {/* Lead Type */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-500">Lead Type:</span>
              <select
                value={leadTypeFilter}
                onChange={(e) => setLeadTypeFilter(e.target.value)}
                className="px-2 py-1 rounded-md border border-slate-200 bg-slate-50 font-medium text-slate-800 text-xs focus:outline-none"
              >
                <option value="ALL">All Types ({leads.length})</option>
                <option value="VISA">Visa ({leads.filter((l) => l.type === 'VISA').length})</option>
                <option value="HOLIDAY">Holiday ({leads.filter((l) => l.type === 'HOLIDAY').length})</option>
              </select>
            </div>

            {/* Source */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-500">Source:</span>
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="px-2 py-1 rounded-md border border-slate-200 bg-slate-50 font-medium text-slate-800 text-xs focus:outline-none"
              >
                <option value="ALL">All Sources</option>
                {availableSources.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Option */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-500">Search Option:</span>
              <select
                value={searchOption}
                onChange={(e) => setSearchOption(e.target.value)}
                className="px-2 py-1 rounded-md border border-slate-200 bg-slate-50 font-medium text-slate-800 text-xs focus:outline-none"
              >
                <option value="ALL">All Fields</option>
                <option value="name">Name</option>
                <option value="phone">Phone</option>
                <option value="package">Package / Country</option>
                <option value="quote">Quotation</option>
              </select>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[200px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, phone, package, quotation..."
                className="w-full pl-6 pr-2 py-1 rounded-md border border-slate-200 bg-slate-50 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2E2B6E]"
              />
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]">🔍</span>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Aggregate Metrics */}
          {/* <div className="flex items-center gap-3 shrink-0 font-medium text-slate-600 text-[11px]">
            <span>
              Est. Pipeline Value: <strong className="text-slate-900 font-bold">₹{totalPipelineValue.toLocaleString('en-IN')}</strong>
            </span>
            <span>•</span>
            <span>
              Conversion Rate: <strong className="text-emerald-700 font-bold">{conversionRate}%</strong>
            </span>
          </div> */}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. HORIZONTAL STAGE PIPELINE PROGRESS TRACKER                 */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-xl border border-slate-200 p-2.5 shadow-2xs overflow-x-auto">
        <div className="flex items-center gap-2 min-w-[700px]">
          {stageStats.map((item, idx) => (
            <React.Fragment key={item.stage.id}>
              <div
                className={`flex-1 p-2 rounded-lg border transition-all ${
                  item.count > 0 ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-100 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded text-[10px] font-black bg-slate-800 text-white flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-extrabold text-slate-900 text-xs">{item.stage.shortName}</span>
                  </div>
                  <span className="font-bold text-[11px] text-slate-700 whitespace-nowrap">
                    {item.count} {item.count === 1 ? 'Lead' : 'Leads'}
                  </span>
                </div>
              </div>
              {idx < stageStats.length - 1 && (
                <span className="text-slate-300 font-bold text-xs select-none">&rarr;</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. KANBAN BOARD VIEW                                          */}
      {/* ------------------------------------------------------------- */}
      {viewMode === 'KANBAN' && (
        <div className="flex gap-3.5 items-start overflow-x-auto pb-4">
          {stageStats.map((col, colIdx) => (
            <div
              key={col.stage.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.stage.id)}
              className="bg-slate-50/80 rounded-2xl border border-slate-200/90 flex flex-col max-h-[calc(100vh-280px)] overflow-hidden shadow-2xs w-[285px] min-w-[285px] shrink-0"
            >
              {/* Column Header (Pinned) */}
              <div className="p-3 border-b border-slate-200 bg-white rounded-t-2xl space-y-1 shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <h2 className="font-black text-xs text-slate-900 tracking-tight">{col.stage.name}</h2>
                  </div>
                  <span className="w-5 h-5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 font-mono flex items-center justify-center shadow-2xs">
                    {col.count}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 leading-tight font-medium line-clamp-1">
                  {col.stage.subtitle}
                </p>

                {/* Highlight banner if any */}
                {col.stage.highlightBanner && (
                  <div className="mt-1 px-2 py-0.5 rounded bg-indigo-50/80 text-[10px] font-bold text-indigo-900 border border-indigo-200 shadow-2xs text-center">
                    {col.stage.highlightBanner}
                  </div>
                )}
              </div>

              {/* Cards Container with Independent Smooth Scrolling */}
              <div className="p-2 space-y-2.5 overflow-y-auto flex-1">
                {col.leads.length === 0 ? (
                  <div className="p-4 text-center text-[11px] text-slate-400 bg-white/60 rounded-lg border border-dashed border-slate-200">
                    No leads in {col.stage.shortName}
                  </div>
                ) : (
                  col.leads.map((lead) => {
                    const checklistTotal = lead.checklist?.length || 0
                    const checklistCompleted = (lead.checklist || []).filter((c) => c.completed).length
                    const isAllChecksDone = checklistTotal > 0 && checklistCompleted === checklistTotal

                    return (
                      <div
                        key={lead.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, lead.id)}
                        className="bg-white rounded-xl border border-slate-200/90 p-3 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all space-y-2 cursor-grab active:cursor-grabbing group"
                      >
                        {/* Top Badges & ID */}
                        <div className="flex items-center justify-between text-[10px]">
                          <div className="flex items-center gap-1">
                            <span
                              className={`px-1.5 py-0.5 rounded font-bold uppercase ${
                                lead.type === 'VISA'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : 'bg-purple-50 text-purple-700 border border-purple-200'
                              }`}
                            >
                              {lead.type}
                            </span>
                            <span className="px-1.5 py-0.5 rounded font-medium bg-slate-100 text-slate-600 border border-slate-200">
                              {lead.source?.includes('Website') ? 'Web' : lead.source?.includes('FB') ? 'Social' : 'Direct'}
                            </span>
                          </div>
                          <span className="font-mono font-bold text-slate-400 text-[10px]">{lead.id}</span>
                        </div>

                        {/* Lead Title & Company */}
                        <div>
                          <h3
                            onClick={() => setActiveLeadId(lead.id)}
                            className="font-bold text-[11px] text-slate-900 group-hover:text-[#2E2B6E] transition-colors cursor-pointer truncate leading-tight"
                          >
                            {lead.name}
                          </h3>
                          <span className="text-[10px] text-slate-500 block truncate mt-0.5">{lead.company}</span>
                        </div>

                        {/* Destination & Service */}
                        <div className="text-[10px] text-slate-600 font-medium flex items-center gap-1 truncate">
                          <span>📍</span>
                          <span className="truncate">{lead.targetCountry} &bull; {lead.serviceRequired}</span>
                        </div>

                        {/* Value and Converted Case Specialist / Date */}
                        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                          <span className="font-bold text-slate-900">
                            ₹{Number(lead.value).toLocaleString('en-IN')}
                          </span>
                          {lead.stage === 'CONVERTED' && lead.caseDetails?.specialist ? (
                            <span className="text-[9px] text-emerald-700 font-medium flex items-center gap-1 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              <span>👤</span>
                              <span className="truncate max-w-[100px]">{lead.caseDetails.specialist}</span>
                            </span>
                          ) : (
                            <span className="text-[9px] font-mono text-slate-400">
                              {lead.createdDate}
                            </span>
                          )}
                        </div>

                        {/* Proposal / Quotation Chip */}
                        {lead.quotation && (
                          <div className="px-2 py-1 rounded-md bg-purple-50/80 border border-purple-200 text-[9px] flex items-center justify-between">
                            <span className="font-mono font-bold text-purple-700">📜 Quote {lead.quotation.code}</span>
                            <span className="font-black text-purple-900">₹{Number(lead.quotation.total).toLocaleString('en-IN')}</span>
                          </div>
                        )}

                        {/* Converted Case Chip */}
                        {lead.caseId && (
                          <div className="px-2 py-1 rounded-md bg-emerald-50/80 border border-emerald-200 text-[9px] flex items-center justify-between">
                            <span className="font-mono font-bold text-emerald-800">📁 {lead.caseId}</span>
                            <span className="text-[8px] uppercase font-bold px-1.5 py-0.2 bg-emerald-200 text-emerald-800 rounded">Converted</span>
                          </div>
                        )}

                        {/* Checklist indicator */}
                        <div className="flex items-center justify-between text-[9px]">
                          <span className={`font-medium ${isAllChecksDone ? 'text-emerald-700 font-bold' : 'text-slate-500'}`}>
                            {isAllChecksDone ? '✔ Mandatory checks ready' : 'Checklist'}
                          </span>
                          <span className="text-slate-400 font-mono text-[9px]">
                            {checklistCompleted}/{checklistTotal}
                          </span>
                        </div>

                        {/* Bottom Actions: Previous / Side Sheet / Advance */}
                        <div className="pt-1.5 border-t border-slate-100 flex items-center gap-1">
                          <button
                            type="button"
                            disabled={colIdx === 0}
                            onClick={(e) => handlePreviousStage(lead.id, e)}
                            className="px-2 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none text-slate-700 font-bold text-[9px] cursor-pointer"
                            title="Move back to previous stage"
                          >
                            &larr;
                          </button>

                          <button
                            type="button"
                            onClick={() => setActiveLeadId(lead.id)}
                            className="flex-1 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-[9px] transition-colors cursor-pointer text-center"
                          >
                            Side Sheet & Details
                          </button>

                          <button
                            type="button"
                            disabled={colIdx === stageStats.length - 1}
                            onClick={(e) => handleAdvanceStage(lead.id, e)}
                            className="px-2 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none text-slate-700 font-bold text-[9px] cursor-pointer"
                            title="Advance to next stage"
                          >
                            &rarr;
                          </button>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. TABLE VIEW                                                 */}
      {/* ------------------------------------------------------------- */}
      {viewMode === 'TABLE' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-3 py-2.5">Lead Name & ID</th>
                  <th className="px-3 py-2.5">Company</th>
                  <th className="px-3 py-2.5">Contact Info</th>
                  <th className="px-3 py-2.5">Type</th>
                  <th className="px-3 py-2.5">Source</th>
                  <th className="px-3 py-2.5">Target Country</th>
                  <th className="px-3 py-2.5">Current Stage</th>
                  <th className="px-3 py-2.5">Est. Value</th>
                  <th className="px-3 py-2.5">Proposal / Case</th>
                  <th className="px-3 py-2.5">Created Date</th>
                  <th className="px-3 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-8 text-center text-slate-400">
                      No matching leads found.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => {
                    const currentStageObj = stages.find((s) => s.id === lead.stage)
                    const stageIndex = stages.findIndex((s) => s.id === lead.stage)

                    return (
                      <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Name & ID */}
                        <td className="px-3 py-2 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => setActiveLeadId(lead.id)}
                            className="font-bold text-slate-900 hover:text-[#2E2B6E] text-left cursor-pointer"
                          >
                            {lead.name}
                          </button>
                          <span className="font-mono text-[10px] text-slate-400 block">{lead.id}</span>
                        </td>

                        {/* Company */}
                        <td className="px-3 py-2 whitespace-nowrap text-slate-600 font-medium">
                          {lead.company || '—'}
                        </td>

                        {/* Contact */}
                        <td className="px-3 py-2 whitespace-nowrap">
                          <span className="text-slate-800 font-medium block">{lead.email}</span>
                          <span className="text-[10px] text-slate-400">{lead.phone}</span>
                        </td>

                        {/* Type */}
                        <td className="px-3 py-2 whitespace-nowrap">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                              lead.type === 'VISA'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-purple-50 text-purple-700 border border-purple-200'
                            }`}
                          >
                            {lead.type}
                          </span>
                        </td>

                        {/* Source */}
                        <td className="px-3 py-2 whitespace-nowrap text-slate-600">
                          {lead.source}
                        </td>

                        {/* Target Country */}
                        <td className="px-3 py-2 whitespace-nowrap font-medium text-slate-800">
                          {lead.targetCountry}
                        </td>

                        {/* Stage */}
                        <td className="px-3 py-2 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border bg-slate-100 text-slate-800 border-slate-300">
                            {currentStageObj?.shortName || lead.stage}
                          </span>
                        </td>

                        {/* Value */}
                        <td className="px-3 py-2 whitespace-nowrap font-black text-slate-900">
                          ₹{Number(lead.value).toLocaleString('en-IN')}
                        </td>

                        {/* Proposal / Case */}
                        <td className="px-3 py-2 whitespace-nowrap">
                          {lead.caseId ? (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 font-mono font-bold text-[10px]">
                              {lead.caseId}
                            </span>
                          ) : lead.quotation?.code ? (
                            <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-300 font-mono font-bold text-[10px]">
                              {lead.quotation.code}
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>

                        {/* Created Date */}
                        <td className="px-3 py-2 whitespace-nowrap text-slate-500 font-mono text-[10px]">
                          {lead.createdDate}
                        </td>

                        {/* Actions */}
                        <td className="px-3 py-2 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => setActiveLeadId(lead.id)}
                              className="px-2 py-0.5 rounded border border-slate-200 bg-white hover:bg-slate-100 text-[10px] font-semibold text-slate-700 cursor-pointer"
                            >
                              Side Sheet
                            </button>

                            {lead.stage === 'PROPOSAL' || lead.stage === 'NEGOTIATION' ? (
                              <button
                                type="button"
                                onClick={(e) => handleOpenProposalModal(lead, e)}
                                className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-semibold cursor-pointer"
                              >
                                Quotation
                              </button>
                            ) : null}

                            {lead.stage === 'CONVERTED' ? (
                              <button
                                type="button"
                                onClick={(e) => handleOpenCaseModal(lead, e)}
                                className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-semibold cursor-pointer"
                              >
                                Case
                              </button>
                            ) : null}

                            <button
                              type="button"
                              disabled={stageIndex === stages.length - 1}
                              onClick={(e) => handleAdvanceStage(lead.id, e)}
                              className="px-1.5 py-0.5 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-20 text-[10px] font-bold text-slate-700 cursor-pointer"
                              title="Advance stage"
                            >
                              &rarr; Next
                            </button>

                            <button
                              type="button"
                              onClick={(e) => handleDeleteLead(lead.id, e)}
                              className="px-1.5 py-0.5 rounded border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-bold cursor-pointer"
                              title="Delete lead"
                            >
                              Del
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 6. SIDE SHEET DRAWER (EXACT REPLICA OF SCREENSHOT 3)           */}
      {/* ------------------------------------------------------------- */}
      {activeLead && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex justify-end">
          <div className="w-full max-w-xl h-full bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      activeLead.type === 'VISA'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {activeLead.type}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-200 text-slate-700">
                    {activeLead.source}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-500">{activeLead.id}</span>
                </div>
                <h2 className="text-base font-black text-slate-900 tracking-tight">{activeLead.name}</h2>
                <p className="text-xs text-slate-500 font-medium">
                  {activeLead.company} • {activeLead.email}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveLeadId(null)}
                className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold shadow-2xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Drawer Body Scroll */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {/* SECTION A: Stage Progression Pipeline */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                  Stage Progression Pipeline
                </span>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {stages.map((stg, idx) => {
                    const isCurrent = activeLead.stage === stg.id
                    const currentIndex = stages.findIndex((s) => s.id === activeLead.stage)
                    const isPassed = idx < currentIndex

                    return (
                      <button
                        key={stg.id}
                        type="button"
                        onClick={() => handleMoveToStage(activeLead.id, stg.id)}
                        className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shrink-0 ${
                          isCurrent
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : isPassed
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <span className="w-4 h-4 rounded text-[10px] flex items-center justify-center font-bold bg-black/10">
                          {idx + 1}
                        </span>
                        <span>{stg.shortName}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* SECTION B: Stage Checklist (<CurrentStage>) */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">
                      Stage Checklist ({stages.find((s) => s.id === activeLead.stage)?.shortName || activeLead.stage})
                    </h3>
                    <p className="text-[10px] text-slate-500">Mandatory items required to move stage</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    {(activeLead.checklist || []).filter((c) => c.completed).length}/{(activeLead.checklist || []).length}
                  </span>
                </div>

                {/* Checklist Checkboxes */}
                <div className="space-y-2">
                  {(activeLead.checklist || []).map((item) => (
                    <label
                      key={item.id}
                      className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => handleToggleChecklist(activeLead.id, item.id)}
                        className="mt-0.5 rounded text-[#2E2B6E] focus:ring-0 cursor-pointer"
                      />
                      <div className="flex-1 text-xs">
                        <span className={`${item.completed ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}`}>
                          {item.text}
                        </span>
                      </div>
                      {item.required && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-rose-50 text-rose-700 border border-rose-200">
                          Required
                        </span>
                      )}
                    </label>
                  ))}
                </div>

                {/* Stage Progression Action Buttons */}
                <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handlePreviousStage(activeLead.id)}
                    className="flex-1 py-1.5 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-bold text-slate-700 text-xs shadow-2xs transition-all cursor-pointer"
                  >
                    &larr; Back to Previous Stage
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAdvanceStage(activeLead.id)}
                    className="flex-1 py-1.5 px-3 rounded-lg font-bold text-white bg-slate-900 hover:bg-slate-800 text-xs shadow-2xs transition-all cursor-pointer"
                  >
                    Advance to Next Stage &rarr;
                  </button>
                </div>
              </div>

              {/* SECTION C: Proposal & Quotation Details */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="text-xs font-bold text-slate-900">Proposal & Quotation Details</h3>
                  <button
                    type="button"
                    onClick={(e) => handleOpenProposalModal(activeLead, e)}
                    className="px-2.5 py-1 rounded-md bg-slate-900 text-white hover:bg-slate-800 font-bold text-[10px] cursor-pointer"
                  >
                    {activeLead.quotation ? 'Edit Proposal' : 'Open Proposal Creator'}
                  </button>
                </div>

                {activeLead.quotation ? (
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-slate-800 text-sm">
                        {activeLead.quotation.code}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-50 text-purple-700 border border-purple-200">
                        {activeLead.quotation.status}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Itemized Breakdown</span>
                      {activeLead.quotation.items?.map((it, idx) => (
                        <div key={idx} className="flex items-center justify-between text-[11px] text-slate-700">
                          <span className="truncate pr-2">• {it.description}</span>
                          <span className="font-bold shrink-0">₹{Number(it.amount).toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                      {activeLead.quotation.discount > 0 && (
                        <div className="flex items-center justify-between text-[11px] text-emerald-700 border-t border-slate-200 pt-1">
                          <span>Applied Discount</span>
                          <span className="font-bold">-₹{Number(activeLead.quotation.discount).toLocaleString('en-IN')}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between font-black text-slate-900 text-xs border-t border-slate-200 pt-1">
                        <span>Total Quotation Value</span>
                        <span>₹{Number(activeLead.quotation.total).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500 text-xs leading-relaxed">
                    No proposal quotation has been generated yet for this lead. Click &quot;Open Proposal Creator&quot; to draft an itemized quotation.
                  </p>
                )}
              </div>

              {/* SECTION D: Operations Case Conversion */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="text-xs font-bold text-slate-900">Operations Case Conversion</h3>
                  {!activeLead.caseId && (
                    <button
                      type="button"
                      onClick={(e) => handleOpenCaseModal(activeLead, e)}
                      className="px-2.5 py-1 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[10px] cursor-pointer"
                    >
                      Convert to Case
                    </button>
                  )}
                </div>

                {activeLead.caseId ? (
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-emerald-800 text-sm">
                        {activeLead.caseId}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {activeLead.caseDetails?.status || 'ACTIVE'}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-200/80 space-y-1.5 text-xs">
                      <div>
                        <span className="text-[10px] text-emerald-900 font-bold block">Case Category:</span>
                        <span className="font-semibold text-slate-800">{activeLead.caseDetails?.caseType}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-emerald-900 font-bold block">Assigned Specialist:</span>
                          <span className="font-semibold text-slate-800">{activeLead.caseDetails?.specialist}</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => handleOpenCaseModal(activeLead, e)}
                          className="px-2 py-1 rounded bg-white border border-emerald-300 text-emerald-800 font-bold text-[10px] hover:bg-emerald-50 cursor-pointer"
                        >
                          Reassign
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Lead has not been converted to an active Case yet. Once marked &quot;Converted&quot;, it can be assigned to Visa or Holiday specialists.
                  </p>
                )}
              </div>

              {/* SECTION E: Lead Profile & Inquiry & Assigned Staff */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="text-xs font-bold text-slate-900">Lead Profile & Inquiry</h3>
                  <button
                    type="button"
                    onClick={(e) => handleOpenEditLead(activeLead, e)}
                    className="text-slate-600 hover:text-slate-900 font-bold text-[10px] underline cursor-pointer"
                  >
                    Edit Profile
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Phone</span>
                    <a href={`tel:${activeLead.phone}`} className="font-bold text-slate-800 hover:underline">
                      {activeLead.phone}
                    </a>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Email</span>
                    <a href={`mailto:${activeLead.email}`} className="font-bold text-slate-800 hover:underline truncate block">
                      {activeLead.email}
                    </a>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Target Country</span>
                    <span className="font-bold text-slate-800">{activeLead.targetCountry}</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Service Required</span>
                    <span className="font-bold text-slate-800">{activeLead.serviceRequired}</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Estimated Value</span>
                    <span className="font-black text-slate-900 text-sm">
                      ₹{Number(activeLead.value).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Created Date</span>
                    <span className="font-mono text-slate-700">{activeLead.createdDate}</span>
                  </div>

                  {/* Flexible Custom Fields */}
                  {activeLead.customFields && activeLead.customFields.length > 0 && (
                    <div className="col-span-2 space-y-1.5 pt-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Custom Fields & Attributes
                      </span>
                      {activeLead.customFields.map((cf, idx) => (
                        <div key={idx} className="flex items-center justify-between p-1.5 rounded bg-slate-50 border border-slate-100 text-xs">
                          <span className="font-semibold text-slate-600">{cf.key}:</span>
                          <span className="font-bold text-slate-900">{cf.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={(e) => handleDeleteLead(activeLead.id, e)}
                className="px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs cursor-pointer"
              >
                Delete Lead
              </button>

              <button
                type="button"
                onClick={() => setActiveLeadId(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 font-bold text-xs cursor-pointer"
              >
                Close Side Sheet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 7. MODAL: ADD / EDIT LEAD (Flexible Fields & Staff Assignment) */}
      {/* ------------------------------------------------------------- */}
      {isAddLeadModalOpen && (
        <Modal
          isOpen={isAddLeadModalOpen}
          onClose={() => setIsAddLeadModalOpen(false)}
          title={editingLead ? `Edit Lead: ${editingLead.name} (${editingLead.id})` : 'Add New Lead'}
          size="lg"
        >
          <form onSubmit={handleSaveLead} className="space-y-3 font-sans text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={leadFormData.name}
                  onChange={(e) => setLeadFormData({ ...leadFormData, name: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company / Organization</label>
                <input
                  type="text"
                  placeholder="e.g. Apex Tours & Tech or Individual"
                  value={leadFormData.company}
                  onChange={(e) => setLeadFormData({ ...leadFormData, company: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="applicant@example.com"
                  value={leadFormData.email}
                  onChange={(e) => setLeadFormData({ ...leadFormData, email: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  placeholder="+91 98765 43210"
                  value={leadFormData.phone}
                  onChange={(e) => setLeadFormData({ ...leadFormData, phone: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Lead Type *</label>
                <select
                  value={leadFormData.type}
                  onChange={(e) => setLeadFormData({ ...leadFormData, type: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs"
                >
                  <option value="VISA">Visa Application Filing</option>
                  <option value="HOLIDAY">Holiday & Tour Package</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Inquiry Source *</label>
                <select
                  value={leadFormData.source}
                  onChange={(e) => setLeadFormData({ ...leadFormData, source: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs"
                >
                  <option value="Website Form">Website Form</option>
                  <option value="FB / Instagram">FB / Instagram</option>
                  <option value="Direct entry">Direct entry</option>
                  <option value="Google Ads">Google Ads</option>
                  <option value="Referral">Client Referral</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Country / Region *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. United States or Switzerland"
                  value={leadFormData.targetCountry}
                  onChange={(e) => setLeadFormData({ ...leadFormData, targetCountry: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Service / Package Required *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. B1/B2 Visitor Visa or 7 Days Alps Tour"
                  value={leadFormData.serviceRequired}
                  onChange={(e) => setLeadFormData({ ...leadFormData, serviceRequired: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Estimated Value (₹) *</label>
                <input
                  type="number"
                  required
                  value={leadFormData.value}
                  onChange={(e) => setLeadFormData({ ...leadFormData, value: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pipeline Stage *</label>
                <select
                  value={leadFormData.stage}
                  onChange={(e) => setLeadFormData({ ...leadFormData, stage: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs"
                >
                  {stages.map((stg) => (
                    <option key={stg.id} value={stg.id}>
                      {stg.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsAddLeadModalOpen(false)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 font-bold cursor-pointer"
              >
                {editingLead ? 'Save Changes' : 'Create Lead'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 8. MODAL: PROPOSAL & QUOTATION CREATOR BUILDER                 */}
      {/* ------------------------------------------------------------- */}
      {isProposalModalOpen && proposalLead && (
        <Modal
          isOpen={isProposalModalOpen}
          onClose={() => setIsProposalModalOpen(false)}
          title={`Draft Proposal & Quotation: ${proposalLead.name} (${proposalLead.id})`}
          size="lg"
        >
          <form onSubmit={handleSaveQuotation} className="space-y-4 font-sans text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Quotation ID</label>
                <input
                  type="text"
                  required
                  value={quotationFormData.code}
                  onChange={(e) => setQuotationFormData({ ...quotationFormData, code: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Validity Date</label>
                <input
                  type="date"
                  value={quotationFormData.validUntil}
                  onChange={(e) => setQuotationFormData({ ...quotationFormData, validUntil: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50"
                />
              </div>
            </div>

            {/* Line Items Table */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">Itemized Proposal Line Items</label>
                <button
                  type="button"
                  onClick={() =>
                    setQuotationFormData({
                      ...quotationFormData,
                      items: [...quotationFormData.items, { description: '', amount: 0 }],
                    })
                  }
                  className="text-xs font-bold text-[#2E2B6E] hover:underline cursor-pointer"
                >
                  + Add Line Item
                </button>
              </div>

              <div className="space-y-2">
                {quotationFormData.items.map((it, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Service or fee description..."
                      value={it.description}
                      onChange={(e) => {
                        const updated = [...quotationFormData.items]
                        updated[idx].description = e.target.value
                        setQuotationFormData({ ...quotationFormData, items: updated })
                      }}
                      className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50"
                    />
                    <div className="relative w-32">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                      <input
                        type="number"
                        required
                        placeholder="Amount"
                        value={it.amount}
                        onChange={(e) => {
                          const updated = [...quotationFormData.items]
                          updated[idx].amount = Number(e.target.value) || 0
                          setQuotationFormData({ ...quotationFormData, items: updated })
                        }}
                        className="w-full pl-6 pr-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 font-bold"
                      />
                    </div>
                    {quotationFormData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = quotationFormData.items.filter((_, i) => i !== idx)
                          setQuotationFormData({ ...quotationFormData, items: updated })
                        }}
                        className="text-rose-600 hover:text-rose-800 px-2 font-bold cursor-pointer"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Discount & Calculation */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium">Subtotal</span>
                <span className="font-bold text-slate-800">
                  ₹{quotationFormData.items.reduce((acc, it) => acc + (Number(it.amount) || 0), 0).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium">Discount (₹)</span>
                <input
                  type="number"
                  value={quotationFormData.discount}
                  onChange={(e) => setQuotationFormData({ ...quotationFormData, discount: Number(e.target.value) || 0 })}
                  className="w-28 px-2 py-0.5 rounded border border-slate-300 bg-white font-bold text-right"
                />
              </div>

              <div className="flex items-center justify-between border-t border-slate-200 pt-1.5 font-black text-sm text-slate-900">
                <span>Final Quotation Total</span>
                <span className="text-base text-[#2E2B6E]">
                  ₹{Math.max(
                    0,
                    quotationFormData.items.reduce((acc, it) => acc + (Number(it.amount) || 0), 0) -
                      (Number(quotationFormData.discount) || 0)
                  ).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsProposalModalOpen(false)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 font-bold cursor-pointer"
              >
                Save & Attach Quotation
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 9. MODAL: OPERATIONS CASE CONVERSION & REASSIGNMENT            */}
      {/* ------------------------------------------------------------- */}
      {isCaseModalOpen && caseLead && (() => {
        const leadType = caseLead.type === 'VISA' ? 'VISA' : 'HOLIDAY'
        const availableTemplates = masterWorkflowTemplatesService.getTemplates(leadType)
        const currentTemplate = availableTemplates.find((t) => t.id === caseFormData.templateId) || availableTemplates[0]

        const handleSelectTemplate = (tplId) => {
          const tpl = availableTemplates.find((t) => t.id === tplId)
          if (!tpl) return
          setCaseFormData({
            ...caseFormData,
            templateId: tpl.id,
            category: tpl.category,
            templateName: tpl.name,
            stages: tpl.stages,
            stage: tpl.stages[0]?.id,
            amount: caseFormData.amount || tpl.defaultFee,
            notes: `Converted from lead ${caseLead.id} (${caseLead.name}) - Applied Master Workflow: ${tpl.name}`,
          })
        }

        return (
          <Modal
            isOpen={isCaseModalOpen}
            onClose={() => setIsCaseModalOpen(false)}
            title={`Operations Case Setup: ${caseLead.name}`}
            size="lg"
          >
            <form onSubmit={handleSaveCaseConversion} className="space-y-3.5 font-sans text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Case Tracking ID</label>
                  <input
                    type="text"
                    required
                    value={caseFormData.caseId}
                    onChange={(e) => setCaseFormData({ ...caseFormData, caseId: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Specialist Officer</label>
                  <select
                    value={caseFormData.specialist}
                    onChange={(e) => setCaseFormData({ ...caseFormData, specialist: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 font-bold"
                  >
                    {STAFF_MEMBERS.map((st) => (
                      <option key={st.id} value={st.name}>
                        {st.name} ({st.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Master Stage Config Template Selector */}
              <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-indigo-950 uppercase tracking-wider">
                    ⚙️ Master Stage & Workflow Template Config
                  </label>
                  <span className="text-[10px] font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200">
                    Auto-Populated by Category
                  </span>
                </div>

                <div>
                  <select
                    value={caseFormData.templateId || currentTemplate?.id}
                    onChange={(e) => handleSelectTemplate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-indigo-300 bg-white font-bold text-slate-900 shadow-2xs focus:ring-1 focus:ring-indigo-500 cursor-pointer text-xs"
                  >
                    {availableTemplates.map((tpl) => (
                      <option key={tpl.id} value={tpl.id}>
                        {tpl.name} ({tpl.categoryName} • {tpl.stages?.length || 0} Stages • {tpl.estimatedDays})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Live Template Stepper Preview */}
                {currentTemplate && (
                  <div className="p-2.5 rounded-lg bg-white border border-indigo-100 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-900">
                        {currentTemplate.name}
                      </span>
                      <span className="font-semibold text-emerald-700">
                        Base Fee: ₹{Number(currentTemplate.defaultFee || 0).toLocaleString('en-IN')} • SLA: {currentTemplate.estimatedDays}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                      {currentTemplate.stages?.map((st, sIdx) => (
                        <React.Fragment key={st.id || sIdx}>
                          <div className="flex items-center gap-1 px-2 py-1 rounded bg-slate-50 border border-slate-200 text-[10px] shrink-0 font-medium text-slate-800">
                            <span className={`w-3.5 h-3.5 rounded text-[8px] flex items-center justify-center font-bold ${st.colorBadge || 'bg-slate-700 text-white'}`}>
                              {st.stepNumber || sIdx + 1}
                            </span>
                            <span>{st.shortTitle}</span>
                            <span className="text-[8px] px-1 py-0.2 rounded bg-slate-200 text-slate-700 font-bold">
                              {st.checklist?.filter((c) => c.mandatory)?.length || 0} req
                            </span>
                          </div>
                          {sIdx < currentTemplate.stages.length - 1 && (
                            <span className="text-slate-300 text-[10px]">&rarr;</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>

                    <p className="text-[10px] text-slate-500 italic">
                      ✔ Upon conversion, this case will automatically inherit all {currentTemplate.stages?.length || 0} stages and {currentTemplate.stages?.reduce((acc, s) => acc + (s.checklist?.length || 0), 0)} checklist items from the master template.
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Case Notes & Handoff Instructions</label>
                <textarea
                  rows={2}
                  value={caseFormData.notes}
                  onChange={(e) => setCaseFormData({ ...caseFormData, notes: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCaseModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 font-bold cursor-pointer shadow-xs"
                >
                  Confirm & Create Case
                </button>
              </div>
            </form>
          </Modal>
        )
      })()}

      {/* ------------------------------------------------------------- */}
      {/* 10. MODAL: MANAGE PIPELINE STAGES (Dynamic & Configurable)    */}
      {/* ------------------------------------------------------------- */}
      {isManageStagesModalOpen && (
        <Modal
          isOpen={isManageStagesModalOpen}
          onClose={() => setIsManageStagesModalOpen(false)}
          title="Configure Pipeline Stages & Workflow"
          size="md"
        >
          <div className="space-y-4 font-sans text-xs">
            <p className="text-slate-500 text-xs">
              The CRM stages are fully dynamic and configurable. Add custom intermediate steps or customize default stages.
            </p>

            {/* List of current stages */}
            <div className="space-y-2">
              {stages.map((stg, idx) => (
                <div key={stg.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded font-black text-white bg-slate-800 flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <div>
                      <span className="font-bold text-slate-900 block">{stg.name}</span>
                      <span className="text-[10px] text-slate-500">{stg.subtitle}</span>
                    </div>
                  </div>

                  {stages.length > 2 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Delete stage "${stg.name}"?`)) {
                          leadsService.deleteStage(stg.id)
                          reloadData()
                        }
                      }}
                      className="text-rose-600 hover:text-rose-800 font-bold text-xs px-2 cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add Custom Stage Form */}
            <div className="p-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 space-y-2">
              <span className="font-bold text-slate-800 block text-xs">+ Add New Pipeline Stage</span>
              <div className="grid grid-cols-1 gap-2">
                <input
                  type="text"
                  placeholder="Stage Name (e.g. Stage 2.5: Document Verification)"
                  value={newStageName}
                  onChange={(e) => setNewStageName(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                />
                <input
                  type="text"
                  placeholder="Stage Subtitle / Description..."
                  value={newStageSubtitle}
                  onChange={(e) => setNewStageSubtitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newStageName.trim()) {
                      leadsService.addStage({
                        name: newStageName.trim(),
                        subtitle: newStageSubtitle.trim() || 'Custom workflow stage',
                      })
                      setNewStageName('')
                      setNewStageSubtitle('')
                      reloadData()
                    }
                  }}
                  className="w-full py-1.5 rounded-lg bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 cursor-pointer"
                >
                  Add Stage to Pipeline
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Reset stages back to standard 5 CRM stages?')) {
                    leadsService.resetStagesToDefault()
                    reloadData()
                  }
                }}
                className="text-slate-500 hover:text-slate-800 underline text-xs font-medium cursor-pointer"
              >
                Reset to Default 5 Stages
              </button>

              <button
                type="button"
                onClick={() => setIsManageStagesModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-900 text-white font-bold text-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default Leads

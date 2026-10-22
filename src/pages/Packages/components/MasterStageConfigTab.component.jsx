import React, { useState, useMemo } from 'react'
import Modal from '../../../components/Modal/Modal.component'
import masterWorkflowTemplatesService, {
  VISA_CATEGORIES,
  HOLIDAY_CATEGORIES,
  DEFAULT_WORKFLOW_TEMPLATES,
  MASTER_VISA_STAGES_POOL,
  MASTER_HOLIDAY_STAGES_POOL,
} from '../../../services/masterWorkflowTemplates'

/**
 * Helper to format Indian Rupees
 */
const formatINR = (val) => {
  if (val === undefined || val === null || val === '') return '₹0'
  return `₹${Number(val).toLocaleString('en-IN')}`
}

/**
 * Predefined stage color badge options for visual themes
 */
const STAGE_COLOR_OPTIONS = [
  { id: 'indigo', label: 'Indigo', badge: 'bg-indigo-600 text-white', border: 'border-indigo-400 text-indigo-700 bg-indigo-50/90', header: 'bg-indigo-500/10 text-indigo-900 border-indigo-300' },
  { id: 'blue', label: 'Blue', badge: 'bg-blue-600 text-white', border: 'border-blue-400 text-blue-700 bg-blue-50/90', header: 'bg-blue-500/10 text-blue-900 border-blue-300' },
  { id: 'purple', label: 'Purple', badge: 'bg-purple-600 text-white', border: 'border-purple-400 text-purple-700 bg-purple-50/90', header: 'bg-purple-500/10 text-purple-900 border-purple-300' },
  { id: 'orange', label: 'Orange', badge: 'bg-orange-500 text-white', border: 'border-orange-400 text-orange-700 bg-orange-50/90', header: 'bg-orange-500/10 text-orange-900 border-orange-300' },
  { id: 'teal', label: 'Teal', badge: 'bg-teal-600 text-white', border: 'border-teal-500 text-teal-700 bg-teal-50/90', header: 'bg-teal-500/10 text-teal-900 border-teal-300' },
  { id: 'emerald', label: 'Emerald', badge: 'bg-emerald-600 text-white', border: 'border-emerald-400 text-emerald-700 bg-emerald-50/90', header: 'bg-emerald-500/10 text-emerald-900 border-emerald-300' },
  { id: 'amber', label: 'Amber', badge: 'bg-amber-500 text-white', border: 'border-amber-400 text-amber-700 bg-amber-50/90', header: 'bg-amber-500/10 text-amber-900 border-amber-300' },
  { id: 'rose', label: 'Rose', badge: 'bg-rose-600 text-white', border: 'border-rose-400 text-rose-700 bg-rose-50/90', header: 'bg-rose-500/10 text-rose-900 border-rose-300' },
]

/**
 * ============================================================================
 * MasterStageConfigTab Component
 * ============================================================================
 * Manages category-based master workflow templates for Visa Applications and
 * Holiday Packages.
 * 
 * Flow & Inheritance:
 * 1. Admin configures stages, sequence, mandatory checklists, and required docs.
 * 2. When a Lead is converted to a Case (e.g. Student Visa), it automatically
 *    inherits this template's stages and checklist items.
 * 3. When creating a Case directly, selecting the category auto-populates
 *    fees, stages, and checklist requirements.
 * ============================================================================
 */
export const MasterStageConfigTab = ({ isAdmin = true }) => {
  // --------------------------------------------------------------------------
  // [SECTION 1: STATE & DATA MANAGEMENT]
  // --------------------------------------------------------------------------
  const [templateType, setTemplateType] = useState('VISA') // 'VISA' | 'HOLIDAY'
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [templates, setTemplates] = useState(() => masterWorkflowTemplatesService.getTemplates())

  // Modal states
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false)
  const [isLivePreviewModalOpen, setIsLivePreviewModalOpen] = useState(false)
  const [previewTemplate, setPreviewTemplate] = useState(null)
  const [editingTemplate, setEditingTemplate] = useState(null)
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState(null)

  // Active categories for current type
  const availableCategories = useMemo(() => {
    return templateType === 'VISA' ? VISA_CATEGORIES : HOLIDAY_CATEGORIES
  }, [templateType])

  // Reload data from service
  const reloadTemplates = () => {
    setTemplates(masterWorkflowTemplatesService.getTemplates())
  }

  // Filtered templates list
  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      if (t.type !== templateType) return false

      const matchesCat =
        selectedCategoryFilter === 'ALL' || t.category === selectedCategoryFilter

      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.categoryName?.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        (t.stages && t.stages.some((s) => s.title.toLowerCase().includes(q) || s.shortTitle.toLowerCase().includes(q)))

      return matchesCat && matchesSearch
    })
  }, [templates, templateType, selectedCategoryFilter, searchQuery])

  // --------------------------------------------------------------------------
  // [SECTION 2: TEMPLATE ACTIONS]
  // --------------------------------------------------------------------------
  const handleOpenAddTemplate = () => {
    const defaultCat = availableCategories[0]
    const matchedDefaultTemplate = DEFAULT_WORKFLOW_TEMPLATES.find(
      (t) => t.type === templateType && t.category === defaultCat?.id
    )

    const initialStages = matchedDefaultTemplate
      ? JSON.parse(JSON.stringify(matchedDefaultTemplate.stages))
      : (templateType === 'VISA' ? MASTER_VISA_STAGES_POOL : MASTER_HOLIDAY_STAGES_POOL)
          .slice(0, 5)
          .map((p, idx) => ({
            id: p.poolId.replace('POOL_', 'STAGE_'),
            poolId: p.poolId,
            stepNumber: idx + 1,
            title: p.defaultTitle,
            shortTitle: p.defaultShortTitle,
            subtitle: p.defaultSubtitle,
            colorBadge: p.colorBadge,
            badgeBorder: p.badgeBorder,
            headerBg: p.headerBg,
            nextStage: null,
            nextButtonText: p.nextButtonText || '→ Next Stage',
            checklist: (p.checklistPool || []).slice(0, 6).map((c) => ({ ...c })),
            requiredDocuments: [...(p.requiredDocumentsPool || [])],
            milestonePaymentPercent: p.milestonePaymentPercent || 0,
          }))

    setEditingTemplate({
      id: null,
      type: templateType,
      category: defaultCat?.id || (templateType === 'VISA' ? 'STUDENT_VISA' : 'INTERNATIONAL_LUXURY'),
      categoryName: defaultCat?.name || (templateType === 'VISA' ? 'Student Visa / Study Permit' : 'International Luxury Tour'),
      name: `New ${templateType === 'VISA' ? 'Visa' : 'Holiday'} Workflow Template`,
      description: `Category-specific workflow template configured from the ${templateType === 'VISA' ? '13' : '11'} Master Stages pool.`,
      isDefault: false,
      estimatedDays: defaultCat?.defaultDays || '20-30 Days',
      defaultFee: defaultCat?.defaultFee || 35000,
      stages: initialStages,
    })
    setIsEditorModalOpen(true)
  }

  const handleOpenEditTemplate = (template) => {
    setEditingTemplate(JSON.parse(JSON.stringify(template)))
    setIsEditorModalOpen(true)
  }

  const handleDuplicateTemplate = (template) => {
    masterWorkflowTemplatesService.duplicateTemplate(template.id)
    reloadTemplates()
  }

  const handleDeleteTemplate = (template) => {
    masterWorkflowTemplatesService.deleteTemplate(template.id)
    setDeleteConfirmTarget(null)
    reloadTemplates()
  }

  const handleResetDefaults = () => {
    if (window.confirm('Reset all workflow templates to industry standard defaults? This will restore initial templates.')) {
      masterWorkflowTemplatesService.resetToDefaults()
      reloadTemplates()
    }
  }

  const handleOpenPreview = (template) => {
    setPreviewTemplate(template)
    setIsLivePreviewModalOpen(true)
  }

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP HEADER & WORKFLOW TYPE TOGGLE                          */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>⚙️</span>
                <span>11.3 Master Stage & Workflow Config</span>
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-[10px]">
                Auto-Inherited by Leads & Cases
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              Configure master pipeline stage templates by category. When a lead is converted into a case, or when creating a new application, its stages, required checklist items, and documents automatically inherit from here.
            </p>
          </div>

          {/* Action Buttons: Add Template + Reset */}
          <div className="flex items-center gap-2 self-start lg:self-auto flex-wrap">
            {isAdmin && (
              <button
                type="button"
                onClick={handleOpenAddTemplate}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#0F0E2B] to-[#2E2B6E] hover:from-[#181445] hover:to-[#221F56] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>+</span>
                <span>Create Workflow Template</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1"
              title="Reset to industry standard defaults"
            >
              <span>↺</span>
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>

        {/* Workflow Type Switcher Tabs (Visa vs Holiday) */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100/80 p-1">
            <button
              type="button"
              onClick={() => {
                setTemplateType('VISA')
                setSelectedCategoryFilter('ALL')
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                templateType === 'VISA'
                  ? 'bg-[#181445] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <span>🛂 Visa Workflow Templates</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                templateType === 'VISA' ? 'bg-[#E11D2E] text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {templates.filter((t) => t.type === 'VISA').length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setTemplateType('HOLIDAY')
                setSelectedCategoryFilter('ALL')
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                templateType === 'HOLIDAY'
                  ? 'bg-[#181445] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <span>🌴 Holiday / Tour Workflows</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                templateType === 'HOLIDAY' ? 'bg-[#E11D2E] text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {templates.filter((t) => t.type === 'HOLIDAY').length}
              </span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[220px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search template, category, stage..."
              className="w-full pl-7 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600"
            />
            <svg
              className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills Bar */}
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
          <span className="font-bold text-slate-400 shrink-0 mr-1">Categories:</span>
          <button
            type="button"
            onClick={() => setSelectedCategoryFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer shrink-0 ${
              selectedCategoryFilter === 'ALL'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Categories ({templates.filter((t) => t.type === templateType).length})
          </button>
          {availableCategories.map((cat) => {
            const count = templates.filter((t) => t.type === templateType && t.category === cat.id).length
            const isSelected = selectedCategoryFilter === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategoryFilter(cat.id)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-indigo-600 text-white font-bold shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[9px] ${
                  isSelected ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. TEMPLATES CARDS GRID                                       */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 gap-4">
        {filteredTemplates.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 space-y-2">
            <p className="text-2xl">📋</p>
            <p className="font-bold text-slate-700 text-sm">No workflow templates found</p>
            <p className="text-xs text-slate-500">
              No templates match your category filter or search query. Click &quot;+ Create Workflow Template&quot; to build one.
            </p>
          </div>
        ) : (
          filteredTemplates.map((template) => {
            const totalStages = template.stages?.length || 0
            const totalChecklist = (template.stages || []).reduce(
              (acc, s) => acc + (s.checklist?.length || 0),
              0
            )
            const mandatoryChecklist = (template.stages || []).reduce(
              (acc, s) => acc + (s.checklist?.filter((c) => c.mandatory)?.length || 0),
              0
            )
            const totalDocuments = (template.stages || []).reduce(
              (acc, s) => acc + (s.requiredDocuments?.length || 0),
              0
            )

            return (
              <div
                key={template.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all p-4 sm:p-5 space-y-4 group"
              >
                {/* Template Top Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-[10px] uppercase">
                        {template.categoryName || template.category}
                      </span>
                      {template.isDefault && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-700 font-bold text-[10px] flex items-center gap-1">
                          <span>★</span> Default for Category
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-slate-400">
                        ID: {template.id}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                      {template.name}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
                      {template.description}
                    </p>
                  </div>

                  {/* Top Action Buttons */}
                  <div className="flex items-center gap-1.5 shrink-0 self-start">
                    <button
                      type="button"
                      onClick={() => handleOpenPreview(template)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1"
                      title="Preview Kanban pipeline"
                    >
                      <span>👁</span>
                      <span>Preview</span>
                    </button>

                    {isAdmin && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleOpenEditTemplate(template)}
                          className="px-2.5 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <span>✏</span>
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDuplicateTemplate(template)}
                          className="px-2 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs transition-colors cursor-pointer"
                          title="Duplicate template"
                        >
                          <span>📋</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteConfirmTarget(template)}
                          className="px-2 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 font-bold text-xs transition-colors cursor-pointer"
                          title="Delete template"
                        >
                          <span>🗑</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Key Metrics Summary Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Processing SLA</span>
                    <span className="font-bold text-slate-800 text-xs mt-0.5 block flex items-center gap-1">
                      <span>⏱</span> {template.estimatedDays || '15-20 Days'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Default Base Fee</span>
                    <span className="font-black text-emerald-700 text-xs mt-0.5 block">
                      {formatINR(template.defaultFee)}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Pipeline Stages</span>
                    <span className="font-bold text-slate-800 text-xs mt-0.5 block flex items-center gap-1">
                      <span>🪜</span> {totalStages} Stages Configured
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Checklist & Docs</span>
                    <span className="font-bold text-slate-800 text-xs mt-0.5 block flex items-center gap-1">
                      <span>📋</span> {totalChecklist} checks ({mandatoryChecklist} req.) • {totalDocuments} docs
                    </span>
                  </div>
                </div>

                {/* Visual Stage Stepper Pipeline Journey */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase text-slate-600 tracking-wider">
                      Stage Workflow Sequence & Requirements:
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Step-by-step progress & mandatory check counts
                    </span>
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto py-1">
                    {(template.stages || []).map((stage, sIdx) => {
                      const stageChecks = stage.checklist?.length || 0
                      const mandatoryChecks = stage.checklist?.filter((c) => c.mandatory)?.length || 0
                      const docsCount = stage.requiredDocuments?.length || 0

                      return (
                        <React.Fragment key={stage.id || sIdx}>
                          <div className="flex-1 min-w-[150px] p-2.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1.5 shrink-0 group-hover:border-slate-300 transition-all">
                            <div className="flex items-center justify-between">
                              <span className={`w-4 h-4 rounded text-[9px] flex items-center justify-center font-bold ${stage.colorBadge || 'bg-slate-700 text-white'}`}>
                                {stage.stepNumber || sIdx + 1}
                              </span>
                              <span className="text-[9px] font-bold text-slate-400 uppercase">
                                {stage.milestonePaymentPercent ? `${stage.milestonePaymentPercent}% Paid` : ''}
                              </span>
                            </div>

                            <div>
                              <p className="font-bold text-slate-900 text-xs truncate leading-snug">
                                {stage.shortTitle || stage.title}
                              </p>
                              <p className="text-[10px] text-slate-400 truncate">
                                {stage.subtitle || 'Stage details'}
                              </p>
                            </div>

                            <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[10px]">
                              <span className="font-semibold text-slate-600">
                                📋 {stageChecks} ({mandatoryChecks} req.)
                              </span>
                              {docsCount > 0 && (
                                <span className="font-semibold text-indigo-600">
                                  📑 {docsCount}
                                </span>
                              )}
                            </div>
                          </div>

                          {sIdx < (template.stages?.length || 0) - 1 && (
                            <span className="text-slate-300 font-bold shrink-0 text-sm">
                              &rarr;
                            </span>
                          )}
                        </React.Fragment>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. MODAL: LIVE PIPELINE PREVIEW                               */}
      {/* ------------------------------------------------------------- */}
      {isLivePreviewModalOpen && previewTemplate && (
        <Modal
          isOpen={isLivePreviewModalOpen}
          onClose={() => setIsLivePreviewModalOpen(false)}
          title={`Pipeline Preview: ${previewTemplate.name}`}
          size="xl"
        >
          <div className="space-y-4 text-xs font-sans">
            <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase text-indigo-700 tracking-wider">
                  Category: {previewTemplate.categoryName} ({previewTemplate.type})
                </span>
                <span className="font-mono font-bold text-xs text-indigo-800">
                  Estimated SLA: {previewTemplate.estimatedDays} • Base Fee: {formatINR(previewTemplate.defaultFee)}
                </span>
              </div>
              <p className="text-xs text-indigo-800/80">
                This is how the Kanban columns and side-sheet checklists will look when cases with this category are active in CRM.
              </p>
            </div>

            {/* Kanban Columns Horizontal Mock */}
            <div className="flex gap-3 overflow-x-auto pb-4">
              {previewTemplate.stages?.map((stage, idx) => (
                <div
                  key={stage.id || idx}
                  className="w-[260px] shrink-0 bg-slate-50 rounded-xl border border-slate-200 flex flex-col max-h-[480px]"
                >
                  {/* Column Header */}
                  <div className={`p-3 rounded-t-xl border-b ${stage.headerBg || 'bg-slate-100 text-slate-900 border-slate-200'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-4 h-4 rounded text-[9px] flex items-center justify-center font-bold ${stage.colorBadge || 'bg-slate-800 text-white'}`}>
                          {stage.stepNumber}
                        </span>
                        <span className="font-bold text-xs truncate">
                          {stage.shortTitle}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-white/70">
                        1 Case
                      </span>
                    </div>
                    <p className="text-[10px] opacity-80 leading-tight">
                      {stage.subtitle}
                    </p>
                  </div>

                  {/* Stage Checklist & Docs Requirements preview */}
                  <div className="p-3 space-y-3 overflow-y-auto flex-1">
                    {/* Simulated Stage Card */}
                    <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-[10px] text-slate-500">
                          {previewTemplate.type === 'VISA' ? 'VISA-SAMPLE' : 'PKG-SAMPLE'}
                        </span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          In Progress
                        </span>
                      </div>
                      <p className="font-bold text-slate-900 text-xs">Sample Applicant / Traveler</p>
                      <p className="text-[10px] text-slate-500">
                        {previewTemplate.categoryName}
                      </p>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                        <span className="font-semibold text-emerald-700">
                          {formatINR(previewTemplate.defaultFee)}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold">
                          Side Sheet & Details
                        </span>
                      </div>
                    </div>

                    {/* Requirements Box */}
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-2 text-[11px]">
                      <span className="text-[10px] font-black uppercase text-slate-500 block">
                        Mandatory Stage Checklists ({stage.checklist?.length || 0}):
                      </span>
                      <div className="space-y-1.5">
                        {stage.checklist?.map((chk) => (
                          <div key={chk.id} className="flex items-start gap-1.5 text-slate-700">
                            <span className="text-emerald-600 font-bold">✓</span>
                            <span className="flex-1 leading-snug">{chk.label}</span>
                            <span className={`text-[8px] uppercase font-bold px-1 py-0.2 rounded ${
                              chk.mandatory ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {chk.mandatory ? 'Req' : 'Opt'}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Required Documents */}
                      {stage.requiredDocuments && stage.requiredDocuments.length > 0 && (
                        <div className="pt-2 border-t border-slate-100 space-y-1">
                          <span className="text-[10px] font-black uppercase text-slate-500 block">
                            Required Documents:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {stage.requiredDocuments.map((doc, dIdx) => (
                              <span key={dIdx} className="px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 font-medium text-[9px] border border-indigo-200">
                                📑 {doc}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsLivePreviewModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. MODAL: MASTER TEMPLATE & STAGE BUILDER                     */}
      {/* ------------------------------------------------------------- */}
      {isEditorModalOpen && editingTemplate && (
        <TemplateEditorModal
          isOpen={isEditorModalOpen}
          template={editingTemplate}
          onClose={() => setIsEditorModalOpen(false)}
          onSave={(saved) => {
            masterWorkflowTemplatesService.upsertTemplate(saved)
            setIsEditorModalOpen(false)
            reloadTemplates()
          }}
        />
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. MODAL: DELETE CONFIRMATION                                 */}
      {/* ------------------------------------------------------------- */}
      {deleteConfirmTarget && (
        <Modal
          isOpen={Boolean(deleteConfirmTarget)}
          onClose={() => setDeleteConfirmTarget(null)}
          title="Confirm Delete Template"
          size="sm"
        >
          <div className="space-y-4 text-xs font-sans">
            <p className="text-slate-600">
              Are you sure you want to delete <strong className="text-slate-900">{deleteConfirmTarget.name}</strong>?
              Cases already using this template will retain their assigned stages, but future cases will no longer be able to select it.
            </p>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteConfirmTarget(null)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteTemplate(deleteConfirmTarget)}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
              >
                Delete Template
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

/**
 * ============================================================================
 * [SECTION 6: TEMPLATE BUILDER & STAGE EDITOR MODAL]
 * ============================================================================
 * Allows editing template metadata (name, category, defaultFee, SLA) and
 * deep customization of each stage (checklist items, mandatory switches,
 * required document tags, sequence ordering).
 */
const TemplateEditorModal = ({ isOpen, template, onClose, onSave }) => {
  const [formData, setFormData] = useState(() => JSON.parse(JSON.stringify(template)))
  const [editorMode, setEditorMode] = useState('STAGES') // 'STAGES' | 'CHECKLISTS' | 'PREVIEW'
  const [activeStageIdx, setActiveStageIdx] = useState(0)

  // Filters for Mode 1 (Stages selection)
  const [stageSearchQuery, setStageSearchQuery] = useState('')
  const [stageFilterType, setStageFilterType] = useState('ALL') // 'ALL' | 'SELECTED' | 'AVAILABLE'

  // Input states for Mode 2 (Custom additions)
  const [customDocInput, setCustomDocInput] = useState('')
  const [customChecklistInput, setCustomChecklistInput] = useState('')

  const categories = formData.type === 'VISA' ? VISA_CATEGORIES : HOLIDAY_CATEGORIES

  // Master Pool for active type (13 stages for Visa, 11 for Holiday)
  const masterPool = useMemo(() => {
    return formData.type === 'VISA' ? MASTER_VISA_STAGES_POOL : MASTER_HOLIDAY_STAGES_POOL
  }, [formData.type])

  // Count summaries
  const totalPoolStages = masterPool.length
  const selectedStagesCount = formData.stages?.length || 0
  const totalChecklistsCount = (formData.stages || []).reduce(
    (acc, s) => acc + (s.checklist?.length || 0),
    0
  )
  const totalMandatoryCount = (formData.stages || []).reduce(
    (acc, s) => acc + (s.checklist?.filter((c) => c.mandatory)?.length || 0),
    0
  )

  // --------------------------------------------------------------------------
  // STAGE POOL SELECTION HELPERS
  // --------------------------------------------------------------------------
  const getStageFromTemplate = (poolStage) => {
    return (formData.stages || []).find(
      (s) =>
        s.poolId === poolStage.poolId ||
        s.id === poolStage.poolId ||
        s.id === poolStage.poolId.replace('POOL_', 'STAGE_') ||
        s.title === poolStage.defaultTitle
    )
  }

  const handleToggleStageInclusion = (poolStage) => {
    const existingIndex = (formData.stages || []).findIndex(
      (s) =>
        s.poolId === poolStage.poolId ||
        s.id === poolStage.poolId ||
        s.id === poolStage.poolId.replace('POOL_', 'STAGE_') ||
        s.title === poolStage.defaultTitle
    )

    if (existingIndex >= 0) {
      if (formData.stages.length <= 1) {
        alert('A workflow template must have at least 1 active stage!')
        return
      }
      const updated = formData.stages
        .filter((_, idx) => idx !== existingIndex)
        .map((s, idx) => ({ ...s, stepNumber: idx + 1 }))

      setFormData({ ...formData, stages: updated })
      if (activeStageIdx >= updated.length) {
        setActiveStageIdx(Math.max(0, updated.length - 1))
      }
    } else {
      // By default select 6 items or mandatory items from the checklist pool
      const defaultChecklist = (poolStage.checklistPool || []).slice(0, 6).map((item) => ({
        id: item.id || `chk_${Date.now()}_${Math.random()}`,
        label: item.label,
        mandatory: Boolean(item.mandatory),
      }))

      const nextStepNum = (formData.stages?.length || 0) + 1
      const newStage = {
        id: poolStage.poolId.replace('POOL_', 'STAGE_'),
        poolId: poolStage.poolId,
        stepNumber: nextStepNum,
        title: poolStage.defaultTitle,
        shortTitle: poolStage.defaultShortTitle,
        subtitle: poolStage.defaultSubtitle,
        colorBadge: poolStage.colorBadge,
        badgeBorder: poolStage.badgeBorder,
        headerBg: poolStage.headerBg,
        nextStage: null,
        nextButtonText: poolStage.nextButtonText || '→ Next Stage',
        checklist: defaultChecklist,
        requiredDocuments: [...(poolStage.requiredDocumentsPool || [])],
        milestonePaymentPercent: poolStage.milestonePaymentPercent || 0,
      }

      const updated = [...(formData.stages || []), newStage]
      setFormData({ ...formData, stages: updated })
    }
  }

  const handleMoveStage = (index, direction) => {
    const targetIdx = index + direction
    if (targetIdx < 0 || targetIdx >= formData.stages.length) return

    const copy = [...formData.stages]
    const temp = copy[index]
    copy[index] = copy[targetIdx]
    copy[targetIdx] = temp

    const reindexed = copy.map((s, idx) => ({ ...s, stepNumber: idx + 1 }))
    setFormData({ ...formData, stages: reindexed })
    if (activeStageIdx === index) setActiveStageIdx(targetIdx)
    else if (activeStageIdx === targetIdx) setActiveStageIdx(index)
  }

  const handleDeleteStage = (index) => {
    if (formData.stages.length <= 1) {
      alert('A workflow template must have at least 1 active stage!')
      return
    }
    const updated = formData.stages
      .filter((_, idx) => idx !== index)
      .map((s, idx) => ({ ...s, stepNumber: idx + 1 }))

    setFormData({ ...formData, stages: updated })
    setActiveStageIdx(Math.max(0, index - 1))
  }

  const handleAddCustomStage = () => {
    const nextStep = (formData.stages?.length || 0) + 1
    const newStage = {
      id: `STAGE_${Date.now()}`,
      poolId: null,
      stepNumber: nextStep,
      title: `Stage ${nextStep}: Custom Stage`,
      shortTitle: `Custom Stage ${nextStep}`,
      subtitle: 'Custom stage requirements and verification tasks',
      colorBadge: 'bg-indigo-600 text-white',
      badgeBorder: 'border-indigo-400 text-indigo-700 bg-indigo-50/90',
      headerBg: 'bg-indigo-500/10 text-indigo-900 border-indigo-300',
      nextStage: null,
      nextButtonText: '→ Next Stage',
      checklist: [
        { id: `chk_${Date.now()}_1`, label: 'Primary stage verification task completed', mandatory: true },
      ],
      requiredDocuments: [],
      milestonePaymentPercent: 0,
    }
    const updated = [...(formData.stages || []), newStage]
    setFormData({ ...formData, stages: updated })
    setActiveStageIdx(updated.length - 1)
  }

  const handleSelectAllPoolStages = () => {
    const existingPoolIds = new Set(formData.stages.map((s) => s.poolId || s.id))
    const stagesToAdd = masterPool
      .filter((p) => !existingPoolIds.has(p.poolId))
      .map((p, idx) => ({
        id: p.poolId.replace('POOL_', 'STAGE_'),
        poolId: p.poolId,
        stepNumber: (formData.stages?.length || 0) + idx + 1,
        title: p.defaultTitle,
        shortTitle: p.defaultShortTitle,
        subtitle: p.defaultSubtitle,
        colorBadge: p.colorBadge,
        badgeBorder: p.badgeBorder,
        headerBg: p.headerBg,
        nextStage: null,
        nextButtonText: p.nextButtonText || '→ Next Stage',
        checklist: (p.checklistPool || []).slice(0, 6).map((c) => ({ ...c })),
        requiredDocuments: [...(p.requiredDocumentsPool || [])],
        milestonePaymentPercent: p.milestonePaymentPercent || 0,
      }))

    const updated = [...(formData.stages || []), ...stagesToAdd].map((s, idx) => ({
      ...s,
      stepNumber: idx + 1,
    }))
    setFormData({ ...formData, stages: updated })
  }

  const handleSelectCorePoolStages = () => {
    const coreStages = masterPool.slice(0, 5).map((p, idx) => ({
      id: p.poolId.replace('POOL_', 'STAGE_'),
      poolId: p.poolId,
      stepNumber: idx + 1,
      title: p.defaultTitle,
      shortTitle: p.defaultShortTitle,
      subtitle: p.defaultSubtitle,
      colorBadge: p.colorBadge,
      badgeBorder: p.badgeBorder,
      headerBg: p.headerBg,
      nextStage: null,
      nextButtonText: p.nextButtonText || '→ Next Stage',
      checklist: (p.checklistPool || []).slice(0, 6).map((c) => ({ ...c })),
      requiredDocuments: [...(p.requiredDocumentsPool || [])],
      milestonePaymentPercent: p.milestonePaymentPercent || 0,
    }))
    setFormData({ ...formData, stages: coreStages })
    setActiveStageIdx(0)
  }

  const handleApplyCategoryDefaults = (targetCategory = formData.category) => {
    const defaultTpl = DEFAULT_WORKFLOW_TEMPLATES.find(
      (t) => t.type === formData.type && t.category === targetCategory
    )
    if (defaultTpl) {
      setFormData({
        ...formData,
        stages: JSON.parse(JSON.stringify(defaultTpl.stages)),
        defaultFee: defaultTpl.defaultFee || formData.defaultFee,
        estimatedDays: defaultTpl.estimatedDays || formData.estimatedDays,
        description: defaultTpl.description || formData.description,
      })
      setActiveStageIdx(0)
    } else {
      handleSelectCorePoolStages()
    }
  }

  // --------------------------------------------------------------------------
  // ACTIVE STAGE & CHECKLIST HELPERS
  // --------------------------------------------------------------------------
  const activeStage = formData.stages[activeStageIdx] || formData.stages[0]

  const activePoolStage = useMemo(() => {
    if (!activeStage) return null
    return (
      masterPool.find(
        (p) =>
          p.poolId === activeStage.poolId ||
          p.defaultShortTitle?.toLowerCase() === activeStage.shortTitle?.toLowerCase() ||
          p.defaultTitle?.toLowerCase() === activeStage.title?.toLowerCase()
      ) || null
    )
  }, [activeStage, masterPool])

  const updateActiveStage = (updates) => {
    const updatedStages = [...formData.stages]
    updatedStages[activeStageIdx] = {
      ...updatedStages[activeStageIdx],
      ...updates,
    }
    setFormData({ ...formData, stages: updatedStages })
  }

  const isChecklistItemActive = (poolItem) => {
    if (!activeStage || !activeStage.checklist) return false
    return activeStage.checklist.some(
      (c) => c.id === poolItem.id || c.label.toLowerCase().trim() === poolItem.label.toLowerCase().trim()
    )
  }

  const getActiveChecklistItem = (poolItem) => {
    if (!activeStage || !activeStage.checklist) return null
    return (
      activeStage.checklist.find(
        (c) => c.id === poolItem.id || c.label.toLowerCase().trim() === poolItem.label.toLowerCase().trim()
      ) || null
    )
  }

  const handleToggleChecklistPoolItem = (poolItem) => {
    const currentList = activeStage.checklist || []
    const exists = currentList.find(
      (c) => c.id === poolItem.id || c.label.toLowerCase().trim() === poolItem.label.toLowerCase().trim()
    )

    let updated
    if (exists) {
      updated = currentList.filter(
        (c) => c.id !== poolItem.id && c.label.toLowerCase().trim() !== poolItem.label.toLowerCase().trim()
      )
    } else {
      updated = [
        ...currentList,
        {
          id: poolItem.id,
          label: poolItem.label,
          mandatory: Boolean(poolItem.mandatory),
        },
      ]
    }
    updateActiveStage({ checklist: updated })
  }

  const handleToggleMandatoryStatus = (poolItem) => {
    const currentList = activeStage.checklist || []
    const exists = currentList.find(
      (c) => c.id === poolItem.id || c.label.toLowerCase().trim() === poolItem.label.toLowerCase().trim()
    )

    let updated
    if (exists) {
      updated = currentList.map((c) => {
        if (c.id === exists.id) {
          return { ...c, mandatory: !c.mandatory }
        }
        return c
      })
    } else {
      updated = [
        ...currentList,
        {
          id: poolItem.id,
          label: poolItem.label,
          mandatory: true,
        },
      ]
    }
    updateActiveStage({ checklist: updated })
  }

  const handleUpdateChecklistLabel = (itemId, newLabel) => {
    const currentList = activeStage.checklist || []
    const updated = currentList.map((c) => {
      if (c.id === itemId) return { ...c, label: newLabel }
      return c
    })
    updateActiveStage({ checklist: updated })
  }

  const handleSelectAllPoolChecklists = () => {
    if (!activePoolStage) return
    const allItems = (activePoolStage.checklistPool || []).map((item) => ({
      id: item.id,
      label: item.label,
      mandatory: Boolean(item.mandatory),
    }))
    updateActiveStage({ checklist: allItems })
  }

  const handleSelectMandatoryOnlyChecklists = () => {
    if (!activePoolStage) return
    const mandatoryItems = (activePoolStage.checklistPool || [])
      .filter((item) => item.mandatory)
      .map((item) => ({
        id: item.id,
        label: item.label,
        mandatory: true,
      }))
    updateActiveStage({ checklist: mandatoryItems })
  }

  const handleClearChecklists = () => {
    updateActiveStage({ checklist: [] })
  }

  const handleAddCustomChecklistItem = () => {
    if (!customChecklistInput.trim()) return
    const currentList = activeStage.checklist || []
    const newItem = {
      id: `chk_cust_${Date.now()}`,
      label: customChecklistInput.trim(),
      mandatory: true,
    }
    updateActiveStage({ checklist: [...currentList, newItem] })
    setCustomChecklistInput('')
  }

  const handleDeleteChecklistItem = (itemId) => {
    const currentList = activeStage.checklist || []
    const filtered = currentList.filter((c) => c.id !== itemId)
    updateActiveStage({ checklist: filtered })
  }

  // Documents manipulation
  const handleTogglePoolDocument = (docName) => {
    const currentDocs = activeStage.requiredDocuments || []
    let updated
    if (currentDocs.includes(docName)) {
      updated = currentDocs.filter((d) => d !== docName)
    } else {
      updated = [...currentDocs, docName]
    }
    updateActiveStage({ requiredDocuments: updated })
  }

  const handleAddCustomDoc = () => {
    if (!customDocInput.trim()) return
    const currentDocs = activeStage.requiredDocuments || []
    if (!currentDocs.includes(customDocInput.trim())) {
      updateActiveStage({ requiredDocuments: [...currentDocs, customDocInput.trim()] })
    }
    setCustomDocInput('')
  }

  const handleDeleteDoc = (docToRemove) => {
    const currentDocs = activeStage.requiredDocuments || []
    updateActiveStage({ requiredDocuments: currentDocs.filter((d) => d !== docToRemove) })
  }

  // Filtered pool stages for Mode 1
  const filteredPoolStages = useMemo(() => {
    return masterPool.filter((poolStage) => {
      const stageInTpl = getStageFromTemplate(poolStage)
      const isSelected = Boolean(stageInTpl)

      if (stageFilterType === 'SELECTED' && !isSelected) return false
      if (stageFilterType === 'AVAILABLE' && isSelected) return false

      const q = stageSearchQuery.toLowerCase().trim()
      if (!q) return true

      return (
        poolStage.defaultTitle.toLowerCase().includes(q) ||
        poolStage.defaultShortTitle.toLowerCase().includes(q) ||
        poolStage.defaultSubtitle?.toLowerCase().includes(q) ||
        (poolStage.checklistPool &&
          poolStage.checklistPool.some((c) => c.label.toLowerCase().includes(q)))
      )
    })
  }, [masterPool, formData.stages, stageFilterType, stageSearchQuery])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.stages || formData.stages.length === 0) {
      alert('Template must have at least one stage!')
      return
    }
    onSave(formData)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Configure Workflow: ${formData.name}`}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
        {/* ------------------------------------------------------------- */}
        {/* TOP: TEMPLATE OVERVIEW & CATEGORY MAPPING                     */}
        {/* ------------------------------------------------------------- */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <span>⚙️</span> Category Workflow Template Settings
            </h4>
            <button
              type="button"
              onClick={() => handleApplyCategoryDefaults()}
              className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-[11px] hover:bg-indigo-100 cursor-pointer flex items-center gap-1"
              title="Reset stages to recommended category baseline"
            >
              <span>⚡</span>
              <span>Apply Recommended Stages for {formData.categoryName}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                Workflow Template Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-bold text-slate-900"
                placeholder="e.g. Student Visa Master Workflow"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                Category Mapping *
              </label>
              <select
                value={formData.category}
                onChange={(e) => {
                  const sel = categories.find((c) => c.id === e.target.value)
                  const updatedCat = e.target.value
                  const updatedName = sel?.name || e.target.value
                  setFormData({
                    ...formData,
                    category: updatedCat,
                    categoryName: updatedName,
                    estimatedDays: sel?.defaultDays || formData.estimatedDays,
                    defaultFee: sel?.defaultFee || formData.defaultFee,
                  })
                }}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-bold"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                Target SLA / Estimated Turnaround
              </label>
              <input
                type="text"
                value={formData.estimatedDays}
                onChange={(e) => setFormData({ ...formData, estimatedDays: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                placeholder="e.g. 25-35 Days"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                Default Base Package Fee (₹)
              </label>
              <input
                type="number"
                value={formData.defaultFee}
                onChange={(e) => setFormData({ ...formData, defaultFee: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-bold text-emerald-700"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                Workflow Description & Purpose
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700"
                placeholder="Description of category application workflow and consular compliance checks"
              />
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SUB-NAVIGATION MODE TABS                                      */}
        {/* ------------------------------------------------------------- */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 flex-wrap gap-2">
          <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setEditorMode('STAGES')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                editorMode === 'STAGES'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🪜 1. Select Stages from Master Pool</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  editorMode === 'STAGES'
                    ? 'bg-indigo-800 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {selectedStagesCount} / {totalPoolStages} Selected
              </span>
            </button>

            <button
              type="button"
              onClick={() => setEditorMode('CHECKLISTS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                editorMode === 'CHECKLISTS'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>📋 2. Select Inside Details & Checklists</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  editorMode === 'CHECKLISTS'
                    ? 'bg-indigo-800 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {totalChecklistsCount} Checklists
              </span>
            </button>

            <button
              type="button"
              onClick={() => setEditorMode('PREVIEW')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                editorMode === 'PREVIEW'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>👁️</span>
              <span>Pipeline Preview</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
            <span>
              Active: <strong className="text-slate-900">{selectedStagesCount} Stages</strong>
            </span>
            <span>•</span>
            <span>
              <strong className="text-emerald-700">{totalChecklistsCount} Checklists</strong> ({totalMandatoryCount} Mandatory)
            </span>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* MODE 1: SELECT STAGES FROM MASTER POOL                        */}
        {/* ------------------------------------------------------------- */}
        {editorMode === 'STAGES' && (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="space-y-0.5">
                <span className="font-bold text-blue-900 text-xs block">
                  🪜 Select Specific Stages from the Master {formData.type === 'VISA' ? 'Visa (13 Stages)' : 'Holiday (11 Stages)'} Pool
                </span>
                <p className="text-[11px] text-blue-700 leading-snug">
                  Choose which stages apply to <strong>{formData.categoryName}</strong> (e.g. select only 5 or 7 stages out of {totalPoolStages}). Unselected stages will not appear in cases under this category.
                </p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handleSelectAllPoolStages}
                  className="px-2.5 py-1 rounded bg-white border border-blue-300 text-blue-800 font-bold text-[10px] hover:bg-blue-100 cursor-pointer"
                >
                  Select All ({totalPoolStages})
                </button>
                <button
                  type="button"
                  onClick={handleSelectCorePoolStages}
                  className="px-2.5 py-1 rounded bg-white border border-blue-300 text-blue-800 font-bold text-[10px] hover:bg-blue-100 cursor-pointer"
                >
                  Select Core (5)
                </button>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setStageFilterType('ALL')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                    stageFilterType === 'ALL'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All Master Stages ({totalPoolStages})
                </button>
                <button
                  type="button"
                  onClick={() => setStageFilterType('SELECTED')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                    stageFilterType === 'SELECTED'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Included ({selectedStagesCount})
                </button>
                <button
                  type="button"
                  onClick={() => setStageFilterType('AVAILABLE')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                    stageFilterType === 'AVAILABLE'
                      ? 'bg-slate-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Available / Excluded ({totalPoolStages - selectedStagesCount})
                </button>
              </div>

              <input
                type="text"
                value={stageSearchQuery}
                onChange={(e) => setStageSearchQuery(e.target.value)}
                placeholder="Search master stage pool..."
                className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-white w-52"
              />
            </div>

            {/* Master Stages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[460px] overflow-y-auto pr-1">
              {filteredPoolStages.map((poolStage) => {
                const stageInTemplate = getStageFromTemplate(poolStage)
                const isSelected = Boolean(stageInTemplate)
                const stageIdxInTemplate = isSelected
                  ? formData.stages.findIndex((s) => s.id === stageInTemplate.id)
                  : -1
                const activeChecksCount = stageInTemplate?.checklist?.length || 0
                const poolChecksCount = poolStage.checklistPool?.length || 10
                const poolDocsCount = poolStage.requiredDocumentsPool?.length || 0

                return (
                  <div
                    key={poolStage.poolId}
                    className={`p-3 rounded-xl border transition-all flex flex-col justify-between gap-2.5 ${
                      isSelected
                        ? 'border-indigo-500 bg-white shadow-2xs ring-1 ring-indigo-200'
                        : 'border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    {/* Card Header with Checkbox & Step Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleStageInclusion(poolStage)}
                          className="w-4 h-4 rounded text-indigo-600 border-slate-300 cursor-pointer"
                        />
                        <span className={`font-bold text-xs ${isSelected ? 'text-indigo-950 font-black' : 'text-slate-600'}`}>
                          {isSelected ? '✓ Included' : 'Include Stage'}
                        </span>
                      </label>

                      {isSelected ? (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black ${stageInTemplate.colorBadge || 'bg-indigo-600 text-white'}`}>
                          Step #{stageInTemplate.stepNumber}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-200 text-slate-600 uppercase">
                          Pool Item
                        </span>
                      )}
                    </div>

                    {/* Stage Title & Subtitle */}
                    <div className="space-y-1">
                      <h5 className="font-bold text-slate-900 text-xs leading-snug">
                        {poolStage.defaultTitle}
                      </h5>
                      <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">
                        {poolStage.defaultSubtitle}
                      </p>
                    </div>

                    {/* Pool Checklist & Docs Summary */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                      <span className={`font-semibold ${isSelected ? 'text-emerald-700' : 'text-slate-500'}`}>
                        📋 {isSelected ? `${activeChecksCount} / ${poolChecksCount} Selected` : `${poolChecksCount} Checklists Pool`}
                      </span>
                      {poolDocsCount > 0 && (
                        <span className="text-slate-500 font-medium">
                          📑 {poolDocsCount} Docs
                        </span>
                      )}
                    </div>

                    {/* Action Buttons on Card */}
                    {isSelected && (
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={stageIdxInTemplate <= 0}
                            onClick={() => handleMoveStage(stageIdxInTemplate, -1)}
                            className="px-1.5 py-0.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-20 text-[10px] font-bold cursor-pointer"
                            title="Move earlier in workflow"
                          >
                            ▲ Up
                          </button>
                          <button
                            type="button"
                            disabled={stageIdxInTemplate >= formData.stages.length - 1}
                            onClick={() => handleMoveStage(stageIdxInTemplate, 1)}
                            className="px-1.5 py-0.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-20 text-[10px] font-bold cursor-pointer"
                            title="Move later in workflow"
                          >
                            ▼ Down
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setActiveStageIdx(stageIdxInTemplate)
                            setEditorMode('CHECKLISTS')
                          }}
                          className="px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-[10px] hover:bg-indigo-100 cursor-pointer"
                        >
                          Select Details ({activeChecksCount}/{poolChecksCount}) →
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* MODE 2: SELECT CHECKLISTS & DETAILS INSIDE EACH STAGE         */}
        {/* ------------------------------------------------------------- */}
        {editorMode === 'CHECKLISTS' && (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="space-y-0.5">
                <span className="font-bold text-emerald-950 text-xs block">
                  📋 Select Specific Checklists & Requirements Inside Each Stage
                </span>
                <p className="text-[11px] text-emerald-800 leading-snug">
                  For each included stage, pick which check boxes to add (e.g. select 6 out of 10 checkboxes for Stage 1), toggle Mandatory vs. Optional, and specify required documents.
                </p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handleSelectAllPoolChecklists}
                  className="px-2.5 py-1 rounded bg-white border border-emerald-300 text-emerald-800 font-bold text-[10px] hover:bg-emerald-100 cursor-pointer"
                >
                  Select All 10
                </button>
                <button
                  type="button"
                  onClick={handleSelectMandatoryOnlyChecklists}
                  className="px-2.5 py-1 rounded bg-white border border-emerald-300 text-emerald-800 font-bold text-[10px] hover:bg-emerald-100 cursor-pointer"
                >
                  Mandatory Only
                </button>
                <button
                  type="button"
                  onClick={handleClearChecklists}
                  className="px-2.5 py-1 rounded bg-white border border-emerald-300 text-emerald-800 font-bold text-[10px] hover:bg-emerald-100 cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
              {/* Left Column: Selected Stages Sequence List (4 Cols) */}
              <div className="md:col-span-4 rounded-xl border border-slate-200 bg-white p-3 space-y-2.5 flex flex-col">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="font-bold text-slate-900 text-xs">
                    Template Stages ({formData.stages?.length || 0})
                  </span>
                  <button
                    type="button"
                    onClick={handleAddCustomStage}
                    className="px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-[10px] hover:bg-indigo-100 cursor-pointer"
                  >
                    + Custom Stage
                  </button>
                </div>

                {/* Stages Stack */}
                <div className="space-y-1.5 overflow-y-auto max-h-[440px] pr-1">
                  {formData.stages?.map((stage, idx) => {
                    const isActive = idx === activeStageIdx
                    const stagePool = masterPool.find(
                      (p) => p.poolId === stage.poolId || p.defaultTitle === stage.title
                    )
                    const totalItems = stagePool?.checklistPool?.length || 10
                    const activeCount = stage.checklist?.length || 0

                    return (
                      <div
                        key={stage.id || idx}
                        onClick={() => setActiveStageIdx(idx)}
                        className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                          isActive
                            ? 'border-indigo-600 bg-indigo-50/70 shadow-2xs font-bold ring-1 ring-indigo-300'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span
                            className={`w-5 h-5 rounded text-[10px] flex items-center justify-center font-bold shrink-0 ${
                              stage.colorBadge || 'bg-slate-700 text-white'
                            }`}
                          >
                            {stage.stepNumber || idx + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs text-slate-900 font-bold">
                              {stage.shortTitle || stage.title}
                            </p>
                            <p className="text-[10px] text-slate-500 font-normal">
                              {activeCount} of {totalItems} checklists
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveStage(idx, -1)}
                            className="w-4 h-4 rounded text-slate-400 hover:text-slate-800 disabled:opacity-20 cursor-pointer"
                            title="Move Up"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            disabled={idx === formData.stages.length - 1}
                            onClick={() => handleMoveStage(idx, 1)}
                            className="w-4 h-4 rounded text-slate-400 hover:text-slate-800 disabled:opacity-20 cursor-pointer"
                            title="Move Down"
                          >
                            ▼
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteStage(idx)}
                            className="w-4 h-4 rounded text-rose-400 hover:text-rose-700 cursor-pointer ml-0.5"
                            title="Delete Stage"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Right Column: Active Stage Checklist & Detail Configuration (8 Cols) */}
              <div className="md:col-span-8 rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 space-y-3.5">
                {activeStage ? (
                  <>
                    {/* Stage Header Info Bar */}
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-5 h-5 rounded text-[10px] flex items-center justify-center font-bold ${
                            activeStage.colorBadge || 'bg-slate-800 text-white'
                          }`}
                        >
                          {activeStage.stepNumber}
                        </span>
                        <h5 className="font-bold text-slate-900 text-xs">
                          Stage #{activeStage.stepNumber}: {activeStage.shortTitle}
                        </h5>
                      </div>

                      {/* Theme Selector */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-500 font-semibold">Theme:</span>
                        <select
                          value={STAGE_COLOR_OPTIONS.find((c) => c.badge === activeStage.colorBadge)?.id || 'indigo'}
                          onChange={(e) => {
                            const opt = STAGE_COLOR_OPTIONS.find((c) => c.id === e.target.value)
                            if (opt) {
                              updateActiveStage({
                                colorBadge: opt.badge,
                                badgeBorder: opt.border,
                                headerBg: opt.header,
                              })
                            }
                          }}
                          className="px-2 py-0.5 rounded border border-slate-200 bg-white text-[10px] font-bold cursor-pointer"
                        >
                          {STAGE_COLOR_OPTIONS.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Inputs for titles */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                          Full Stage Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={activeStage.title}
                          onChange={(e) => updateActiveStage({ title: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                          placeholder="e.g. Stage 1: Lead Intake & Counseling"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                          Short Title (Kanban Column) *
                        </label>
                        <input
                          type="text"
                          required
                          value={activeStage.shortTitle}
                          onChange={(e) => updateActiveStage({ shortTitle: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-bold"
                          placeholder="e.g. Intake & Counseling"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                          Subtitle / Brief Guidance
                        </label>
                        <input
                          type="text"
                          value={activeStage.subtitle || ''}
                          onChange={(e) => updateActiveStage({ subtitle: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600"
                          placeholder="e.g. Applicant evaluation and initial verification"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">
                          Advance Button Text
                        </label>
                        <input
                          type="text"
                          value={activeStage.nextButtonText || ''}
                          onChange={(e) => updateActiveStage({ nextButtonText: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                          placeholder="e.g. → Docs Verified"
                        />
                      </div>
                    </div>

                    {/* --------------------------------------------------- */}
                    {/* MASTER CHECKLIST POOL SELECTION BOX                 */}
                    {/* --------------------------------------------------- */}
                    <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-2.5">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div>
                          <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                            <span>📋</span>
                            <span>
                              Checklist Items for this Stage ({activeStage.checklist?.length || 0} of{' '}
                              {activePoolStage?.checklistPool?.length || 10} Selected)
                            </span>
                          </span>
                          <p className="text-[10px] text-slate-500">
                            Check the boxes you want included for this category. Items marked &quot;Mandatory&quot; must be checked before a case can advance.
                          </p>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={handleSelectAllPoolChecklists}
                            className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-[9px] hover:bg-emerald-100 cursor-pointer"
                          >
                            All ({activePoolStage?.checklistPool?.length || 10})
                          </button>
                          <button
                            type="button"
                            onClick={handleSelectMandatoryOnlyChecklists}
                            className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-800 font-bold text-[9px] hover:bg-blue-100 cursor-pointer"
                          >
                            Mandatory Only
                          </button>
                          <button
                            type="button"
                            onClick={handleClearChecklists}
                            className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold text-[9px] hover:bg-slate-200 cursor-pointer"
                          >
                            Clear
                          </button>
                        </div>
                      </div>

                      {/* Pool Checklists List */}
                      <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                        {activePoolStage?.checklistPool?.map((poolItem) => {
                          const isIncluded = isChecklistItemActive(poolItem)
                          const activeItem = getActiveChecklistItem(poolItem)
                          const isMandatory = activeItem ? activeItem.mandatory : poolItem.mandatory

                          return (
                            <div
                              key={poolItem.id}
                              className={`flex items-center gap-2 p-1.5 rounded-lg border transition-all ${
                                isIncluded
                                  ? 'bg-indigo-50/40 border-indigo-200 shadow-2xs'
                                  : 'bg-slate-50/60 border-slate-200 opacity-60 hover:opacity-100'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isIncluded}
                                onChange={() => handleToggleChecklistPoolItem(poolItem)}
                                className="w-4 h-4 rounded text-indigo-600 border-slate-300 cursor-pointer shrink-0"
                              />

                              <input
                                type="text"
                                value={activeItem ? activeItem.label : poolItem.label}
                                onChange={(e) => {
                                  if (isIncluded) {
                                    handleUpdateChecklistLabel(activeItem.id, e.target.value)
                                  }
                                }}
                                disabled={!isIncluded}
                                className={`flex-1 px-2 py-1 text-xs rounded border transition-colors ${
                                  isIncluded
                                    ? 'bg-white border-slate-200 text-slate-900 font-medium'
                                    : 'bg-slate-100 border-transparent text-slate-500'
                                }`}
                              />

                              {/* Mandatory vs Optional Switch */}
                              <button
                                type="button"
                                onClick={() => handleToggleMandatoryStatus(poolItem)}
                                className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider cursor-pointer transition-colors shrink-0 ${
                                  isMandatory
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : 'bg-slate-200 text-slate-600'
                                }`}
                                title={isMandatory ? 'Mandatory: blocks case from advancing stage until checked' : 'Optional task'}
                              >
                                {isMandatory ? '✓ Mandatory' : 'Optional'}
                              </button>
                            </div>
                          )
                        })}

                        {/* Any Custom (non-pool) checklist items */}
                        {activeStage.checklist
                          ?.filter((chk) => !activePoolStage?.checklistPool?.some((p) => p.id === chk.id))
                          .map((chk) => (
                            <div
                              key={chk.id}
                              className="flex items-center gap-2 p-1.5 rounded-lg border bg-amber-50/40 border-amber-200 shadow-2xs"
                            >
                              <span className="text-[10px] font-bold text-amber-700 uppercase px-1.5 py-0.5 rounded bg-amber-100">
                                Custom
                              </span>

                              <input
                                type="text"
                                value={chk.label}
                                onChange={(e) => handleUpdateChecklistLabel(chk.id, e.target.value)}
                                className="flex-1 px-2 py-1 text-xs rounded border bg-white border-slate-200"
                              />

                              <button
                                type="button"
                                onClick={() => {
                                  const updated = (activeStage.checklist || []).map((c) =>
                                    c.id === chk.id ? { ...c, mandatory: !c.mandatory } : c
                                  )
                                  updateActiveStage({ checklist: updated })
                                }}
                                className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider cursor-pointer ${
                                  chk.mandatory
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : 'bg-slate-200 text-slate-600'
                                }`}
                              >
                                {chk.mandatory ? '✓ Mandatory' : 'Optional'}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteChecklistItem(chk.id)}
                                className="text-slate-400 hover:text-rose-600 px-1 font-bold cursor-pointer"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                      </div>

                      {/* Add Custom Checklist Item Input */}
                      <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                        <input
                          type="text"
                          value={customChecklistInput}
                          onChange={(e) => setCustomChecklistInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              handleAddCustomChecklistItem()
                            }
                          }}
                          placeholder="Add custom checklist requirement for this category..."
                          className="flex-1 px-2 py-1 text-xs rounded border border-slate-200 bg-slate-50"
                        />
                        <button
                          type="button"
                          onClick={handleAddCustomChecklistItem}
                          className="px-2.5 py-1 rounded bg-slate-900 text-white font-bold text-[10px] hover:bg-slate-800 cursor-pointer shrink-0"
                        >
                          + Add Item
                        </button>
                      </div>
                    </div>

                    {/* --------------------------------------------------- */}
                    {/* REQUIRED DOCUMENTS POOL BUILDER                     */}
                    {/* --------------------------------------------------- */}
                    <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-xs block">
                          Required Documents for this Stage:
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Click chip to include / exclude
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5">
                        {/* Pool Docs */}
                        {activePoolStage?.requiredDocumentsPool?.map((doc, dIdx) => {
                          const isDocActive = (activeStage.requiredDocuments || []).includes(doc)
                          return (
                            <button
                              key={dIdx}
                              type="button"
                              onClick={() => handleTogglePoolDocument(doc)}
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold cursor-pointer transition-all ${
                                isDocActive
                                  ? 'bg-indigo-50 border border-indigo-300 text-indigo-700 font-bold'
                                  : 'bg-slate-100 border border-slate-200 text-slate-500 hover:bg-slate-200'
                              }`}
                            >
                              <span>{isDocActive ? '✓ 📑' : '+ 📑'}</span>
                              <span>{doc}</span>
                            </button>
                          )
                        })}

                        {/* Any custom docs not in pool */}
                        {(activeStage.requiredDocuments || [])
                          .filter((d) => !activePoolStage?.requiredDocumentsPool?.includes(d))
                          .map((doc, dIdx) => (
                            <span
                              key={`cust_${dIdx}`}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-semibold"
                            >
                              <span>📑 {doc}</span>
                              <button
                                type="button"
                                onClick={() => handleDeleteDoc(doc)}
                                className="text-amber-500 hover:text-amber-900 text-[9px] cursor-pointer"
                              >
                                ✕
                              </button>
                            </span>
                          ))}

                        {/* Custom Doc Add */}
                        <div className="inline-flex items-center gap-1">
                          <input
                            type="text"
                            value={customDocInput}
                            onChange={(e) => setCustomDocInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                handleAddCustomDoc()
                              }
                            }}
                            placeholder="Add doc name + Enter"
                            className="px-2 py-0.5 text-[10px] rounded border border-slate-200 bg-slate-50 w-36"
                          />
                          <button
                            type="button"
                            onClick={handleAddCustomDoc}
                            className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-[10px] font-bold text-slate-700 cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-12 text-center text-slate-400 font-medium">
                    Select a stage from the left list to edit details.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* MODE 3: LIVE PIPELINE PREVIEW                                */}
        {/* ------------------------------------------------------------- */}
        {editorMode === 'PREVIEW' && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-xs">
                👁️ Live Workflow Pipeline Preview for {formData.name}
              </span>
              <span className="text-[10px] text-slate-500">
                This shows the stages that will appear in Kanban boards and lead conversions
              </span>
            </div>

            <div className="flex items-start gap-3 overflow-x-auto py-2">
              {formData.stages?.map((stage, sIdx) => (
                <div
                  key={stage.id || sIdx}
                  className="w-64 p-3 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2 shrink-0"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`w-5 h-5 rounded text-[10px] flex items-center justify-center font-bold ${
                        stage.colorBadge || 'bg-indigo-600 text-white'
                      }`}
                    >
                      {stage.stepNumber || sIdx + 1}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      Step #{stage.stepNumber || sIdx + 1}
                    </span>
                  </div>

                  <div>
                    <h6 className="font-bold text-slate-900 text-xs truncate">
                      {stage.shortTitle || stage.title}
                    </h6>
                    <p className="text-[10px] text-slate-500 line-clamp-1">
                      {stage.subtitle}
                    </p>
                  </div>

                  <div className="p-2 rounded bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[9px] font-bold uppercase text-slate-500 block">
                      Checklist Items ({stage.checklist?.length || 0}):
                    </span>
                    <div className="space-y-1 max-h-24 overflow-y-auto">
                      {stage.checklist?.map((chk) => (
                        <div key={chk.id} className="text-[10px] text-slate-700 flex items-start gap-1">
                          <span className={chk.mandatory ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                            {chk.mandatory ? '✓' : '○'}
                          </span>
                          <span className="truncate flex-1">{chk.label}</span>
                          {chk.mandatory && (
                            <span className="text-[8px] px-1 py-0.2 rounded bg-emerald-50 text-emerald-700 font-bold shrink-0">
                              Req
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {stage.nextButtonText && (
                    <div className="pt-1 border-t border-slate-100 text-center">
                      <span className="text-[10px] font-bold text-indigo-600">
                        {stage.nextButtonText}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* BOTTOM ACTIONS & DEFAULT SWITCH                               */}
        {/* ------------------------------------------------------------- */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200 flex-wrap gap-2">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.isDefault}
              onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
              className="w-4 h-4 rounded text-indigo-600 border-slate-300 cursor-pointer"
            />
            <span className="text-xs font-bold text-slate-700">
              Set as Default Template for {formData.categoryName}
            </span>
          </label>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold cursor-pointer shadow-xs"
            >
              Save Workflow Template ({selectedStagesCount} Stages, {totalChecklistsCount} Checks)
            </button>
          </div>
        </div>
      </form>
    </Modal>
  )
}

export default MasterStageConfigTab

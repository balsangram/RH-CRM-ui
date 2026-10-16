import React from 'react'
import Button from '../../components/Button/Button.component'
import { formatCurrency } from '../../utils/helpers'

export const Reports = () => {
  const metrics = [
    {
      label: 'Visa Approval Rate',
      value: '94.2%',
      sub: '340 applications this quarter',
      trend: '+2.4%',
      trendUp: true,
    },
    {
      label: 'Avg. Application Cycle',
      value: '38',
      unit: 'Days',
      sub: 'Submission → embassy outcome',
      trend: '-3 days',
      trendUp: true,
    },
    {
      label: 'Customer Conversion',
      value: '28.4%',
      sub: 'Lead to retained client',
      trend: '+1.8%',
      trendUp: true,
    },
    {
      label: 'Quarterly Revenue',
      value: formatCurrency(184200),
      sub: 'Compared to last quarter',
      trend: '+21%',
      trendUp: true,
    },
  ]

  const countries = [
    { rank: 1, country: 'Canada', percent: 85, volume: '128 cases', color: 'bg-indigo-500' },
    { rank: 2, country: 'United Kingdom', percent: 72, volume: '94 cases', color: 'bg-emerald-500' },
    { rank: 3, country: 'Australia', percent: 64, volume: '81 cases', color: 'bg-sky-500' },
    { rank: 4, country: 'Schengen Area', percent: 58, volume: '67 cases', color: 'bg-amber-500' },
    { rank: 5, country: 'United States', percent: 49, volume: '52 cases', color: 'bg-violet-500' },
  ]

  const monthlyData = [
    { month: 'May', value: 42 },
    { month: 'Jun', value: 58 },
    { month: 'Jul', value: 51 },
    { month: 'Aug', value: 67 },
    { month: 'Sep', value: 73 },
    { month: 'Oct', value: 89 },
  ]
  const maxValue = Math.max(...monthlyData.map((d) => d.value))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Reports & Analytics
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Operational performance, processing velocity & revenue insights
          </p>
        </div>
        <Button variant="outline" size="sm">
          Export PDF Report
        </Button>
      </div>

      {/* KPI Cards - more compact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <div
            key={i}
            className="rounded-xl bg-white border border-slate-200/80 p-4 shadow-sm hover:shadow transition-shadow"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 leading-tight">
                {m.label}
              </p>
              <span
                className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap ${
                  m.trendUp
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-rose-50 text-rose-600'
                }`}
              >
                {m.trend}
              </span>
            </div>

            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-bold tracking-tight text-slate-900">
                {m.value}
              </span>
              {m.unit && (
                <span className="text-xs font-medium text-slate-500">{m.unit}</span>
              )}
            </div>

            <p className="text-[11px] text-slate-500 mt-1 leading-snug">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        {/* Country Performance */}
        <div className="xl:col-span-3 rounded-xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-900">
              Performance by Country
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Top destinations by volume and approval rate
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {countries.map((item) => (
              <div
                key={item.rank}
                className="px-5 py-3 flex items-center gap-4 hover:bg-slate-50/70 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[11px] font-bold text-slate-600 shrink-0">
                  {item.rank}
                </div>

                <div className="w-32 shrink-0">
                  <p className="text-sm font-medium text-slate-800">{item.country}</p>
                  <p className="text-[11px] text-slate-400">{item.volume}</p>
                </div>

                <div className="flex-1">
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>

                <div className="w-12 text-right shrink-0">
                  <span className="text-sm font-semibold text-slate-800 tabular-nums">
                    {item.percent}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Applications Bar Chart */}
        <div className="xl:col-span-2 rounded-xl bg-white border border-slate-200/80 shadow-sm p-5 flex flex-col">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Monthly Applications
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Last 6 months volume
            </p>
          </div>

          <div className="flex-1 flex items-end justify-between gap-2 min-h-[140px]">
            {monthlyData.map((item, idx) => {
              const heightPercent = (item.value / maxValue) * 100
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group">
                  <div className="relative w-full flex items-end justify-center h-28">
                    <div
                      className="w-full max-w-[28px] rounded-t-md bg-gradient-to-t from-indigo-600 to-indigo-400 transition-all duration-300 group-hover:from-indigo-500 group-hover:to-indigo-300"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-[11px] font-semibold text-slate-700">{item.value}</p>
                    <p className="text-[10px] text-slate-400">{item.month}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Bottom insight strip - compact */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-500">
            Fastest Destination
          </p>
          <p className="text-lg font-bold text-slate-900 mt-1">Canada</p>
          <p className="text-xs text-slate-500 mt-0.5">Avg. 22 days processing</p>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-500">
            Highest Conversion
          </p>
          <p className="text-lg font-bold text-slate-900 mt-1">United Kingdom</p>
          <p className="text-xs text-slate-500 mt-0.5">34.6% lead → client rate</p>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-amber-50 to-white border border-amber-100 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-500">
            Revenue Growth
          </p>
          <p className="text-lg font-bold text-slate-900 mt-1">+21%</p>
          <p className="text-xs text-slate-500 mt-0.5">vs previous quarter</p>
        </div>
      </div>
    </div>
  )
}

export default Reports
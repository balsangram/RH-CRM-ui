import React from 'react'
import KanbanColumn from './KanbanColumn.component'
import KanbanCard from './KanbanCard.component'

/**
 * Reusable KanbanBoard Component
 * 
 * @param {Array} columns - Array of column definitions: { id, title, subtitle, color, badgeBg, badgeText }
 * @param {Array} items - Flat array of data items
 * @param {Function} getItemColumnId - Function to get the column ID for an item: (item) => item.status
 * @param {Function} renderCard - Custom render function for card: (item, column) => ReactNode
 * @param {Function} onCardClick - Optional click callback: (item) => void
 * @param {string} emptyText - Message when a column has no items
 * @param {string} gridClassName - Optional custom grid layout classes
 */
export const KanbanBoard = ({
  columns = [],
  items = [],
  getItemColumnId = (item) => item.status || item.stage || item.columnId,
  renderCard,
  onCardClick,
  emptyText = 'No items in this stage',
  gridClassName,
}) => {
  // Default responsive grid columns depending on number of columns
  const defaultGridClass =
    columns.length <= 4
      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 items-start'
      : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 items-start'

  return (
    <div className={gridClassName || defaultGridClass}>
      {columns.map((col) => {
        const colItems = items.filter((item) => {
          const itemColId = getItemColumnId(item)
          return String(itemColId).toLowerCase() === String(col.id).toLowerCase()
        })

        return (
          <KanbanColumn
            key={col.id}
            column={col}
            count={colItems.length}
            emptyText={col.emptyText || emptyText || `No items in ${col.title}`}
          >
            {colItems.map((item, idx) => {
              if (renderCard) {
                return <React.Fragment key={item.id || idx}>{renderCard(item, col)}</React.Fragment>
              }

              return (
                <KanbanCard
                  key={item.id || idx}
                  id={item.id}
                  badge={item.type || item.applicationType}
                  title={item.applicantName || item.name || item.title}
                  subtitle={item.serviceRequired || item.subtitle || item.description}
                  meta={[
                    item.country ? { icon: '📍', label: item.country } : null,
                    item.assignedOfficer || item.officer ? { icon: '👤', label: item.assignedOfficer || item.officer } : null,
                    item.applicationDate || item.date ? { icon: '📅', label: item.applicationDate || item.date } : null,
                  ].filter(Boolean)}
                  actionText="View Details &rarr;"
                  onAction={() => onCardClick?.(item)}
                  onClick={() => onCardClick?.(item)}
                />
              )
            })}
          </KanbanColumn>
        )
      })}
    </div>
  )
}

export default KanbanBoard

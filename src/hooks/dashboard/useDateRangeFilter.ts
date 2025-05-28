import { TimePeriod } from '@/types/statistics.type'
import { parseDMYDate } from '@/utils/format'
import { useCallback, useMemo, useState } from 'react'

interface DateRangeFilterProps {
  defaultPeriod?: TimePeriod
}

interface DateRangeResult<T> {
  period: TimePeriod
  startDate: Date
  endDate: Date
  startCustomDate: Date | null
  endCustomDate: Date | null
  setPeriod: (period: TimePeriod) => void
  setStartCustomDate: (date: Date | null) => void
  setEndCustomDate: (date: Date | null) => void
  handlePeriodChange: (newPeriod: TimePeriod) => void
  filterDataByDateRange: (items: T[], dateAccessor: (item: T) => string) => T[]
}

export function useDateRangeFilter<T>({ defaultPeriod = TimePeriod.MONTH }: DateRangeFilterProps = {}): DateRangeResult<T> {
  const [period, setPeriod] = useState<TimePeriod>(defaultPeriod)
  const [startCustomDate, setStartCustomDate] = useState<Date | null>(null)
  const [endCustomDate, setEndCustomDate] = useState<Date | null>(null)

  // Get date range based on selected period
  const dateRange = useMemo(() => {
    const currentDate = new Date()
    let startDate = new Date()

    if (period === TimePeriod.CUSTOM && startCustomDate && endCustomDate) {
      startDate = new Date(startCustomDate)
      const endDate = new Date(endCustomDate)
      // Use end of day for the end date to include all data from that day
      endDate.setHours(23, 59, 59, 999)
      return { startDate, endDate }
    } else {
      switch (period) {
        case TimePeriod.DAY:
          startDate.setDate(currentDate.getDate() - 1)
          break
        case TimePeriod.WEEK:
          startDate.setDate(currentDate.getDate() - 7)
          break
        case TimePeriod.MONTH:
          startDate.setMonth(currentDate.getMonth() - 1)
          break
        case TimePeriod.YEAR:
          startDate.setFullYear(currentDate.getFullYear() - 1)
          break
        default:
          startDate.setMonth(currentDate.getMonth() - 1) // Default to month
      }
      return { startDate, endDate: currentDate }
    }
  }, [period, startCustomDate, endCustomDate])

  // Handle period change with defaults for custom dates
  const handlePeriodChange = useCallback((newPeriod: TimePeriod) => {
    setPeriod(newPeriod)
    
    // Set default custom dates if changing to custom and no dates selected yet
    if (newPeriod === TimePeriod.CUSTOM && (!startCustomDate || !endCustomDate)) {
      const today = new Date()
      const lastMonth = new Date()
      lastMonth.setMonth(today.getMonth() - 1)
      
      setStartCustomDate(lastMonth)
      setEndCustomDate(today)
    }
  }, [startCustomDate, endCustomDate])

  // Function to filter data by date range
  const filterDataByDateRange = useCallback((items: T[], dateAccessor: (item: T) => string): T[] => {
    if (!items || !items.length) return []

    const { startDate, endDate } = dateRange
    
    // Filter items within date range
    const filteredItems = items.filter(item => {
      const dateString = dateAccessor(item)
      const itemDate = parseDMYDate(dateString)
      return itemDate >= startDate && itemDate <= endDate
    })

    // Sort by date
    filteredItems.sort((a, b) => {
      const dateA = parseDMYDate(dateAccessor(a))
      const dateB = parseDMYDate(dateAccessor(b))
      return dateA.getTime() - dateB.getTime()
    })

    return filteredItems
  }, [dateRange])

  return {
    period,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    startCustomDate,
    endCustomDate,
    setPeriod,
    setStartCustomDate,
    setEndCustomDate,
    handlePeriodChange,
    filterDataByDateRange
  }
} 
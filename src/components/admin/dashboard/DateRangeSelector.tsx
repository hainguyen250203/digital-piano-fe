import { TimePeriod } from '@/types/statistics.type'
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { vi } from 'date-fns/locale'
import { memo } from 'react'

interface DateRangeSelectorProps {
  period: TimePeriod
  onPeriodChange: (period: TimePeriod) => void
  startCustomDate: Date | null
  endCustomDate: Date | null
  onStartDateChange: (date: Date | null) => void
  onEndDateChange: (date: Date | null) => void
}

const DateRangeSelector = memo(({
  period,
  onPeriodChange,
  startCustomDate,
  endCustomDate,
  onStartDateChange,
  onEndDateChange
}: DateRangeSelectorProps) => {
  return (
    <Box display='flex' gap={2} alignItems='center'>
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>Thời Gian</InputLabel>
        <Select 
          value={period} 
          label='Thời Gian' 
          onChange={e => onPeriodChange(e.target.value as TimePeriod)}
        >
          <MenuItem value={TimePeriod.DAY}>Hôm nay</MenuItem>
          <MenuItem value={TimePeriod.WEEK}>7 ngày qua</MenuItem>
          <MenuItem value={TimePeriod.MONTH}>30 ngày qua</MenuItem>
          <MenuItem value={TimePeriod.YEAR}>1 năm qua</MenuItem>
          <MenuItem value={TimePeriod.CUSTOM}>Tùy chọn</MenuItem>
        </Select>
      </FormControl>

      {period === TimePeriod.CUSTOM && (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
          <Box display='flex' gap={2}>
            <DatePicker
              label='Từ ngày'
              value={startCustomDate}
              onChange={onStartDateChange}
              slotProps={{ textField: { size: 'small' } }}
            />
            <DatePicker
              label='Đến ngày'
              value={endCustomDate}
              onChange={onEndDateChange}
              slotProps={{ textField: { size: 'small' } }}
              minDate={startCustomDate || undefined}
            />
          </Box>
        </LocalizationProvider>
      )}
    </Box>
  )
})

DateRangeSelector.displayName = 'DateRangeSelector'

export default DateRangeSelector 
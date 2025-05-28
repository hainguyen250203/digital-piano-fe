export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Updated to use year-month-day format
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-CA', { // en-CA uses YYYY-MM-DD format
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};

// Format with time
export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

// Format date to DD-MM-YYYY for display
export const formatDateToDMY = (date: Date): string => {
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date).replace(/\//g, '-');
};

// Parse ISO string to Date
export const parseISODate = (dateString: string): Date => {
  return new Date(dateString);
};

// Format ISO string directly to year-month-day
export const formatISOToYMD = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return formatDate(date);
  } catch (error) {
    console.error('Error formatting ISO date:', error);
    return dateString;
  }
};

// Parse a date string from DD-MM-YYYY format to a Date object
export const parseDMYDate = (dateString: string): Date => {
  try {
    // Split the date string by hyphen
    const parts = dateString.split('-');
    if (parts.length !== 3) {
      throw new Error('Invalid date format. Expected DD-MM-YYYY');
    }
    
    // Convert to YYYY-MM-DD format for proper parsing
    const year = parts[2];
    const month = parts[1];
    const day = parts[0];
    
    return new Date(`${year}-${month}-${day}T00:00:00`);
  } catch (error) {
    console.error('Error parsing DD-MM-YYYY date:', error);
    return new Date(); // Return current date as fallback
  }
};

// Format a DD-MM-YYYY string to YYYY-MM-DD format
export const convertDMYToYMD = (dateString: string): string => {
  try {
    const date = parseDMYDate(dateString);
    return formatDate(date);
  } catch (error) {
    console.error('Error converting date format:', error);
    return dateString;
  }
};

// Format date string or Date object with time (for display)
export const formatDateTimeFromAny = (date: string | Date): string => {
  try {
    return new Date(date).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return String(date);
  }
}; 
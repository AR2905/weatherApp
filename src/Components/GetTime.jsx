
export const getTimeAndPeriod =  (timezoneOffset) => {
    // Get current UTC time
    const currentTimeUTC = new Date();
  
    // Calculate the local time using the timezone offset
    const currentTimeLocal = new Date(currentTimeUTC.getTime() + (timezoneOffset * 1000));
  
    // Format the time in HH:MM format
    const formattedHours = String(currentTimeLocal.getUTCHours()).padStart(2, '0');
    const formattedMinutes = String(currentTimeLocal.getUTCMinutes()).padStart(2, '0');
    const timeString = `${formattedHours}:${formattedMinutes}`;
  
    // Get hours from the local time

  // Determine the period based on the hours
  let period;
  if (formattedHours >= 6 && formattedHours < 12) {
    period = 'Morning';
  } else if (formattedHours >= 12 && formattedHours <= 18) {
    period = 'Afternoon';
  } else if ((formattedHours >= 0 && formattedHours < 6) || (formattedHours > 18 && formattedHours <= 24)) {
    period = 'Night';
  }
  
    return { period, timeString };
  };
  
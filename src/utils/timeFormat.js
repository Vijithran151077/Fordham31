/**
 * Formats a 24-hour time string (HH:MM) to 12-hour format (h:MM AM/PM)
 * @param {string} timeStr - Time in "HH:MM" format
 * @returns {string} Formatted time or original string if invalid
 */
export const formatTime12Hour = (timeStr) => {
    if (!timeStr) return '';

    // Handle empty or invalid input gracefully
    if (typeof timeStr !== 'string' || !timeStr.includes(':')) {
        return timeStr; // Return as-is if not in expected format
    }

    try {
        // Handle potential seconds (HH:MM:SS) by taking first two parts
        const parts = timeStr.split(':');
        const hoursStr = parts[0];
        const minutesStr = parts[1];

        const hours = parseInt(hoursStr, 10);

        if (isNaN(hours)) return timeStr;

        const period = hours >= 12 ? 'PM' : 'AM';
        const hours12 = hours % 12 || 12;

        return `${hours12}:${minutesStr} ${period}`;
    } catch (e) {
        console.warn('Error formatting time:', e);
        return timeStr;
    }
};

/**
 * Returns a YYYY-MM-DD string representing the local date of the given Date object
 * @param {Date} dateObj - (optional) Date object. Defaults to now.
 * @returns {string} Date in YYYY-MM-DD format based on local timezone
 */
export const getLocalDateString = (dateObj) => {
    const d = dateObj || new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

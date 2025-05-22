/**
 * Detects if the application is running on a mobile device
 * @returns {boolean} True if running on a mobile device
 */
export const isMobileDevice = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  // Regular expressions for mobile devices
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  
  return mobileRegex.test(userAgent);
};

/**
 * Determines the operating system of the device
 * @returns {string} The operating system name ('ios', 'android', 'windows', 'mac', 'linux', or 'unknown')
 */
export const getOperatingSystem = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  // iOS detection
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return 'ios';
  }
  
  // Android detection
  if (/android/i.test(userAgent)) {
    return 'android';
  }
  
  // Windows detection
  if (/Windows NT|Win64|Win32/i.test(userAgent)) {
    return 'windows';
  }
  
  // macOS detection
  if (/Macintosh|MacIntel|MacPPC|Mac68K/i.test(userAgent)) {
    return 'mac';
  }
  
  // Linux detection
  if (/Linux/i.test(userAgent) && !/Android/i.test(userAgent)) {
    return 'linux';
  }
  
  return 'unknown';
};

/**
 * Get device information including type and OS
 * @returns {Object} Device information object
 */
export const getDeviceInfo = () => {
  const isMobile = isMobileDevice();
  const os = getOperatingSystem();
  
  return {
    isMobile,
    os,
    isIOS: os === 'ios',
    isAndroid: os === 'android',
    isDesktop: !isMobile,
    isMobileWeb: isMobile // If you need to distinguish between mobile app and mobile web
  };
};

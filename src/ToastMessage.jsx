import React from 'react';
import { toast, ToastContainer as ReactToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Toast types
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Custom toast settings
const toastSettings = {
  position: "top-center",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored",
};

/**
 * Shows a toast notification
 * @param {string} message - The message to display
 * @param {string} type - Type of toast from TOAST_TYPES
 * @param {Function} onClose - Optional callback to execute when toast closes
 * @returns {number} - Toast ID
 */
export const showToast = (message, type = TOAST_TYPES.INFO, onClose = null) => {
  const options = {
    ...toastSettings,
    onClose: onClose ? () => onClose() : undefined,
  };

  switch (type) {
    case TOAST_TYPES.SUCCESS:
      return toast.success(message, options);
    case TOAST_TYPES.ERROR:
      return toast.error(message, options);
    case TOAST_TYPES.WARNING:
      return toast.warning(message, options);
    case TOAST_TYPES.INFO:
      return toast.info(message, options);
    default:
      return toast(message, options);
  }
};

/**
 * Toast container component to be included once in your app layout
 */
export const AppToastContainer = () => (
  <ReactToastContainer
    position="top-center"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="colored"
    limit={3}
  />
);

export default {
  showToast,
  AppToastContainer,
  TOAST_TYPES,
};

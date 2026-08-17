// Previous: none
// Current: 5.5.3

import { options } from '@app/settings';

// Gate every console output behind the "Debug Logs" option (mgl_options => debug_logs).
const isDebugEnabled = () => {
  try {
    return !!(options && options.debug_logs);
  }
  catch (e) {
    return false;
  }
};

const mgl_log = (...args) => {
  if (isDebugEnabled()) {
    console.log(...args);
  }
};

mgl_log.warn = (...args) => {
  if (isDebugEnabled()) {
    console.warn(...args);
  }
};

mgl_log.error = (...args) => {
  if (isDebugEnabled()) {
    console.error(...args);
  }
};

mgl_log.info = (...args) => {
  if (isDebugEnabled()) {
    console.info(...args);
  }
};

export { mgl_log };

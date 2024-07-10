/* eslint-disable react/jsx-no-constructed-context-values */
import React, { useState, ReactNode, useContext, useCallback, createContext } from 'react';

import { Snackbar } from '@mui/material';
import Alert, { AlertColor } from '@mui/material/Alert';

interface NotificationContextProps {
  showNotification: (message: string, severity: AlertColor, duration?: number) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AlertColor>('info');
  const [duration, setDuration] = useState(6000);

  const showNotification = useCallback(
    (_message: string, _severity: AlertColor, _duration: number = 6000) => {
      setMessage(_message);
      setSeverity(_severity);
      setDuration(_duration);
      setOpen(true);
    },
    []
  );

  const handleClose = (event?: React.SyntheticEvent<unknown> | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={duration}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextProps => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

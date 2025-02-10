import React, { createContext, useCallback, useState } from 'react';
import { Alert, Snackbar } from '@mui/material';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationContextType {
  showNotification: (type: NotificationType, message: string) => void;
}

export const NotificationContext = createContext<NotificationContextType>({
  showNotification: () => {},
});

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<NotificationType>('info');

  const handleClose = () => {
    setOpen(false);
  };

  const showNotification = useCallback(
    (newType: NotificationType, newMessage: string) => {
      setType(newType);
      setMessage(newMessage);
      setOpen(true);
    },
    []
  );

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleClose} severity={type} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};

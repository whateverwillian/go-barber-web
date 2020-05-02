import React from 'react';

import { AuthProvider } from './authContext';
import { ToastProvider } from './toastContext';

const AppProvider: React.FC = ({ children }) => (
  <AuthProvider>
    <ToastProvider>{children}</ToastProvider>
  </AuthProvider>
);

export default AppProvider;

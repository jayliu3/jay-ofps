import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import './i18n';
import App from './app';
import { NotificationProvider } from './hooks/notification-context';
// ----------------------------------------------------------------------

ReactDOM.createRoot(document.getElementById('root')!).render(
  <NotificationProvider>
    <HelmetProvider>
      <BrowserRouter>
        <Suspense>
          <App />
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  </NotificationProvider>
);

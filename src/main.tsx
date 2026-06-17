/**
 * @packageDocumentation
 *
 * Browser entrypoint that mounts the React application and applies global styles.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { APP_DOCUMENT_TITLE } from './app/config/appMetadata';
import './index.css';

document.title = APP_DOCUMENT_TITLE;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

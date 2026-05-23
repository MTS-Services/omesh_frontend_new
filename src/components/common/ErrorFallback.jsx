import React from 'react';
import { useRouteError } from 'react-router-dom';

export default function ErrorFallback() {
  const error = useRouteError();

  return (
    <div style={{padding: 24, fontFamily: 'Inter, system-ui, -apple-system'}}>
      <h2 style={{margin: 0, marginBottom: 8}}>Unexpected Application Error</h2>
      <p style={{marginTop: 0, color: '#333'}}>
        Failed to load this part of the application.
      </p>
      <pre style={{background: '#f3f4f6', padding: 12, borderRadius: 6, overflow: 'auto'}}>
        {error?.message || String(error)}
      </pre>
      <div style={{marginTop: 12}}>
        <button
          onClick={() => window.location.reload()}
          style={{padding: '8px 12px', borderRadius: 6, border: 'none', background: '#111827', color: '#fff'}}
        >
          Reload
        </button>
      </div>
    </div>
  );
}

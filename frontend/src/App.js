import { useState } from 'react';
import QRCode from 'react-qr-code';
import { ReclaimProofRequest } from '@reclaimprotocol/js-sdk';
import './App.css';

function App() {
  const [requestUrl, setRequestUrl] = useState('');
  const [proofs, setProofs] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateConfig = async () => {
    setLoading(true);
    setError(null);
    try {

      // Step 1: Fetch the configuration from your backend
      const response = await fetch(`${process.env.REACT_APP_API_URL}/generate-config`);
      const { reclaimProofRequestConfig } = await response.json();
      console.log('Config received:', reclaimProofRequestConfig);
      const newReclaimRequestConfig = JSON.parse(reclaimProofRequestConfig);
      newReclaimRequestConfig.options = { device: "ios", log: true }

      // Step 2: Initialize the ReclaimProofRequest with the received configuration
      const reclaimProofRequest = await ReclaimProofRequest.fromJsonString(JSON.stringify(newReclaimRequestConfig));
      //reclaimProofRequest.
      // Step 3: Generate the request URL for the verification process
      const url = await reclaimProofRequest.getRequestUrl();
      setRequestUrl(url);

      // Step 4: Start the verification session
      await reclaimProofRequest.startSession({
        onSuccess: (proof) => {
          console.log("Successfully created proof:", proof);
          setProofs(proof);
          setLoading(false);
        },
        onError: (err) => {
          console.error('Verification failed:', err);
          setError('Verification failed: ' + err.message);
          setLoading(false);
        },
      });

    } catch (err) {
      console.error('Error:', err);
      setError('Failed to initialize Reclaim: ' + err.message);
      setLoading(false);
    }
  };

  const handleOpenLink = (e) => {
    e.preventDefault();
    if (!requestUrl) return;
    const tempLink = document.createElement('a');
    tempLink.href = requestUrl;
    tempLink.target = '_blank';
    tempLink.rel = 'noopener noreferrer';

    document.body.appendChild(tempLink);
    setTimeout(() => {
      tempLink.click();
      document.body.removeChild(tempLink);
    }, 100);
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1 style={{
          fontSize: '2.5rem',
          color: '#ffffff',
          marginBottom: '2rem',
          fontWeight: '600',
          letterSpacing: '-0.5px'
        }}>Reclaim Protocol Demo</h1>
        <div className="playground-container" style={{
          backgroundColor: '#1a1a1a',
          boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2rem'
          }}>
            <button
              onClick={generateConfig}
              disabled={loading}
              className="test-button"
              style={{
                minWidth: '250px',
                backgroundColor: '#ffffff',
                color: '#000000',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
            >
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="spinner"></div>
                  <span>Generating...</span>
                </div>
              ) : 'Generate Verification Request'}
            </button>

            {error && (
              <div className="error-message" style={{
                width: '100%',
                maxWidth: '500px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: '#ffffff'
              }}>
                {error}
              </div>
            )}

            {requestUrl && (
              <div className="qr-container" style={{
                width: '100%',
                maxWidth: '400px',
                backgroundColor: '#262626',
                boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
              }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  color: '#ffffff',
                  marginBottom: '1.5rem'
                }}>Scan QR Code or Click Link</h3>
                <QRCode
                  value={requestUrl}
                  size={256}
                  style={{
                    background: 'white',
                    padding: '16px',
                    borderRadius: '8px'
                  }}
                />
                <div style={{ marginTop: '1.5rem' }}>
                  <div
                    onClick={handleOpenLink}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#ffffff',
                      textDecoration: 'none',
                      padding: '8px 16px',
                      border: '2px solid #ffffff',
                      borderRadius: '6px',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#ffffff';
                      e.target.style.color = '#000000';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#ffffff';
                    }}
                  >
                    <span>Open Verification Link</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z" />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {proofs && (
              <div className="response-container" style={{
                width: '100%',
                maxWidth: '600px',
                backgroundColor: '#262626'
              }}>
                <h3 style={{
                  color: '#ffffff',
                  marginBottom: '1rem'
                }}>Verification Proofs:</h3>
                <pre style={{
                  backgroundColor: '#1a1a1a',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  lineHeight: '1.5',
                  padding: '1rem',
                  borderRadius: '6px',
                  color: '#ffffff'
                }}>{JSON.stringify(proofs, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;

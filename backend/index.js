const { ReclaimProofRequest } = require('@reclaimprotocol/js-sdk');
const express = require('express');
const cors = require('cors');
const app = express();

require('dotenv').config()

// Enable CORS
app.use(cors());

app.use(express.json());

// replace with the APP ID and SECRET from the dashboard 
const APP_ID = '0x33B64369427A48aC88CD4002C21604d741B2D8b2';
const APP_SECRET = '0xbbcc549f98811ea9a3036819c330752552d1585f8c4011a6eb7139740295f048';
const PROVIDER_ID = '8ebda519-490f-4ee6-9e38-0f20ce37acf9'; 


app.get('/health', async (req, res) => {
  try {
    return res.status(200).json({ message: "API is working!" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
app.get('/generate-config', async (req, res) => {
    try {
      const reclaimProofRequest = await ReclaimProofRequest.init(APP_ID, APP_SECRET, PROVIDER_ID)
      // we will be defining this endpoint in the next step

      reclaimProofRequest.setAppCallbackUrl(process.env.BASE_URL+'/receive-proofs')
      
      const reclaimProofRequestConfig = reclaimProofRequest.toJsonString()
   
      return res.json({ reclaimProofRequestConfig })
    } catch (error) {
      console.error('Error generating request config:', error)
      return res.status(500).json({ error: 'Failed to generate request config' })
    }
  })

// Route to receive proofs
app.post('/receive-proofs', async (req, res) => {
  // decode the urlencoded proof object; see below if not using express middlewares for decoding
  const decodedBody = decodeURIComponent(req.body);
  const proof = JSON.parse(decodedBody);
 
  // Verify the proof using the SDK verifyProof function
  const result = await verifyProof(proof)
  if (!result) {
    return res.status(400).json({ error: 'Invalid proofs data' });
  }
 
  console.log('Received proofs:', proof)
  // Process the proofs here
  return res.sendStatus(200)
})

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

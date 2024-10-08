import express from 'express';
import axios from 'axios';
import btoa from 'btoa'; // For basic authorization
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import bodyParser from 'body-parser';

const app = express();

app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// PayPal creditors (Sandbox)
const PAYPAL_CLIENT_ID = 'AUKn37wMpScFjyMD4pGcOawEta8IyMbh67iVWuYan0IkQVrHVUfrJLNT7ZLeHcxNWOJgABjqLZ-MA2wc';
const PAYPAL_CLIENT_SECRET = 'ELBUYzhUXUKVQZhq9JjZBZYuH6j8ixYuFOXr0NgvI_dXTT0_hl54MPCJbnVvAPdXD7YycK9QrQQU8ZVi';

// Function to get ACCESS_TOKEN
async function getAccessToken() {
  const auth = btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`);
  // const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');

  try {
    const response = await axios.post('https://api.sandbox.paypal.com/v1/oauth2/token', 'grant_type=client_credentials', {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching access token:', error.response ? error.response.data : error.message);
    throw new Error('Unable to fetch access token');
  }
}

// Route to create a Vault Setup Token
app.post('/create-vault-setup-token', async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    const requestId = uuidv4(); // Generate a unique PayPal-Request-Id
    const response = await axios.post('https://api-m.sandbox.paypal.com/v3/vault/setup-tokens', {
      payment_source: {
        card: {}
      }
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'PayPal-Request-Id': requestId
      }
    });

    res.json(response.data); // Return the Setup Token
  } catch (error) {
    console.error('Error creating vault setup token:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: error.message });
  }
});

// Route to save a Vault Setup Token
app.post('/save-payment-token', async (req, res) => {
  const { vaultSetupToken } = req.body; // Get VAULT-SETUP-TOKEN from the request

  if (!vaultSetupToken) {
    return res.status(400).json({ error: 'Vault Setup Token is required' });
  }

  try {
    const accessToken = await getAccessToken();
    const requestId = uuidv4(); // Generate a unique PayPal-Request-Id
    const response = await axios.post('https://api-m.sandbox.paypal.com/v3/vault/payment-tokens', {
      payment_source: {
        token: {
          id: vaultSetupToken,
          type: 'SETUP_TOKEN',
        },
      }
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'PayPal-Request-Id': requestId
      }
    });

    res.json(response.data); // We return the saved token to the client
  } catch (error) {
    console.error('Error creating vault setup token:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: error.message });
  }
});

// Starting the server
const PORT = 3005;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

# PayPal Vault API Integration

This project demonstrates how to integrate the **PayPal Vault API** using **Node.js** and **Express.js** to create and
save payment methods. The server interacts with PayPal's **sandbox environment** for testing purposes.

## Features

- **Create Vault Setup Token**: Generate a token to securely store payment methods using PayPal Vault.
- **Save Payment Method**: Convert a Vault Setup Token into a reusable payment method.

## Requirements

- **Node.js** and **npm** installed.
- **PayPal Sandbox Account** with valid **Client ID** and **Client Secret**.

## Installation

1. Clone the repository:

   ````bash
   git clone https://github.com/your-repo.git
   ````

2. Navigate to the project directory:

   ````bash
   cd your-repo
   ````

2. Install the dependencies:

   ````bash
   npm install
   ````

## Configuration

Make sure to replace the PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in the code with your PayPal sandbox
credentials. (https://developer.paypal.com/dashboard/)

## Running the Server

   ````bash
   npm start
   ````

By default, the server will run on port 3005.

## API Endpoints

1. Create Vault Setup Token

- Endpoint: /create-vault-setup-token
- Method: POST
- Description: This endpoint creates a Vault Setup Token, which is used to securely store a payment method.
- Response:
  setup_token: The Vault Setup Token that can be used to save a payment method.

#### Example:

````bash
curl -X POST http://localhost:3005/create-vault-setup-token
````

2. Save Payment Token

- Endpoint: /save-payment-token
- Method: POST
- Description: This endpoint receives a Vault Setup Token from the client and saves it as a payment method using PayPal
  Vault API.
- Request Body:
  vaultSetupToken: The Vault Setup Token received from the client.
- Response:
  Returns the saved payment method token from PayPal.

#### Example:

````bash
curl -X POST http://localhost:3005/save-payment-token \
-H "Content-Type: application/json" \
-d '{"vaultSetupToken": "YOUR_VAULT_SETUP_TOKEN"}'
````
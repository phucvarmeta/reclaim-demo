# Reclaim Protocol Integration

This project demonstrates how to integrate the Reclaim Protocol to request and verify proofs. It uses the [`@reclaimprotocol/js-sdk`](https://www.npmjs.com/package/@reclaimprotocol/js-sdk) to facilitate proof verification.

## Prerequisites

- Node.js (v18 or higher recommended)
- pnpm (or npm/yarn)

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd test-reclaim
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

## Configuration

The application uses the Reclaim Protocol to request proofs. It requires an Application ID and Secret:

- `APPLICATION_ID`: Your Reclaim Protocol application ID
- `APP_SECRET`: Your Reclaim Protocol application secret

These are already configured in `app.ts`, but you might want to replace them with your own credentials.

## Running the Application

Start the server with:

```bash
npx ts-node app.ts
```

The server will run on http://localhost:3000.

## API Endpoints

### Home

- **URL:** `/`
- **Method:** `GET`
- **Response:** "Hello, World!"

### Request Proof

- **URL:** `/reclaim/request/:providerId`
- **Method:** `GET`
- **URL Parameters:**
  - `providerId`: The provider ID for which to request proof (e.g., "novotel", "facebook", "github")
- **Response:** JSON object containing a `request_url` that can be used to initiate the proof process

## Example Usage

1. Start the server
2. Make a request to the proof endpoint with a provider ID:
   ```
   http://localhost:3000/reclaim/request/gmail-message
   ```
3. The response will include a `request_url` that can be used to initiate the proof process
4. The server console will log the proof details and verification status

## How It Works

1. When a request is made to `/reclaim/request/:providerId`, the app initializes a Reclaim proof request
2. A request URL is generated and returned to the client (please open the url in response data to show the QR code to the verification link)
3. The server starts a session to listen for proof submissions
4. When a proof is submitted, the `onSuccess` callback verifies the proof
5. Results are logged to the console

## Available Providers

Some common provider IDs you can use:

- Novotel - ccc07e82-4377-42ea-b10d-b93e0f9cc1aa
- Marriot/Sheraton - 17995225-4634-424e-b773-21f12d8509a0
- Thai Airways - 78440b6e-f55e-430d-947e-b52f105456b0
- Lufthansa Airlines - 7d509268-cb4a-558c-c22f-2365d1e87b7b

Refer to the [Reclaim Protocol documentation](https://docs.reclaimprotocol.org/) for a complete list of supported providers.

## Notes

- The current implementation is set up with `useAppClip: true` which is suitable for mobile applications
- In a production environment, you should separate the frontend and backend components of the verification process

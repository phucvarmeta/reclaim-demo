import express from "express";
import { ReclaimProofRequest, verifyProof } from "@reclaimprotocol/js-sdk";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/reclaim/request/:providerId", async (req: any, res: any) => {
  const { providerId } = req.params;
  const APPLICATION_ID = "0x332E0620fDad6a72C52aE476b4185B702A117EB9";
  const APP_SECRET =
    "0x1f655a1e23b0a0107549f8d39b1587518bb71965f2970e33c678dfed80900e06";

  // Send URL to user who requested the proof
  try {
    const reclaimProofRequest = await ReclaimProofRequest.init(
      APPLICATION_ID,
      APP_SECRET,
      providerId,
      // set true to use app clip, this is the most convenient way to do things on Mobile phone
      { useAppClip: true }
    );

    const request_url = await reclaimProofRequest.getRequestUrl();
    console.log("🚀 ~ app.get ~ request_url:", request_url);

    // Listen for the session to receive the proof
    // This step should be done in the app clip
    // This listener should be executed in Frontend side
    await reclaimProofRequest.startSession({
      onSuccess: async (proofs) => {
        console.log("🚀 ~ onSuccess: ~ proofs:", proofs);

        // After receiving the proof, you can verify it
        // This step should be done in the Backend side to verify and store claimed proof data
        const isValid = await verifyProof(proofs as any);
        console.log("🚀 ~ onSuccess: ~ isValid:", isValid);
      },
      onError: (error) => {
        console.error("Verification failed", error);
      },
    });

    return res.json({
      qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${request_url}`,
    });
  } catch (error) {
    console.error("Error generating request config:", error);
    return res.status(500).json({ error: "Failed to generate request config" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

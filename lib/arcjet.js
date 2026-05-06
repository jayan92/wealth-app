import arcjet, { tokenBucket } from "@arcjet/next";

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ["userId"], // Track based on Clerk userId
  rules: [
    // Rate limiting specifically for collection creation
    tokenBucket({
      mode: "LIVE",
      refillRate: 10, // refill 10 tokens per hour
      interval: 3600, // per hour
      capacity: 10, // max 10 requests before rate limited
    }),
  ],
});

export default aj;

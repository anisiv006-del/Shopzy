import { client } from "./client";
export const paymentsApi = {
  requestOtp: (items) => client.post("/payments/request-otp", { items }),
  verifyOtp: (paymentId, otp) =>
    client.post("/payments/verify-otp", { paymentId, otp }),
};

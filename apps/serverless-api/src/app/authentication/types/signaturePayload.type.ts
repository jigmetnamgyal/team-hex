export type SignaturePayload = {
  nonce: {
    message: string
  };
  signature: string;
}
import "server-only";
import Cryptr from "cryptr";

// This single key must remain stable for the lifetime of all stored
// credentials. Rotation requires decrypting and re-encrypting every row.
const encryptionKey = process.env.ENCRYPTION_KEY;

if (!encryptionKey) {
  throw new Error("ENCRYPTION_KEY is required for credential encryption");
}

const cryptr = new Cryptr(encryptionKey);

export const encrypt = (text: string) => cryptr.encrypt(text);
export const decrypt = (text: string) => cryptr.decrypt(text);

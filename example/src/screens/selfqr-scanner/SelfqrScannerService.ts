import * as CryptoJS from "crypto-js";
import { executeQuery } from "../../aws/db/dbOperation";
import { User } from "../../models/User";
import { ActivityLogger } from "../../log/ActivityLogger";

const keyString = "1234567800000000";
const ivString = "0000000012345678";

let scannedQ4Parts: string[] = [];
let totalScansNeeded = 0;
let currentScans = 0;

// CONVERT key and IV strings to WordArray
const key = CryptoJS.enc.Utf8.parse(keyString);
const iv = CryptoJS.enc.Utf8.parse(ivString);
const uniqueQ4Parts = new Set<string>();

// RESET
export function resetDecryptionState() {
  scannedQ4Parts = [];
  totalScansNeeded = 0;
  currentScans = 0;
  uniqueQ4Parts.clear();
}

export function decryptDecodedText(decodedText: string) {
  try {
    let QRjson;

    // VALIDATE the JSON format
    try {
      QRjson = JSON.parse(decodedText);
    } catch (jsonError) {
      return { error: "Invalid JSON format." };
    }

    // VALIDATE the expected format
    if (!QRjson.Q2 || !QRjson.Q1 || !QRjson.Q3 || !QRjson.Q4) {
      return { error: "Invalid format: Missing required keys." };
    } else {
      const encryptedStr = QRjson;
      const decryptedData: { [key: string]: string } = {};

      decryptedData.Q1 = encryptedStr.Q1;
      decryptedData.Q2 = encryptedStr.Q2;

      // DECRYPT Q3
      const hexQ3 = CryptoJS.enc.Hex.parse(QRjson.Q3);
      const base64Q3 = CryptoJS.enc.Base64.stringify(hexQ3);

      const decryptedDataQ3Str = CryptoJS.AES.decrypt(base64Q3, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }).toString(CryptoJS.enc.Utf8);

      if (!decryptedDataQ3Str) {
        return { error: "Decryption failed, result is empty." };
      } else {
        const decryptedDataQ3 = JSON.parse(decryptedDataQ3Str);
        if ("h2" in decryptedDataQ3) {
          if (decryptedDataQ3["h2"] !== "Sqr001") {
            return { error: 'Decrypted h2 value is not equal to "Sqr001".' };
          } else {
            decryptedData.Q3 = decryptedDataQ3Str;
          }
        } else {
          return { error: 'Decrypted data does not contain property "h2".' };
        }
      }

      // DECRYPT Q4
      let decryptedDataQ4: any;
      if (encryptedStr.Q2 > 1) {
        if (totalScansNeeded === 0) {
          totalScansNeeded = parseInt(encryptedStr.Q2, 10);
        }
        if (!uniqueQ4Parts.has(encryptedStr.Q4)) {
          scannedQ4Parts.push(encryptedStr.Q4);
          uniqueQ4Parts.add(encryptedStr.Q4);
        } else {
          return {
            warning: "Qr code is already Scanned.",
            Q2: encryptedStr.Q2,
          };
        }
        currentScans++;

        if (currentScans < totalScansNeeded) {
          return {
            message: `Scan ${currentScans} completed. Please scan ${
              totalScansNeeded - currentScans
            } more times.`,
            Q2: encryptedStr.Q2,
          };
        } else {
          // CONCATENATE all scanned Q4 parts
          const concatenatedQ4 = scannedQ4Parts.join("");
          decryptedDataQ4 = CryptoJS.AES.decrypt(concatenatedQ4, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
          }).toString(CryptoJS.enc.Utf8);

          decryptedData.Q4 = decryptedDataQ4;
          resetDecryptionState();
        }
      } else {
        decryptedDataQ4 = CryptoJS.AES.decrypt(encryptedStr.Q4, key, {
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        }).toString(CryptoJS.enc.Utf8);

        decryptedData.Q4 = decryptedDataQ4;
      }

      if (!decryptedDataQ4) {
        return { error: "Decryption failed, result is empty." };
      }
      return { data: decryptedData };
    }
  } catch (error: unknown) {
    console.error("Error during decryption:", error);
    if (error instanceof Error) {
      return { error: error.message };
    } else {
      return { error: "An unknown error occurred during decryption." };
    }
  }
}

// GET Relationship
export const getRelationshipInfo = async (relationshipTypeCode: string) => {
  const method = "POST";
  let queryString: string;

  queryString =
    "SELECT name, is_manual_entry FROM relationship_type WHERE relationship_type_code = '" +
    relationshipTypeCode +
    "';";
  ActivityLogger.insertInfoLogEntry(new User(), 'SelfqrScanner', 'getRelationshipInfo', 'execute query', '', null, queryString);
  return executeQuery(method, queryString);
};

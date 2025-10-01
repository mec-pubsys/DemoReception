import React, { useEffect, useState } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

export const DeviceInfo = () => {
  const [DEVICE_ID, setDeviceId] = useState("");

  useEffect(() => {
    const fpPromise = FingerprintJS.load();

    const fetchDeviceId = async () => {
      try {
        const fp = await fpPromise;
        const result = await fp.get();
        const visitorId = result.visitorId;
        setDeviceId(visitorId);
      } catch (error) {
        console.error("Error obtaining fingerprint:", error);
        setDeviceId("Unavailable");
      }
    };

    fetchDeviceId();
  }, []);

  return DEVICE_ID;
};

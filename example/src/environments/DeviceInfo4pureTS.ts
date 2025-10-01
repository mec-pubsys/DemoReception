import FingerprintJS from '@fingerprintjs/fingerprintjs';

export class DeviceInfo {
  static async getDeviceInfo(): Promise<string> {

    const fpPromise = FingerprintJS.load();
    try {
      const fp = await fpPromise;
      const result = await fp.get();
      const visitorId = result.visitorId;
      return visitorId;
    } catch (error) {
      console.error('Error obtaining fingerprint:', error);
      return 'Unavailable';
    }
  }
};

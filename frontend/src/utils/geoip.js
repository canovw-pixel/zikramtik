import { countries } from '../data/mock';

const STORAGE_KEY = 'zikra_detected_country';

export const detectCountryByIP = async () => {
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      const age = Date.now() - (parsed.timestamp || 0);
      if (age < 24 * 60 * 60 * 1000) {
        const match = countries.find(c => c.code === parsed.code);
        if (match) return match;
      }
    }

    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) throw new Error('IP API failed');
    
    const data = await response.json();
    const countryCode = data.country_code || data.country;

    const detected = countries.find(c => c.code === countryCode);
    const result = detected || countries.find(c => c.code === 'TR');

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        code: result.code,
        timestamp: Date.now(),
      }));
    } catch (e) {
      // localStorage may not be available in some contexts
    }

    return result;
  } catch (error) {
    console.warn('Country detection failed, defaulting to TR:', error);
    return countries.find(c => c.code === 'TR') || countries[0];
  }
};

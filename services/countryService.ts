import { Country } from '../types';

const API_URL = 'https://restcountries.com/v3.1/all?fields=name,flags,cca3,region,population';

export const fetchAllCountries = async (): Promise<Country[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch countries: ${response.statusText}`);
    }
    const data = await response.json();
    // Sort alphabetically by common name
    return data.sort((a: Country, b: Country) => 
      a.name.common.localeCompare(b.name.common)
    );
  } catch (error) {
    console.error("Error fetching countries:", error);
    return [];
  }
};

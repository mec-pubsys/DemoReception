export const searchAddressFromPostalCode = async (postalCode: any) => {
  let state;
  let city;
  try {
    const response = await fetch(
      `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${postalCode}`
    );
    const json = await response.json();

    // Handle cases where address is not found or _post is empty
    if (!json.results || !postalCode) {
      throw new Error("Postal code not found");
    }

    // Handle response errors
    if (json.status !== 200) {
      throw new Error("Response error");
    }

    // Convert JSON to state and city
    [state, city] = convertJsonToStrAddress(json);

    return [state, city];
  } catch (error) {
    throw error;
  }
};

const convertJsonToStrAddress = (json: { results: any[] }) => {
  // Extract state from address1
  const state = json.results[0].address1;

  // Extract major city from address2
  const majorCity = json.results[0].address2;

  // Extract minor cities from address3
  const minorCities = json.results.map(
    (result: { address3: any }) => result.address3
  );

  // Join minor cities into a single string
  const minorCity = joinMinorCities(minorCities);

  // Concatenate major city and minor city to get the full city name
  const city = majorCity + minorCity;

  return [state, city];
};

const joinMinorCities = (minorCities: any[]) => {
  // If only one minor city, return it directly
  if (minorCities.length === 1) {
    return minorCities[0];
  }

  // Find the common part among all minor cities
  const commonPrefix = findCommonPrefix(minorCities);

  // Remove the common part from each minor city
  const uniqueMinorCities = minorCities.map((city: string) =>
    city.replace(commonPrefix, "")
  );

  // Filter out empty strings
  const filteredUniqueCities = uniqueMinorCities.filter(
    (city: string) => city.trim() !== ""
  );

  // Join unique minor cities with commas
  const joinedCities = filteredUniqueCities.join("、");

  // Combine common part and unique minor cities
  const result = commonPrefix + joinedCities;

  return result;
};

const findCommonPrefix = (strings: any[]) => {
  if (!strings || strings.length === 0) {
    return "";
  }

  const sortedStrings = strings.slice().sort();
  const first = sortedStrings[0];
  const last = sortedStrings[sortedStrings.length - 1];
  const minLength = Math.min(first.length, last.length);

  let i = 0;
  while (i < minLength && first.charAt(i) === last.charAt(i)) {
    i++;
  }

  return first.substring(0, i);
};

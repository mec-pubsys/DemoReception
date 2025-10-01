// HANDLE Postal Code
export const handleZipCodeChange = (text: string) => {
  const regex = /^[0-9-]*$/;
  if (text.length <= 8 && regex.test(text)) {
    if (text.length === 4 && text.charAt(3) !== "-") {
      return text.slice(0, 3) + "-" + text.slice(3);
    } else {
      return text;
    }
  }
  return null;
};

export const isValidPostalCode = (zipCode: string) => {
  if (!zipCode) {
    return "郵便番号を入力してください";
  } else if (!/^\d{3}-\d{4}$/.test(zipCode)) {
    return "郵便番号は数字7桁で入力してください";
  } else if (/^(.)\1{2}-\1{4}$/.test(zipCode)) {
    return "この郵便番号は使用できません";
  } else {
    return "";
  }
};

//HANDLE Kana Name
export const isKatakanaText = (text: string) => {
  const katakanaRegex = /^[\u30A0-\u30FF]+$/;
  return katakanaRegex.test(text);
};

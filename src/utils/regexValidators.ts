export const phoneNumberValidator = (string: string): boolean => {
  const regex =
    /^\((?:[14689][1-9]|2[12478]|3[1234578]|5[1345]|7[134579])\) (?:[2-8]|9[0-9])[0-9]{3}\-[0-9]{4}$/;

  return regex.test(string);
};

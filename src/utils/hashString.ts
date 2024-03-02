import bcrypt from "bcrypt";

export const hashString = async (
  stringToEncript: string,
  rounds: number
): Promise<string> => {
  return await bcrypt.hash(stringToEncript, rounds);
};

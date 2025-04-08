import "dotenv/config";

export const getApiUrl = () => {
  const host = process.env.API_HOST || "localhost";
  const protocol = process.env.API_PROTOCOL || "http";
  const port = ":" + (process.env.PORT || 3001);

  return `${protocol}://${host}${host === "localhost" ? port : ""}/api`;
};

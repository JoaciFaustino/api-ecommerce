export const errorString = (path: string, required: boolean = false) => {
  return `the ${path} ${required ? "is required and " : ""}must be string`;
};

export const errorNumberPositive = (
  path: string,
  required: boolean = false
) => {
  return `the ${path} ${
    required ? "is required and " : ""
  }must be positive number`;
};

export const errorArrayString = (path: string) => {
  return `${path} must be a array of strings`;
};

export const errorEnum = (path: string) => {
  return `the value of ${path} is not valid`;
};

export const errorObj = (path: string) => {
  return `${path} is not object valid`;
}
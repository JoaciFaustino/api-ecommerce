export const falseDelay = async (delayInSeconds?: number) => {
  const delay = delayInSeconds
    ? delayInSeconds
    : Math.floor(Math.random() * 3) + 1;

  await new Promise((resolve) => {
    setTimeout(() => {
      resolve("");
    }, delay * 1000);
  });
};

import fs from "fs";
import path from "path";

export const getCloudinaryPublicId = (imageUrl: string): string => {
  const piecesUrl = imageUrl.split("/");

  return piecesUrl[piecesUrl.length - 1].split(".")[0];
};

export const getLocalPathImage = (imageUrl: string): string => {
  const piecesUrl: string[] = imageUrl.split("/");
  const fileNameImage: string = imageUrl.split("/")[piecesUrl.length - 1];

  const pathImage = path.resolve(
    __dirname,
    "../../public/uploads/" + fileNameImage
  );

  return pathImage;
};

export const deleteLocalImage = (imageUrl: string): boolean => {
  const pathImage = getLocalPathImage(imageUrl);

  let result: boolean = true;

  fs.unlink(pathImage, (err) => {
    if (err) {
      result = false;
    }
  });

  return result;
};

import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

export class FilesService {
  constructor() {}

  async uploadImageCake(
    file: Express.Multer.File,
    hostUrl: string
  ): Promise<string | undefined> {
    if (process.env.DESTINATION_STORAGE_IMAGES === "cloudinary") {
      const b64: string = Buffer.from(file.buffer).toString("base64");

      const dataUri = `data:${file.mimetype};base64,${b64}`;

      try {
        const result = await cloudinary.uploader.upload(dataUri, {
          resource_type: "auto"
        });

        return result.secure_url;
      } catch (error: any) {
        return;
      }
    }

    if (!file.filename) return;

    return hostUrl + "images/" + file.filename;
  }

  async updateImageCake(
    oldImageUrl: string,
    file: Express.Multer.File,
    hostUrl: string
  ): Promise<string | undefined> {
    if (process.env.DESTINATION_STORAGE_IMAGES === "cloudinary") {
      if (!oldImageUrl) {
        return this.uploadImageCake(file, hostUrl);
      }

      const b64: string = Buffer.from(file.buffer).toString("base64");
      const dataUri: string = `data:${file.mimetype};base64,${b64}`;

      const piecesUrl: string[] = oldImageUrl.split("/");
      const publicIdImage: string =
        piecesUrl[piecesUrl.length - 1].split(".")[0];

      try {
        const result = await cloudinary.uploader.upload(dataUri, {
          public_id: publicIdImage,
          resource_type: "auto",
          overwrite: true,
          invalidate: true // para que a imagem antiga não fique em cache e seja acessada no lugar da nova
        });

        return result.secure_url;
      } catch (error: any) {
        return;
      }
    }

    if (!file.filename) return;

    const piecesUrl: string[] = oldImageUrl.split("/");
    const fileNameImage: string = oldImageUrl.split("/")[piecesUrl.length - 1];

    const pathOldImage = path.resolve(
      __dirname,
      "../../public/temp/uploads/" + fileNameImage
    );

    fs.unlink(pathOldImage, () => {
      return;
    });

    return hostUrl + "images/" + file.filename;
  }
}

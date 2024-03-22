import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";

export class FilesService {
  constructor() {}

  async upload(
    file: Express.Multer.File,
    hostUrl: string
  ): Promise<string | undefined> {
    if (process.env.DESTINATION_STORAGE_IMAGES === "cloudinary") {
      const b64: string = Buffer.from(file.buffer).toString("base64");

      const dataUri = `data:${file.mimetype};base64,${b64}`;

      const result = await cloudinary.uploader.upload(dataUri, {
        resource_type: "auto"
      });

      return result.secure_url;
    }

    return hostUrl + "images/" + file.filename;
  }
}

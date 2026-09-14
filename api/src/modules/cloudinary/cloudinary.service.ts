import { Readable } from "stream";
import { Injectable } from "@nestjs/common";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

@Injectable()
export class CloudinaryService {
  async uploadFile(file: Express.Multer.File, folder?: string): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const options = {
        resource_type: "auto" as const,
        access_mode: "public" as const,
        ...(folder && { folder })
      };

      const upload = cloudinary.uploader.upload_stream(options, (error, result) => {
        if (error) {
          return reject(error);
        }
        if (!result) {
          return reject(new Error("Upload failed, result is undefined"));
        }
        resolve(result);
      });

      Readable.from(file.buffer).pipe(upload);
    });
  }

  async deleteFile(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }
}

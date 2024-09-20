import { v2 as cloudinary } from 'cloudinary';
import { Buffer } from 'buffer';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

interface CloudinaryResource {
  context?: {
    alt?: string;
    caption?: string;
  };
  public_id: string;
  secure_url: string;
}

export const uploadFileToCloudinary = async (file: File): Promise<any> => {
    try {
      // Convert file to ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
  
      // Upload the file to Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            tags: ['nextjs-server-actions-upload-sneakers'],
            upload_preset: 'yoigxf8t',  // Make sure this preset exists in your Cloudinary account
          },
          (error, result) => {
            if (error) {
              reject(error);
              return;
            }
            resolve(result);
          }
        ).end(buffer);  // Send the buffer to Cloudinary
      });
  
      return result;  // Return the Cloudinary upload response
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error;
    }
  };
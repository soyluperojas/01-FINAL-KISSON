
import { supabase } from "@/integrations/supabase/client";

export class StorageService {
  private static BUCKET_NAME = 'recipe-images';

  /**
   * Upload an image to Supabase Storage from a URL
   */
  static async uploadImageFromUrl(imageUrl: string, fileName: string): Promise<string | null> {
    try {
      console.log("Downloading image from URL:", imageUrl);
      
      // Use a more robust approach for downloading the image
      const response = await fetch(imageUrl, {
        mode: 'cors',
        headers: {
          'Accept': 'image/*',
        }
      });
      
      if (!response.ok) {
        console.error(`Failed to download image: ${response.status} ${response.statusText}`);
        return null;
      }
      
      const imageBlob = await response.blob();
      console.log("Image downloaded successfully, size:", imageBlob.size, "bytes");

      // Validate image size (max 10MB)
      if (imageBlob.size > 10 * 1024 * 1024) {
        console.error("Image too large:", imageBlob.size, "bytes");
        return null;
      }

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(fileName, imageBlob, {
          contentType: imageBlob.type || 'image/png',
          upsert: true
        });

      if (error) {
        console.error("Error uploading to Supabase Storage:", error);
        return null;
      }

      console.log("Image uploaded successfully to:", data.path);
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(data.path);

      console.log("Generated public URL:", publicUrl);
      return publicUrl;
    } catch (error) {
      console.error("Error in uploadImageFromUrl:", error);
      return null;
    }
  }

  /**
   * Delete an image from Supabase Storage
   */
  static async deleteImage(fileName: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([fileName]);

      if (error) {
        console.error("Error deleting image:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in deleteImage:", error);
      return false;
    }
  }

  /**
   * Generate a unique filename for a recipe image
   */
  static generateImageFileName(recipeId: string): string {
    const timestamp = Date.now();
    return `recipe-${recipeId}-${timestamp}.png`;
  }

  /**
   * Check if the storage bucket exists and is accessible
   */
  static async checkBucketAccess(): Promise<boolean> {
    try {
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list('', { limit: 1 });

      if (error) {
        console.error("Bucket access check failed:", error);
        return false;
      }

      console.log("Bucket access confirmed");
      return true;
    } catch (error) {
      console.error("Error checking bucket access:", error);
      return false;
    }
  }
}

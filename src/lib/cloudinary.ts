export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
}

export async function uploadImageToCloudinary(
  file: File,
  folder: string = 'reviews'
): Promise<CloudinaryUploadResult> {
  // Validate file
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File size must be less than 5MB');
  }

  // Get Cloudinary configuration from environment variables
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 
                   process.env.CLOUDINARY_CLOUD_NAME || 
                   'demo';
  
  // Try different upload presets
  const uploadPresets = [
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
    process.env.CLOUDINARY_UPLOAD_PRESET,
    'lakhna_restaurant',
    'ml_default', // Default Cloudinary preset
    'unsigned' // Another common preset
  ].filter(Boolean) as string[];

  console.log('Cloudinary config:', {
    cloudName,
    uploadPresets,
    folder
  });

  let lastError: Error | null = null;

  for (const uploadPreset of uploadPresets) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);
      formData.append('folder', folder);
      formData.append('public_id', `${folder}_${Date.now()}_${Math.random().toString(36).substring(2)}`);

      console.log(`Trying upload with preset: ${uploadPreset}`);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Cloudinary upload failed with preset ${uploadPreset}:`, errorText);
        lastError = new Error(`Upload failed with preset ${uploadPreset}: ${errorText}`);
        continue;
      }

      const result = await response.json();
      console.log('Image uploaded successfully:', result);
      return result;
    } catch (error) {
      console.error(`Error uploading with preset ${uploadPreset}:`, error);
      lastError = error instanceof Error ? error : new Error('Unknown upload error');
    }
  }

  // If all Cloudinary uploads failed, create a base64 fallback
  console.log('All Cloudinary uploads failed, creating base64 fallback');
  return await createBase64Fallback(file);
}

async function createBase64Fallback(file: File): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      const publicId = `fallback_${Date.now()}_${Math.random().toString(36).substring(2)}`;
      
      resolve({
        secure_url: base64,
        public_id: publicId,
        width: 300,
        height: 300,
        format: file.type.split('/')[1] || 'jpeg'
      });
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export function getCloudinaryUrl(publicId: string, transformations: string = 'w_300,h_300,c_fill,g_face'): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 
                   process.env.CLOUDINARY_CLOUD_NAME || 
                   'demo';
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`;
} 
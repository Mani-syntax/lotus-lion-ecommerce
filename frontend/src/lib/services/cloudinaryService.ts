interface CloudinaryResponse {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  width: number;
  height: number;
}

export const cloudinaryService = {
  // Upload single image
  uploadImage: async (file: File): Promise<CloudinaryResponse | null> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '');
      formData.append('cloud_name', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '');

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) throw new Error('Upload failed');
      return await response.json();
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      return null;
    }
  },

  // Upload multiple images
  uploadMultiple: async (files: File[]): Promise<CloudinaryResponse[]> => {
    try {
      const uploads = await Promise.all(
        files.map((file) => cloudinaryService.uploadImage(file))
      );
      return uploads.filter((u): u is CloudinaryResponse => u !== null);
    } catch (error) {
      console.error('Error uploading multiple images:', error);
      return [];
    }
  },

  // Generate optimized URL
  getOptimizedUrl: (publicId: string, options: any = {}) => {
    const {
      width = 800,
      height = 600,
      quality = 'auto',
      format = 'auto',
    } = options;

    return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_${width},h_${height},q_${quality},f_${format}/${publicId}`;
  },

  // Delete image
  deleteImage: async (publicId: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/cloudinary/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ publicId }),
      });

      if (!response.ok) throw new Error('Delete failed');
      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  },

  // Get image metadata
  getImageMetadata: async (publicId: string) => {
    try {
      const response = await fetch(`/api/cloudinary/metadata?publicId=${publicId}`);
      if (!response.ok) throw new Error('Failed to fetch metadata');
      return await response.json();
    } catch (error) {
      console.error('Error fetching metadata:', error);
      return null;
    }
  },
};

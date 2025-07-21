import axios from 'axios';

export const uploadToCloudinary = async (files) => {
  const urls = [];
  const cloudName = "dl5iz91k6";
  const uploadPreset = "my_unsigned_preset";

  for (const file of files) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, 
        formData
      );
      urls.push({
        url: response.data.secure_url,
        type: file.type.startsWith("video") ? "video" : "image",
      });
    } catch (error) {
      console.error("Cloudinary upload failed: ", error);
      return null;
    }
  }

  return urls;
};

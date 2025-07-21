import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, push, set } from "firebase/database";
import { db } from "../services/firebase"; // Your initialized Realtime DB

const CreateMemory = () => {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "my_unsigned_preset");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dl5iz91k6/auto/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image to Cloudinary");
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload failed:", error.message);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      alert("You must be logged in to create a memory.");
      return;
    }

    if (!imageFile) {
      alert("Please choose an image to upload.");
      return;
    }

    setIsSubmitting(true);

    const imageUrl = await handleImageUpload(imageFile);
    if (!imageUrl) {
      alert("Image upload failed. Try again.");
      setIsSubmitting(false);
      return;
    }

    try {
      const userMemoriesRef = ref(db, `users/${currentUser.uid}/memories`);
      const newMemoryRef = push(userMemoriesRef);
      await set(newMemoryRef, {
        title,
        description,
        imageUrl,
        createdAt: new Date().toISOString(),
      });

      alert("Memory created successfully!");
      setTitle("");
      setDescription("");
      setImageFile(null);
    } catch (error) {
      console.error("Error saving memory:", error.message);
      alert("Error saving memory. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Create a Memory</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 border border-gray-300 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Description"
          className="w-full p-2 border border-gray-300 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleImageChange}
          className="w-full p-2"
          required
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full p-2 text-white rounded ${
            isSubmitting ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? "Submitting..." : "Create Memory"}
        </button>
      </form>
    </div>
  );
};

export default CreateMemory;

import React, { useState } from 'react';

const ImageUpload: React.FC = () => {
  const [image, setImage] = useState<File | null>(null); // Type as File or null
  const [preview, setPreview] = useState<string | null>(null); // Type as string or null

  // Handle file input change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Access first file
    if (file) {
      setImage(file);
      // Create a temporary URL for preview
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);

      // Store image as base64 in localStorage
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          localStorage.setItem('uploadedImage', reader.result); // Save base64 string
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Download the image
  const handleDownload = () => {
    if (image && preview) {
      const link = document.createElement('a');
      link.href = preview; // preview is guaranteed to be string
      link.download = image.name; // Use original file name
      link.click();
    }
  };

  return (
    <div>
      <h2>Upload and Preview Image</h2>
      {/* File input for image upload */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />
      {/* Image preview */}
      {preview && (
        <div>
          <h3>Preview:</h3>
          <img src={preview} alt="Uploaded" style={{ maxWidth: '300px' }} />
          <br />
          <button onClick={handleDownload}>Download Image</button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
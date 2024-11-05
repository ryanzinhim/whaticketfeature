import React, { useState } from 'react';

const UploadImage = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.size > 2 * 1024 * 1024) { // Limite de 2MB
        setError("A imagem deve ter no máximo 2MB.");
        return;
      }
      setError(null);
      setImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {preview && (
        <img
          src={preview}
          alt="Preview"
          style={{ maxWidth: "200px" }}
        />
      )}
    </div>
  );
};

export default ImageUploader;

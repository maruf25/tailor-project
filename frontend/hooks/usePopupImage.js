"use client";

import { useState } from "react";

const usePopupImage = () => {
  const [showImage, setShowImage] = useState(false);
  const [image, setImage] = useState(null);

  const handlePopUp = (image) => {
    setShowImage(true);
    setImage(image);
  };

  return {
    showImage,
    handlePopUp,
    setShowImage,
    image,
  };
};

export default usePopupImage;

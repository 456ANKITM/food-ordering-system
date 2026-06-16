import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({ storage });

export const uploadFields = upload.fields([
  { name: "foodImage", maxCount: 1 },
  { name: "logo", maxCount: 1 },
  { name: "coverImage", maxCount: 1 },
]);

import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { uploadsDir, isAllowedImage } from '../utils/data.js';

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (_req, file, cb) => {
    cb(null, `${uuidv4()}${extname(file.originalname).toLowerCase()}`);
  },
});

export const uploadPerfumeImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (isAllowedImage(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG, WEBP, or GIF images are allowed'));
    }
  },
}).single('image');

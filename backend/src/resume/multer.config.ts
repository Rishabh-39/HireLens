import { diskStorage } from 'multer';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';

export const resumeMulterOptions = {
  storage: diskStorage({
    destination: './uploads/resumes',
    filename: (req, file, callback) => {
      const uniqueName = `${randomUUID()}${extname(file.originalname)}`;
      callback(null, uniqueName);
    },
  }),
  fileFilter: (req, file, callback) => {
    const allowed = ['.pdf', '.docx'];
    const ext = extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext)) {
      return callback(new BadRequestException('Only PDF and DOCX files are allowed'), false);
    }
    callback(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
};

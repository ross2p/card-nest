import { FilesInterceptor as NestFilesInterceptor } from '@nestjs/platform-express';
import { UnsupportedMediaTypeException } from '@nestjs/common';
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '../constants.utils';

export const FilesInterceptor = (fileName = "file") => {
  return NestFilesInterceptor(fileName, undefined, {
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: (_req, file, cb) => {
      if (ALLOWED_FILE_TYPES.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new UnsupportedMediaTypeException('Unsupported file type'), false);
      }
    },
  });
};

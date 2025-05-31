const RESPONSE_MESSAGE_KEY = 'responseMessage';
const IS_PUBLIC_KEY = 'isPublic';
const SALT_ROUND = 10;
const MAX_FILE_SIZE = 1024 * 1024 * 10; // 10MB
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'application/pdf',
  'audio/mpeg',
  'video/mp4',
];

export {
  RESPONSE_MESSAGE_KEY,
  IS_PUBLIC_KEY,
  SALT_ROUND,
  MAX_FILE_SIZE,
  ALLOWED_FILE_TYPES,
};

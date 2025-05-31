import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../constants.utils';

export const IsPublic = () => SetMetadata(IS_PUBLIC_KEY, true);

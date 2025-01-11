import { SetMetadata } from '@nestjs/common';

export const SetPermissions = (...permissions: string[]) =>
  SetMetadata('permissions', permissions);

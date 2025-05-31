import { HttpException, NotFoundException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export function CheckExists(error?: string | HttpException) {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const result = originalMethod.apply(this, args);

      const createException = () => {
        if (!error) return new NotFoundException('Record not found');
        if (typeof error === 'string') return new NotFoundException(error);
        return error;
      };

      if (result instanceof Promise) {
        return result.then((data) => {
          if (!data) throw createException();
          return data;
        });
      }

      if (result instanceof Observable) {
        return result.pipe(
          map((data) => {
            if (!data) throw createException();
            return data;
          }),
        );
      }

      if (!result) throw createException();
      return result;
    };

    return descriptor;
  };
}

import { HttpException, NotFoundException } from '@nestjs/common';
import { Observable, isObservable } from 'rxjs';
import { map } from 'rxjs/operators';

type AsyncOrSync<T> = Promise<T> | Observable<T> | T;

export function CheckExists<T>(error?: string | HttpException) {
  return (
    _target: object,
    _propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<(...args: unknown[]) => AsyncOrSync<T>>,
  ) => {
    const originalMethod = descriptor.value;

    if (!originalMethod) return;

    descriptor.value = function (...args: unknown[]) {
      const result = originalMethod.apply(args) as AsyncOrSync<T>;

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

      if (isObservable(result)) {
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
  };
}

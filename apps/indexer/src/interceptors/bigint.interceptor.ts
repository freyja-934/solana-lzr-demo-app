import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class BigIntInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map(data => this.processValue(data)));
  }

  private processValue(value: any): any {
    if (typeof value === 'bigint') {
      return value.toString();
    } else if (Array.isArray(value)) {
      return value.map(item => this.processValue(item));
    } else if (value !== null && typeof value === 'object') {
      const result: any = {};
      for (const key in value) {
        result[key] = this.processValue(value[key]);
      }
      return result;
    }
    return value;
  }
}

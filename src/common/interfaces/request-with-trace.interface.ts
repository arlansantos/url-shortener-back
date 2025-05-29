import { IUserPayload } from './user-payload.interface';

export interface IRequestWithTrace extends Request {
  traceId: string;
  user?: IUserPayload;
}

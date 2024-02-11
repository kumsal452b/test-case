import { Types } from 'mongoose';
import { Headers } from 'src/schemas/header.schema';
export class CreateHeaderDto {
  name: string;
  isParent: boolean;
  hasChildren: Array<Headers>;
  pid:string;
}

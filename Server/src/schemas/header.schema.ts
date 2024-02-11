import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema()
export class Headers {
  @Prop()
  pid: string;
  @Prop()
  name: string;
  @Prop()
  isParent: boolean;
  @Prop()
  isReadyToRemove: boolean;
  @Prop()
  hasChildren: Array<Headers>;
  @Prop({ type: Date, default: Date.now })
  created: Date;
}

export const HeaderSchema = SchemaFactory.createForClass(Headers);

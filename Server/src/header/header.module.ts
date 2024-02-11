import { Module } from "@nestjs/common";
import { HeaderService } from "./header.service";
import { HeaderController } from "./header.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { HeaderSchema,Headers } from "src/schemas/header.schema";

@Module({
  controllers: [HeaderController],
  providers: [HeaderService],
  imports: [
    MongooseModule.forFeature([
      { name: Headers.name, schema: HeaderSchema },
    ]),
  ],
})
export class HeaderModule {}

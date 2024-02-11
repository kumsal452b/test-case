import { Injectable } from "@nestjs/common";
import { CreateHeaderDto } from "./dto/create-header.dto";
import { UpdateHeaderDto } from "./dto/update-header.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Headers } from "../schemas/header.schema";
@Injectable()
export class HeaderService {
  /**
   *
   */
  constructor(@InjectModel(Headers.name) private headerModel: Model<Headers>) {}
  create(createHeaderDto: CreateHeaderDto) {
    return this.headerModel.create(createHeaderDto);
  }

  async findAll() {
    let theHeaders = await this.headerModel.find();
    theHeaders.map((header) => {
      if (header.pid !== null && header.pid !== undefined) {
        let theParent = theHeaders.find(
          (h) => h._id == (header.pid as unknown as Types.ObjectId)
        );
        if (theParent) {
          theParent.hasChildren.push(header);
        }
        header.isReadyToRemove = true;
      }
    });
    theHeaders = theHeaders.filter((h) => h.isReadyToRemove !== true);
    return theHeaders;
  }

  findOne(id: number) {
    return `This action returns a #${id} header`;
  }

  async update(id: string, updateHeaderDto: UpdateHeaderDto) {
    let theHeader = await this.headerModel.findById(id);
    if (theHeader) {
      theHeader.name = updateHeaderDto.name;
      theHeader.isParent = updateHeaderDto.isParent;
      theHeader.pid = updateHeaderDto.pid;
      await theHeader.save();
    }
    return theHeader;
  }
  async updateReOrder(updateHeaderDto: any) {
    for (let i = 0; i < updateHeaderDto.length; i++) {
      const element = updateHeaderDto[i];
      await this.headerModel.deleteOne({ _id: element._id });
      await this.headerModel.insertMany({
        name: element.name,
        isParent: element.isParent,
        pid: element.pid,
        _id: element._id,
      });
    }
    return "Reordered Successfully!";
  }

  async remove(id: string) {
    await this.headerModel.deleteMany({ pid: id });
    return this.headerModel.deleteOne({ _id: id });
  }
}

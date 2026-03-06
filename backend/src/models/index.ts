import { Map } from "./map.model";
import { User } from "./user.model";
import { Space } from "./space.model";
import { Avatar } from "./avatar.model";
import { Element } from "./element.model";
import { MapElements } from "./mapElements.model";
import { SpaceElements } from "./spaceElements.model";
import { getModelForClass } from "@typegoose/typegoose";

export const AvatarModel = getModelForClass(Avatar);
export const ElementModel = getModelForClass(Element);
export const MapModel = getModelForClass(Map);
export const MapElementsModel = getModelForClass(MapElements);
export const SpaceModel = getModelForClass(Space);
export const SpaceElementsModel = getModelForClass(SpaceElements);
export const UserModel = getModelForClass(User);

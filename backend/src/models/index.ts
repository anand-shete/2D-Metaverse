import { getModelForClass } from "@typegoose/typegoose";
import { Avatar } from "./avatar.model";
import { Element } from "./element.model";
import { Map } from "./map.model";
import { MapElements } from "./mapElements.model";
import { Space } from "./space.model";
import { SpaceElements } from "./spaceElements.model";
import { User } from "./user.model";

export const AvatarModel = getModelForClass(Avatar);
export const ElementModel = getModelForClass(Element);
export const MapModel = getModelForClass(Map);
export const MapElementsModel = getModelForClass(MapElements);
export const SpaceModel = getModelForClass(Space);
export const SpaceElementsModel = getModelForClass(SpaceElements);
export const UserModel = getModelForClass(User);

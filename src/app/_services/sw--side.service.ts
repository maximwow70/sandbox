import { SideMetadata } from "../_model/sw--side/sw--side-metadata";
import { SideType } from "../_model/sw--side/sw--side-type.enum";

export class SideService {
    private static metadataList = SideService.initMetadataList();
    private static initMetadataList(): SideMetadata[] {
        const metadataList = [];
        metadataList[SideType.DARK] = new SideMetadata("sw--dark-side");
        metadataList[SideType.LIGHT] = new SideMetadata("sw--light-side");
        return metadataList;
    }

    constructor () {

    }

    public static getSideMetadata(type: SideType): SideMetadata {
        return SideService.metadataList[type];
    }
}

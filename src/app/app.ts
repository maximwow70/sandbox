
import { CustomCursor } from "./sw--cursor/sw--cursor";
import { SectionList } from "./sw--section-list/sw--section-list";
import { DomHelper } from "./_services/sw--dom-helper.service";
import { AliveItemList } from "./sw--item-list/sw--item-list";
import { SideService } from "./_services/sw--side.service";
import { SideType } from "./_model/sw--side/sw--side-type.enum";
import { DynamicEllipsis } from "./_ui/sw--dynamic-ellipsis/sw--dynamic-ellispis";

export class Application {

    private _elementRef: HTMLElement = null;

    private _cursor: CustomCursor = null;
    private _aliveItemList: AliveItemList = null;
    private _sectionList: SectionList = null;

    constructor() {
        this._elementRef = document.querySelector(".sw--application");
        this._cursor = new CustomCursor(this._elementRef.querySelector(".sw--cursor"));
        this.initItemList();
        this.initSectionList();
        this.initChooseSideButtons();
    }

    private initItemList(): void {
        const itemList: HTMLElement[] = DomHelper.getHtmlElementList(this._elementRef, ".navigation--item");

        const itemSizes = itemList[0].getBoundingClientRect();
        const factor = 0.3;
        this._aliveItemList = new AliveItemList(
            this._cursor,
            itemList,
            Math.max(itemSizes.width * factor, itemSizes.height * factor)
        );
    }

    private initSectionList(): void {
        const sectionElementList: HTMLElement[] = DomHelper.getHtmlElementList(this._elementRef, ".sw--section-list--section");
        this._sectionList = new SectionList(sectionElementList);
    }

    private initChooseSideButtons(): void {
        const chooseDarkSideButton = this._elementRef.querySelector(".sw--choice--option.dark");
        const chooseLightSideButton = this._elementRef.querySelector(".sw--choice--option.light");

        const darkMetadata = SideService.getSideMetadata(SideType.DARK);
        const lightMetadata = SideService.getSideMetadata(SideType.LIGHT);

        const checkAndToggleClass = (event, button, metadata) => {
            if (button.contains((event as any).target)) {
                this._elementRef.classList.add(metadata.className);
            } else {
                this._elementRef.classList.remove(metadata.className);
            }
        };

        this._cursor.subscribe((event: MouseEvent) => {
            checkAndToggleClass(event, chooseDarkSideButton, darkMetadata);
            checkAndToggleClass(event, chooseLightSideButton, lightMetadata);
        });

        const DynamicChooseTitle = new DynamicEllipsis(this._elementRef.querySelector(".sw--choice--title"));
    }
}

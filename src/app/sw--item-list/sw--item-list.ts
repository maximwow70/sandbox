import { CustomCursor } from "../sw--cursor/sw--cursor";

export class AliveItemList {
    private static DEFAULT_CONTACT_RADIUS: number = 70;
    private static DEFAULT_GRAVITY_APPROXIMATION: number = 0.6;

    private _cursor: CustomCursor = null;

    private _itemList: HTMLElement[] = [];

    private _contactRadius: number = null;
    private _gravityApproximation: number = null;

    constructor(
        cursor: CustomCursor,
        itemList: HTMLElement[],
        contactRadius: number = AliveItemList.DEFAULT_CONTACT_RADIUS,
        gravityApproximation: number = AliveItemList.DEFAULT_GRAVITY_APPROXIMATION
    ) {
        this._cursor = cursor;

        this._itemList = itemList;

        this._contactRadius = contactRadius;
        this._gravityApproximation = gravityApproximation;

        this._cursor.subscribe(event => this.checkItems(event));
    }

    private setItemPosition(item, deltaX, deltaY): void {
        item.style.left = `${deltaX}px`;
        item.style.top = `${deltaY}px`;
    }

    private isCursorOverItemArea(deltaX, deltaY): boolean {
        return Math.pow(deltaX * this._gravityApproximation, 2) + Math.pow(deltaY * this._gravityApproximation, 2)
            <= Math.pow(this._contactRadius, 2);
    }

    private checkItems(event): void {
        const isCursorOverSomeItem = this._itemList.some((item, index, itemList) => {
            const itemSize = item.getBoundingClientRect();
            const deltaX = (itemSize.left + itemSize.width / 2) - event.clientX;
            const deltaY = (itemSize.top + itemSize.height / 2) - event.clientY;

            const isCursorOverItemArea = this.isCursorOverItemArea(deltaX, deltaY);
            if (isCursorOverItemArea) {
                this.setItemPosition(
                    item,
                    -deltaX * this._gravityApproximation,
                    -deltaY * this._gravityApproximation
                );
                item.style.zIndex = "3";

                itemList.filter((currentItem, i) => itemList.indexOf(item) !== i)
                    .map(currentItem => this.setItemPosition(currentItem, 0, 0));
            } else {
                this.setItemPosition(item, 0, 0);
                item.style.zIndex = "1";
            }
            return isCursorOverItemArea;
        });
    }
};

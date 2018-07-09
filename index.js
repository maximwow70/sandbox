
class CustomCursor {
    constructor(element) {
        this.listeners = [];
        this.element = element;
        this.canClick = true;
        var cursorElementSize = this.element.getBoundingClientRect();

        window.addEventListener("mousemove", event => {
            this.element.style.left = `${Number(event.clientX) - cursorElementSize.width / 2}px`;
            this.element.style.top = `${Number(event.clientY) - cursorElementSize.height / 2}px`;
            this.listeners.map(l => l(event));
        });
        window.addEventListener("click", event => this.onClick());
    }

    subscribe(listener) {
        this.listeners.push(listener);
    }

    addClass(className) {
        this.element.classList.add(className);
    }

    removeClass(className) {
        this.element.classList.remove(className);
    }

    onClick() {
        if (this.canClick) {
            this.canClick = false;
            this.addClass("clicked");
            setTimeout(() => {
                this.removeClass("clicked");
                this.canClick = true;
            }, 1000);
        }
    }
};

const DEFAULT_CONTACT_RADIUS = 70;
const DEFAULT_GRAVITY_APPROXIMATION = 0.6;

class AliveItemList {

    constructor(cursor, itemList, contactRadius, gravityApproximation) {
        this._cursor = cursor;

        this._itemList = itemList;
        this._contactRadius = contactRadius || DEFAULT_CONTACT_RADIUS;
        this._gravityApproximation = gravityApproximation || DEFAULT_GRAVITY_APPROXIMATION;

        cursor.subscribe(event => this.checkItems(event));
    }

    setItemPosition(item, deltaX, deltaY) {
        item.style.left = `${deltaX}px`;
        item.style.top = `${deltaY}px`;
    }

    isCursorOverItemArea(deltaX, deltaY) {
        return Math.pow(deltaX * this._gravityApproximation, 2) + Math.pow(deltaY * this._gravityApproximation, 2)
            <= Math.pow(this._contactRadius, 2);
    }

    checkItems(event) {
        const isCursorOverSomeItem = [...this._itemList].some((item, index, itemList) => {
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
                item.style.zIndex = 3;

                itemList.filter((currentItem, i) => itemList.indexOf(item) !== i)
                    .map(currentItem => this.setItemPosition(currentItem, 0, 0));
            } else {
                this.setItemPosition(item, 0, 0);
                item.style.zIndex = 1;
            }
            return isCursorOverItemArea;
        });
        isCursorOverSomeItem ? this._cursor.addClass("pointer") : this._cursor.removeClass("pointer");
    }
};

class ScrollingSectionList {
    
    constructor(sectionList) {
        this._sectionList = [...sectionList];
        this._selectedSection = this._sectionList[0];

        window.addEventListener("scroll", event => event.preventDefault());

        window.addEventListener("mousewheel", event => {
            event.preventDefault();
            const selectedSectionIndex = this._sectionList.indexOf(this._selectedSection);
            if (event.wheelDelta < 0) {
                this._selectedSection = this._sectionList[Math.min(
                    this._sectionList.length - 1,
                    selectedSectionIndex + 1
                )];
            } else {
                this._selectedSection = this._sectionList[Math.max(
                    0,
                    selectedSectionIndex - 1
                )];
            }
            window.scrollTo(0, this._selectedSection.offsetTop);
        });
    }
}

window.addEventListener("load", () => {
    const cursor = new CustomCursor(document.querySelector(".sw--cursor"));
    const itemList = document.querySelectorAll(".navigation--item");

    const itemSizes = itemList[0].getBoundingClientRect();
    const factor = 0.3;
    const aliveItemList = new AliveItemList(
        cursor,
        itemList,
        Math.max(parseInt(itemSizes.width) * factor, parseInt(itemSizes.height) * factor)
    );

    const scrollingSectionList = new ScrollingSectionList(document.querySelectorAll(".sw--section"));
});

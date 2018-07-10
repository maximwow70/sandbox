import "./styles.scss";

function getHtmlElementList(element, selector): HTMLElement[] {
    return Array.prototype.slice.call(element.querySelectorAll(selector));
}

class CustomCursor {
    private _listeners: any[] = [];
    private _element = null;
    private _canClick = true;

    constructor(element) {
        this._element = element;
        var cursorElementSize = this._element.getBoundingClientRect();

        window.addEventListener("mousemove", event => {
            this._element.style.opacity = "1";
            this._element.style.left = `${Number(event.clientX) - cursorElementSize.width / 2}px`;
            this._element.style.top = `${Number(event.clientY) - cursorElementSize.height / 2}px`;
            this._listeners.map(l => l(event));
        });
        window.addEventListener("click", event => this.onClick());
    }

    public subscribe(listener): void {
        this._listeners.push(listener);
    }

    public addClass(className): void {
        this._element.classList.add(className);
    }

    public removeClass(className): void {
        this._element.classList.remove(className);
    }

    public onClick(): void {
        if (this._canClick) {
            this._canClick = false;
            this.addClass("clicked");
            setTimeout(() => {
                this.removeClass("clicked");
                this._canClick = true;
            }, 1000);
        }
    }
};

const DEFAULT_CONTACT_RADIUS = 70;
const DEFAULT_GRAVITY_APPROXIMATION = 0.6;

class AliveItemList {
    private _cursor = null;

    private _itemList = [];

    private _contactRadius = null;
    private _gravityApproximation = null;

    constructor(cursor, itemList, contactRadius = DEFAULT_CONTACT_RADIUS, gravityApproximation = DEFAULT_GRAVITY_APPROXIMATION) {
        this._cursor = cursor;

        this._itemList = itemList;
        
        this._contactRadius = contactRadius;
        this._gravityApproximation = gravityApproximation;

        this._cursor.subscribe(event => this.checkItems(event));
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

    private _sectionList = [];
    private _selectedSection = null;

    constructor(sectionList) {
        this._sectionList = sectionList;
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
    const itemList: HTMLElement[] = getHtmlElementList(document, ".navigation--item");

    const itemSizes = itemList[0].getBoundingClientRect();
    const factor = 0.3;
    const aliveItemList = new AliveItemList(
        cursor,
        itemList,
        Math.max(itemSizes.width * factor, itemSizes.height * factor)
    );

    const sectionList: HTMLElement[] = getHtmlElementList(document, ".sw--section-list--section");
    const scrollingSectionList = new ScrollingSectionList(sectionList);
});

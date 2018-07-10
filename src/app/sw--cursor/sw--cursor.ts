export enum CustomCursorType {
    POINTER = 0
}

export class CustomCursorMetadata {
    private _styleValue: string = null;
    public get styleValue(): string {
        return this._styleValue;
    }

    constructor(styleValue: string) {
        this._styleValue = styleValue;
    }

    public equals(other: CustomCursorMetadata): boolean {
        return Boolean(other)
            && this.styleValue === other.styleValue;
    }
}

export class CustomCursor {
    private static metadataList: CustomCursorMetadata[] = CustomCursor.initMetadataList();
    private static initMetadataList(): CustomCursorMetadata[] {
        const metadataList = [];
        metadataList[CustomCursorType.POINTER] = new CustomCursorMetadata("pointer");
        return metadataList;
    }

    private POINTER_STYLE_VALUE = this.getMetadata(CustomCursorType.POINTER).styleValue;

    private _listeners: any[] = [];

    private _element = null;
    private _elementSize: ClientRect | DOMRect = null;

    private _canClick = true;

    constructor(element: HTMLElement) {
        this._element = element;
        this._elementSize = this._element.getBoundingClientRect();

        window.addEventListener("mousemove", event => this.mousemoveListener(event));
        window.addEventListener("click", event => this.clickListener());
    }

    private mousemoveListener(event: MouseEvent) {
        this._element.style.opacity = "1";
        this._element.style.left = `${Number(event.clientX) - this._elementSize.width / 2}px`;
        this._element.style.top = `${Number(event.clientY) - this._elementSize.height / 2}px`;

        if (getComputedStyle(event.target as HTMLElement).cursor === this.POINTER_STYLE_VALUE) {
            this.addClass("pointer");
        } else {
            this.removeClass("pointer");
        }

        this._listeners.map(listener => listener(event));
    }

    private clickListener(): void {
        if (this._canClick) {
            this._canClick = false;
            this.addClass("clicked");
            this._listeners.map(listener => listener(event));
            setTimeout(() => {
                this.removeClass("clicked");
                this._canClick = true;
            }, 1000);
        }
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

    public getMetadata(type: CustomCursorType): CustomCursorMetadata {
        return CustomCursor.metadataList[type];
    }
};

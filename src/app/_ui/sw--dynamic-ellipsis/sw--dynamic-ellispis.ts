export class DynamicEllipsis {
    private static MIN_POINTS: number = 0;
    private static MAX_POINTS: number = 3;
    private static UPDATE_SPEED: number = 1000;

    private _element: HTMLElement = null;
    private _pointsElement: HTMLElement = null;
    private _originalInnerText: string = null;

    private _currentPointsCount = DynamicEllipsis.MIN_POINTS;

    private _updateInterval = null;

    constructor(element: HTMLElement) {
        this._element = element;
        this._originalInnerText = this._element.innerText;

        this.updateElement();
        this.setPoints();

        this._updateInterval = setInterval(() => {
            setTimeout(
                this.computeAndSetCurrentPoints(),
                100 * (Math.random() + 0.5)
            );
        }, DynamicEllipsis.UPDATE_SPEED);
    }

    private updateElement(): void {
        this._element.classList.add("sw--dynamic-ellipsis");
        this._element.innerHTML = `
            <span class="sw--dynamic-ellipsis--text">${this._originalInnerText}</span>
            <span class="sw--dynamic-ellipsis--points"></span>
        `;
        this._pointsElement = this._element.querySelector(".sw--dynamic-ellipsis--points");
    }

    private computeAndSetCurrentPoints(): void {
        const nextPointsCount = this._currentPointsCount + 1;
        this._currentPointsCount = nextPointsCount > DynamicEllipsis.MAX_POINTS
            ? DynamicEllipsis.MIN_POINTS
            : nextPointsCount;
        this.setPoints();
    }

    private setPoints(): void {
        this._pointsElement.innerHTML = "&nbsp" + new Array(this._currentPointsCount).fill(".").reduce((a, b) => a + b, "");
    }

    public destroy(): void {
        clearInterval(this._updateInterval);
    }
}

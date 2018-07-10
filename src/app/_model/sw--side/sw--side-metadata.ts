export class SideMetadata {
    private _className: string = null;
    public get className(): string {
        return this._className;
    }

    constructor(className: string) {
        this._className = className;
    }

    public equals(other: SideMetadata): boolean {
        return Boolean(other)
            && this.className === other.className;
    }
}

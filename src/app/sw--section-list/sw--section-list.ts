export class SectionList {

    private _sectionList: HTMLElement[] = [];
    private _selectedSection: HTMLElement = null;

    constructor(sectionList: HTMLElement[]) {
        this._sectionList = sectionList;
        this._selectedSection = this._sectionList[0];

        window.addEventListener("scroll", event => event.preventDefault());

        window.addEventListener("mousewheel", event => this.mousewhellListener(event));
    }

    private mousewhellListener(event) {
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
    }
}

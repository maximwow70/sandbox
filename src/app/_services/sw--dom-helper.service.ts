export class DomHelper {
    public static getHtmlElementList(element: HTMLElement | Document, selector: string): HTMLElement[] {
        return Array.prototype.slice.call(element.querySelectorAll(selector));
    }
}

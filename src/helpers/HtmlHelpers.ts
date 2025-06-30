export function getElementByIdAndSetDisplay(document: Document, id: string, display: string): boolean {
    const element = document.getElementById(id);
    if (element) {
        element.style.display = display;
        return true;
    }
    return false;
}
export function getElementByIdAndSetDisplay(document: Document, id: string, display: string): boolean {
    const element = document.getElementById(id);
    if (element) {
        element.style.display = display;
        return true;
    }
    return false;
}

export function addEventListener(document: Document, eventType: string, id: string, callback: EventListenerOrEventListenerObject): boolean {
    const element = document.getElementById(id);
    if (element) {
        element.addEventListener(eventType, callback);
        return true;
    }
    return false;
}

export function addQueryEventListeners(document: Document, eventType: string, querySelector: string, callback: EventListenerOrEventListenerObject): boolean {
    const elements = document.querySelectorAll(querySelector);
    if (elements) {
        elements.forEach((element) => {
            element.addEventListener(eventType, callback);
        })
        return true;
    }
    return false;
}

export function getElementByIdAndSetInnerHTML(document: Document, id: string, innerHTML: string): boolean {
    const element = document.getElementById(id);
    if (element) {
        element.innerHTML = innerHTML;
        return true;
    }
    return false;
}

export function getElementByIdAndAddChildren(document: Document, id: string, child: HTMLDivElement): boolean {
    const element = document.getElementById(id);
    if (element) {
        element.appendChild(child);
        return true;
    }
    return false;
}

export function getInputElementByIdAndSetValue(document: Document, id: string, value: string): boolean {
    const element = document.getElementById(id);
    if (element && element instanceof HTMLInputElement) {
        element.value = value;
        return true;
    }
    return false;
}

export function setCheckboxCheckedById(document: Document, id: string, checked: boolean): boolean {
    const element = document.getElementById(id);
    if (element && element instanceof HTMLInputElement && element.type === 'checkbox') {
        element.checked = checked;
        return true;
    }
    return false;
}
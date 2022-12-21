import { createElement } from "../../helpers/generic/domElements";

function renderContextMenu(){
    const element = createElement("div", {
        classes: ["context-menu-container"]
    })

    element.innerHTML = `
        <ul id="context-menu-list"></ul>
    `

    return element;
}

export { renderContextMenu }
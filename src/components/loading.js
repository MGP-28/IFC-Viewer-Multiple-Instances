import { buildModal } from "./generic/modal.js";

export default function startLoadingPopup(){
    const modal = buildModal();

    const content = document.createElement("div");
    content.classList.add("modal-loading-container", "hidden");
    content.innerHTML = `
        <i class="fa-solid fa-gear anim-spinner"></i>
        <p>Loading</p>
    `

    modal.addEventListener("loading", () => {
        modal.classList.remove("hidden")
    })

    modal.addEventListener("loadingComplete", () => {
        modal.classList.add("hidden")
    })

    modal.appendChild(content);
}
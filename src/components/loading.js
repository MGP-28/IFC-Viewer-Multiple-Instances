import { buildModal } from "./generic/modal.js";

export default function startLoadingPopup() {
  const modal = buildModal();
  modal.classList.add("hidden");

  const content = document.createElement("div");
  content.classList.add("modal-loading-container");
  content.innerHTML = `
        <i class="fa-solid fa-gear anim-spinner"></i>
        <p>Loading</p>
    `;

  document.addEventListener("loading", () => {
    modal.classList.remove("hidden");
  });

  document.addEventListener("loadingComplete", () => {
    modal.classList.add("hidden");
  });

  modal.appendChild(content);
  document.body.appendChild(modal);
}

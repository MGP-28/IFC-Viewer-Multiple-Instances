import { loadCSS } from "../helpers/generic/cssLoader.js";
import { buildModal } from "./generic/modal.js";

export default function startLoadingPopup() {
  const modal = buildModal();
  modal.classList.add("hidden");

  const content = document.createElement("div");
  content.classList.add("modal-loading-container");
  content.innerHTML = `
    <div class="cube-container">
      <div class="h1Container">
        <div class="cube cube-h1 cube-w1 cube-l1">
          <div class="cube-face cube-top"></div>
          <div class="cube-face cube-left"></div>
          <div class="cube-face cube-right"></div>
        </div>

        <div class="cube cube-h1 cube-w1 cube-l2">
          <div class="cube-face cube-top"></div>
          <div class="cube-face cube-left"></div>
          <div class="cube-face cube-right"></div>
        </div>

        <div class="cube cube-h1 cube-w1 cube-l3">
          <div class="cube-face cube-top"></div>
          <div class="cube-face cube-left"></div>
          <div class="cube-face cube-right"></div>
        </div>

        <div class="cube cube-h1 cube-w2 cube-l1">
          <div class="cube-face cube-top"></div>
          <div class="cube-face cube-left"></div>
          <div class="cube-face cube-right"></div>
        </div>

        <div class="cube cube-h1 cube-w2 cube-l2">
          <div class="cube-face cube-top"></div>
          <div class="cube-face cube-left"></div>
          <div class="cube-face cube-right"></div>
        </div>

        <div class="cube cube-h1 cube-w2 cube-l3">
          <div class="cube-face cube-top"></div>
          <div class="cube-face cube-left"></div>
          <div class="cube-face cube-right"></div>
        </div>

        <div class="cube cube-h1 cube-w3 cube-l1">
          <div class="cube-face cube-top"></div>
          <div class="cube-face cube-left"></div>
          <div class="cube-face cube-right"></div>
        </div>

        <div class="cube cube-h1 cube-w3 cube-l2">
          <div class="cube-face cube-top"></div>
          <div class="cube-face cube-left"></div>
          <div class="cube-face cube-right"></div>
        </div>

        <div class="cube cube-h1 cube-w3 cube-l3">
          <div class="cube-face cube-top"></div>
          <div class="cube-face cube-left"></div>
          <div class="cube-face cube-right"></div>
        </div>
      </div>
      <div class="h2Container">

        <div class="cube cube-h2 cube-w1 cube-l1">
          <div class="cube-face cube-top"></div>
          <div class="cube-face cube-left"></div>
          <div class="cube-face cube-right"></div>
        </div>

        <div class="cube cube-h2 cube-w1 cube-l2">
          <div class="cube-face cube-top"></div>
          <div class="cube-face cube-left"></div>
          <div class="cube-face cube-right"></div>
        </div>

        <div class="cube cube-h2 cube-w1 cube-l3">
          <div class="cube-face cube-top"></div>
          <div class="cube-face cube-left"></div>
          <div class="cube-face cube-right"></div>
        </div>

        <div class="cube cube-h2 cube-w2 cube-l1">
          <div class="cube-face cube-top"></div>
          <div class="cube-face cube-left"></div>
          <div class="cube-face cube-right"></div>
        </div>

        <div class="cube cube-h2 cube-w2 cube-l2">
          <div class="cube-face cube-top"></div>
          <div class="cube-face cube-left"></div>
          <div class="cube-face cube-right"></div>
        </div>

        <div class="cube cube-h2 cube-w2 cube-l3">
          <div class="cube-face cube-top"></div>
          <div class="cube-face cube-left"></div>
          <div class="cube-face cube-right"></div>
        </div>

        <div class="cube cube-h2 cube-w3 cube-l1">
          <div class="cube-face cube-top"></div>
          <div class="cube-face cube-left"></div>
          <div class="cube-face cube-right"></div>
        </div>

        <div class="cube cube-h2 cube-w3 cube-l2">
          <div class="cube-face cube-top"></div>
          <div class="cube-face cube-left"></div>
          <div class="cube-face cube-right"></div>
        </div>

        <div class="cube cube-h2 cube-w3 cube-l3">
          <div class="cube-face cube-top"></div>
          <div class="cube-face cube-left"></div>
          <div class="cube-face cube-right"></div>
        </div>
      </div>

      <div class="h3Container">

        <div class="cube cube-h3 cube-w1 cube-l1">
          <div class="cube-face cube-top"></div>
          <div class="cube-face cube-left"></div>
          <div class="cube-face cube-right"></div>
        </div>

        <div class="cube cube-h3 cube-w1 cube-l2">
          <div class="cube-face cube-top"></div>
          <div class="cube-face cube-left"></div>
          <div class="cube-face cube-right"></div>
        </div>

        <div class="cube cube-h3 cube-w1 cube-l3">
          <div class="cube-face cube-top"></div>
          <div class="cube-face cube-left"></div>
          <div class="cube-face cube-right"></div>
        </div>

        <div class="cube cube-h3 cube-w2 cube-l1">
          <div class="cube-face cube-top"></div>
          <div class="cube-face cube-left"></div>
          <div class="cube-face cube-right"></div>
        </div>

        <div class="cube cube-h3 cube-w2 cube-l2">
          <div class="cube-face cube-top"></div>
          <div class="cube-face cube-left"></div>
          <div class="cube-face cube-right"></div>
        </div>

        <div class="cube cube-h3 cube-w2 cube-l3">
          <div class="cube-face cube-top"></div>
          <div class="cube-face cube-left"></div>
          <div class="cube-face cube-right"></div>
        </div>

        <div class="cube cube-h3 cube-w3 cube-l1">
          <div class="cube-face cube-top"></div>
          <div class="cube-face cube-left"></div>
          <div class="cube-face cube-right"></div>
        </div>

        <div class="cube cube-h3 cube-w3 cube-l2">
          <div class="cube-face cube-top"></div>
          <div class="cube-face cube-left"></div>
          <div class="cube-face cube-right"></div>
        </div>

        <div class="cube cube-h3 cube-w3 cube-l3">
          <div class="cube-face cube-top"></div>
          <div class="cube-face cube-left"></div>
          <div class="cube-face cube-right"></div>
        </div>
      </div>
    </div>
  `;

  document.addEventListener("loading", () => {
    modal.classList.remove("hidden");
  });

  document.addEventListener("loadingComplete", () => {
    modal.classList.add("hidden");
  });

  modal.appendChild(content);

  loadCSS("./src/assets/css/loading.css");

  document.body.appendChild(modal);
}
// import * as SelectionStore from "../stores/selection";

// export default function startObjectDetail() {
//   const div = document.createElement("div");
//   div.classList.add("message-container", "hidden");

//   document.body.appendChild(div);

//   div.innerHTML = `
//         <p class="message">Properties:</p>
//         <pre class="message" id="id-output">None</pre>
//     `;
//   document.addEventListener("selectedChanged", (event) => {
//     const selected = SelectionStore.vars.selected;
//     if (selected.isValid() && !selected.isGroupSelection()) {
//       document.getElementById("id-output").textContent = JSON.stringify(
//         selected.props,
//         null,
//         2
//       );
//       div.classList.remove("hidden");
//     } else div.classList.add("hidden");
//   });
// }

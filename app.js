import {
  Raycaster,
  Vector2
} from "three";
import {IFCLoader} from "web-ifc-three/IFCLoader";
import buildScene from "./src/helpers/buildScene";
import RaycastIntersectObject from "./src/models/raycastIntersectObject";
import * as RaycastFoundStored from "./src/stores/raycastFound";
import * as Stored from "./src/stores/scene";

buildScene();

//Sets up the IFC loading
const ifcModels = [];
const ifcLoaders = [];
//ifcLoader.ifcManager.setWasmPath("./wasm");

const input = document.getElementById("file-input");
  input.addEventListener("change",
    (event) => {
      const _ifcLoaders = [];
      for (let idx = 0; idx < event.target.files.length; idx++) {
        const ifcURL = URL.createObjectURL(event.target.files[idx]);
        console.log(event.target.files[idx])
        const ifcLoader = new IFCLoader();
        ifcLoader.load(ifcURL, (ifcModel) => {
            ifcModels.push(ifcModel);
            Stored.scene.add(ifcModel);
          } 
        );
        _ifcLoaders.push(ifcLoader)
      }

      waitLoad()

      function waitLoad(){
        if(event.target.files.length > ifcModels.length){
          setTimeout(() => {
            waitLoad()
          }, 1000);
        }
        else{
          reorderArrays()
        }
      } 

      function reorderArrays(){
        console.log('rawLoaders', _ifcLoaders)
        for (let idx = 0; idx < ifcModels.length; idx++) {
          console.log('cycling')
          const correspondingLoader = _ifcLoaders.find(x => ifcModels[idx].uuid == x.ifcManager.state.models[0].mesh.uuid)
          ifcLoaders.push(correspondingLoader)
        }
        console.log('models', ifcModels)
        console.log('loaders', ifcLoaders)
      }
    },
    false
  );

const raycaster = new Raycaster();
raycaster.firstHitOnly = true;
const mouse = new Vector2();
const output = document.getElementById("id-output");

async function pick(event) {
  cast(event);

  console.log('found', RaycastFoundStored.found);

  if (RaycastFoundStored.isFoundValid) {
      const index = RaycastFoundStored.found.object.faceIndex;
      const geometry = RaycastFoundStored.found.object.object.geometry;

      const ifcLoader = ifcLoaders[ RaycastFoundStored.found.idx ];
      const id = ifcLoader.ifcManager.getExpressId(geometry, index);
      const props = await ifcLoader.ifcManager.getItemProperties(0, id);

      output.innerHTML = JSON.stringify(props, null, 2);
  }
}

function cast(event) {

  // Computes the position of the mouse on the screen
  const bounds = Stored.threeCanvas.getBoundingClientRect();

  const x1 = event.clientX - bounds.left;
  const x2 = bounds.right - bounds.left;
  mouse.x = (x1 / x2) * 2 - 1;

  const y1 = event.clientY - bounds.top;
  const y2 = bounds.bottom - bounds.top;
  mouse.y = -(y1 / y2) * 2 + 1;

  // Places it on the camera pointing to the mouse
  raycaster.setFromCamera(mouse, Stored.camera);

  // Casts a ray
  castEachModel(raycaster);
}

async function castEachModel(raycaster){
  const results = [];
  for (let idx = 0; idx < ifcModels.length; idx++) {
    const arr = [ ifcModels[idx] ];
    const result = raycaster.intersectObjects(arr)[0];
    const intersectiongObj = new RaycastIntersectObject(result, idx)
    if(result) results.push(intersectiongObj);
  }

  console.log(results)

  if(results.length > 0){
    const minDistance = Math.min( ...results.map( x => x.object.distance ) );
    const found = results.find( x => x.object.distance == minDistance );
    RaycastFoundStored.setFound(found)
  }
  else RaycastFoundStored.resetFound();
}

window.ondblclick = pick;
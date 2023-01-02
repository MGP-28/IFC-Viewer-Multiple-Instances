import * as SceneStore from '../stores/scene'

function add2DObjectToScene(object2D){
    SceneStore.renderer2D.group.add(object2D);
}

function remove2DObjectFromScene(object2D){
    object2D.removeFromParent();
}

export { add2DObjectToScene, remove2DObjectFromScene }
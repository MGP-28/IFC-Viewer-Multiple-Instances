import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const CAPS = {
  MATERIAL: {
    sheet: new THREE.ShaderMaterial({
      uniforms: CAPS.UNIFORMS.clipping,
      vertexShader: CAPS.SHADER.vertexClipping,
      fragmentShader: CAPS.SHADER.fragmentClipping,
    }),

    cap: new THREE.ShaderMaterial({
      uniforms: CAPS.UNIFORMS.caps,
      vertexShader: CAPS.SHADER.vertex,
      fragmentShader: CAPS.SHADER.fragment,
    }),

    backStencil: new THREE.ShaderMaterial({
      uniforms: CAPS.UNIFORMS.clipping,
      vertexShader: CAPS.SHADER.vertexClipping,
      fragmentShader: CAPS.SHADER.fragmentClippingFront,
      colorWrite: false,
      depthWrite: false,
      side: THREE.BackSide,
    }),

    frontStencil: new THREE.ShaderMaterial({
      uniforms: CAPS.UNIFORMS.clipping,
      vertexShader: CAPS.SHADER.vertexClipping,
      fragmentShader: CAPS.SHADER.fragmentClippingFront,
      colorWrite: false,
      depthWrite: false,
    }),

    BoxBackFace: new THREE.MeshBasicMaterial({
      color: 0xeeddcc,
      transparent: true,
    }),
    BoxWireframe: new THREE.LineBasicMaterial({
      color: 0x000000,
      linewidth: 2,
    }),
    BoxWireActive: new THREE.LineBasicMaterial({
      color: 0xf83610,
      linewidth: 4,
    }),

    Invisible: new THREE.ShaderMaterial({
      vertexShader: CAPS.SHADER.invisibleVertexShader,
      fragmentShader: CAPS.SHADER.invisibleFragmentShader,
    }),
  },
  picking(simulation) {
    var intersected = null;
    var mouse = new THREE.Vector2();
    var ray = new THREE.Raycaster();

    var normals = {
      x1: new THREE.Vector3(-1, 0, 0),
      x2: new THREE.Vector3(1, 0, 0),
      y1: new THREE.Vector3(0, -1, 0),
      y2: new THREE.Vector3(0, 1, 0),
      z1: new THREE.Vector3(0, 0, -1),
      z2: new THREE.Vector3(0, 0, 1),
    };

    var plane = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100, 4, 4),
      CAPS.MATERIAL.Invisible
    );
    simulation.scene.add(plane);

    var targeting = function (event) {
      mouse.setToNormalizedDeviceCoordinates(event, window);

      ray.setFromCamera(mouse, simulation.camera);

      var intersects = ray.intersectObjects(simulation.selection.selectables);

      if (intersects.length > 0) {
        var candidate = intersects[0].object;

        if (intersected !== candidate) {
          if (intersected !== null) {
            intersected.guardian.rayOut();
          }

          candidate.guardian.rayOver();

          intersected = candidate;

          simulation.renderer.domElement.style.cursor = "pointer";
          simulation.throttledRender();
        }
      } else if (intersected !== null) {
        intersected.guardian.rayOut();
        intersected = null;

        simulation.renderer.domElement.style.cursor = "auto";
        simulation.throttledRender();
      }
    };

    var beginDrag = function (event) {
      mouse.setToNormalizedDeviceCoordinates(event, window);

      ray.setFromCamera(mouse, simulation.camera);

      var intersects = ray.intersectObjects(simulation.selection.selectables);

      if (intersects.length > 0) {
        event.preventDefault();
        event.stopPropagation();

        simulation.controls.enabled = false;

        var intersectionPoint = intersects[0].point;

        var axis = intersects[0].object.axis;

        if (axis === "x1" || axis === "x2") {
          intersectionPoint.setX(0);
        } else if (axis === "y1" || axis === "y2") {
          intersectionPoint.setY(0);
        } else if (axis === "z1" || axis === "z2") {
          intersectionPoint.setZ(0);
        }
        plane.position.copy(intersectionPoint);

        var newNormal = simulation.camera.position
          .clone()
          .sub(
            simulation.camera.position.clone().projectOnVector(normals[axis])
          );
        plane.lookAt(newNormal.add(intersectionPoint));

        simulation.renderer.domElement.style.cursor = "move";
        simulation.throttledRender();

        var continueDrag = function (event) {
          event.preventDefault();
          event.stopPropagation();

          mouse.setToNormalizedDeviceCoordinates(event, window);

          ray.setFromCamera(mouse, simulation.camera);

          var intersects = ray.intersectObject(plane);

          if (intersects.length > 0) {
            if (axis === "x1" || axis === "x2") {
              value = intersects[0].point.x;
            } else if (axis === "y1" || axis === "y2") {
              value = intersects[0].point.y;
            } else if (axis === "z1" || axis === "z2") {
              value = intersects[0].point.z;
            }

            simulation.selection.setValue(axis, value);
            simulation.throttledRender();
          }
        };

        var endDrag = function (event) {
          simulation.controls.enabled = true;

          simulation.renderer.domElement.style.cursor = "pointer";

          document.removeEventListener("mousemove", continueDrag, true);
          document.removeEventListener("touchmove", continueDrag, true);

          document.removeEventListener("mouseup", endDrag, false);
          document.removeEventListener("touchend", endDrag, false);
          document.removeEventListener("touchcancel", endDrag, false);
          document.removeEventListener("touchleave", endDrag, false);
        };

        document.addEventListener("mousemove", continueDrag, true);
        document.addEventListener("touchmove", continueDrag, true);

        document.addEventListener("mouseup", endDrag, false);
        document.addEventListener("touchend", endDrag, false);
        document.addEventListener("touchcancel", endDrag, false);
        document.addEventListener("touchleave", endDrag, false);
      }
    };

    simulation.renderer.domElement.addEventListener(
      "mousemove",
      targeting,
      true
    );
    simulation.renderer.domElement.addEventListener(
      "mousedown",
      beginDrag,
      false
    );
    simulation.renderer.domElement.addEventListener(
      "touchstart",
      beginDrag,
      false
    );
  },
  PlaneGeometry(v0, v1, v2, v3) {
    THREE.Geometry.call(this);

    this.vertices.push(v0, v1, v2, v3);
    this.faces.push(new THREE.Face3(0, 1, 2));
    this.faces.push(new THREE.Face3(0, 2, 3));

    this.computeFaceNormals();
    this.computeVertexNormals();
  },
  SCHEDULE: {
    postpone: function (callback, context, wait) {
      return function () {
        setTimeout(function () {
          callback.apply(context, arguments);
        }, wait);
      };
    },

    deferringThrottle: function (callback, context, wait) {
      // wait 60 = 16fps // wait 40 = 25fps // wait 20 = 50fps

      var execute = function (inArgs) {
        callback.apply(context, inArgs);
        setTimeout(function () {
          if (deferredCalls) {
            deferredCalls = false;
            execute(args);
          } else {
            blocked = false;
          }
        }, wait);
      };

      var blocked = false;
      var deferredCalls = false;
      var args = undefined;

      return function () {
        if (blocked) {
          args = arguments;
          deferredCalls = true;
          return;
        } else {
          blocked = true;
          deferredCalls = false;
          execute(arguments);
        }
      };
    },
  },
  Selection(low, high) {
    this.limitLow = low;
    this.limitHigh = high;

    this.box = new THREE.BoxGeometry(1, 1, 1);
    this.boxMesh = new THREE.Mesh(this.box, CAPS.MATERIAL.cap);

    this.vertices = [
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
    ];
    this.updateVertices();

    var v = this.vertices;

    this.touchMeshes = new THREE.Object3D();
    this.displayMeshes = new THREE.Object3D();
    this.meshGeometries = [];
    this.lineGeometries = [];
    this.selectables = [];

    this.faces = [];
    var f = this.faces;
    this.faces.push(
      new CAPS.SelectionBoxFace("y1", v[0], v[1], v[5], v[4], this)
    );
    this.faces.push(
      new CAPS.SelectionBoxFace("z1", v[0], v[2], v[3], v[1], this)
    );
    this.faces.push(
      new CAPS.SelectionBoxFace("x1", v[0], v[4], v[6], v[2], this)
    );
    this.faces.push(
      new CAPS.SelectionBoxFace("x2", v[7], v[5], v[1], v[3], this)
    );
    this.faces.push(
      new CAPS.SelectionBoxFace("y2", v[7], v[3], v[2], v[6], this)
    );
    this.faces.push(
      new CAPS.SelectionBoxFace("z2", v[7], v[6], v[4], v[5], this)
    );

    var l0 = new CAPS.SelectionBoxLine(v[0], v[1], f[0], f[1], this);
    var l1 = new CAPS.SelectionBoxLine(v[0], v[2], f[1], f[2], this);
    var l2 = new CAPS.SelectionBoxLine(v[0], v[4], f[0], f[2], this);
    var l3 = new CAPS.SelectionBoxLine(v[1], v[3], f[1], f[3], this);
    var l4 = new CAPS.SelectionBoxLine(v[1], v[5], f[0], f[3], this);
    var l5 = new CAPS.SelectionBoxLine(v[2], v[3], f[1], f[4], this);
    var l6 = new CAPS.SelectionBoxLine(v[2], v[6], f[2], f[4], this);
    var l7 = new CAPS.SelectionBoxLine(v[3], v[7], f[3], f[4], this);
    var l8 = new CAPS.SelectionBoxLine(v[4], v[5], f[0], f[5], this);
    var l9 = new CAPS.SelectionBoxLine(v[4], v[6], f[2], f[5], this);
    var l10 = new CAPS.SelectionBoxLine(v[5], v[7], f[3], f[5], this);
    var l11 = new CAPS.SelectionBoxLine(v[6], v[7], f[4], f[5], this);

    this.setBox();
    this.setUniforms();
  },
  SelectionBoxFace(axis, v0, v1, v2, v3, selection) {
    var frontFaceGeometry = new CAPS.PlaneGeometry(v0, v1, v2, v3);
    frontFaceGeometry.dynamic = true;
    selection.meshGeometries.push(frontFaceGeometry);

    var frontFaceMesh = new THREE.Mesh(
      frontFaceGeometry,
      CAPS.MATERIAL.Invisible
    );
    frontFaceMesh.axis = axis;
    frontFaceMesh.guardian = this;
    selection.touchMeshes.add(frontFaceMesh);
    selection.selectables.push(frontFaceMesh);

    var backFaceGeometry = new CAPS.PlaneGeometry(v3, v2, v1, v0);
    backFaceGeometry.dynamic = true;
    selection.meshGeometries.push(backFaceGeometry);

    var backFaceMesh = new THREE.Mesh(
      backFaceGeometry,
      CAPS.MATERIAL.BoxBackFace
    );
    selection.displayMeshes.add(backFaceMesh);

    this.lines = new Array();
  },
  SelectionBoxLine(v0, v1, f0, f1, selection) {
    var lineGeometry = new THREE.Geometry();
    lineGeometry.vertices.push(v0, v1);
    lineGeometry.computeLineDistances();
    lineGeometry.dynamic = true;
    selection.lineGeometries.push(lineGeometry);

    this.line = new THREE.LineSegments(
      lineGeometry,
      CAPS.MATERIAL.BoxWireframe
    );
    selection.displayMeshes.add(this.line);

    f0.lines.push(this);
    f1.lines.push(this);
  },
  SHADER: {
    vertex:
      "\
          uniform vec3 color;\
          varying vec3 pixelNormal;\
          \
          void main() {\
              \
              pixelNormal = normal;\
              gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\
              \
          }",

    vertexClipping:
      "\
          uniform vec3 color;\
          uniform vec3 clippingLow;\
          uniform vec3 clippingHigh;\
          \
          varying vec3 pixelNormal;\
          varying vec4 worldPosition;\
          varying vec3 camPosition;\
          \
          void main() {\
              \
              pixelNormal = normal;\
              worldPosition = modelMatrix * vec4( position, 1.0 );\
              camPosition = cameraPosition;\
              \
              gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\
              \
          }",

    fragment:
      "\
          uniform vec3 color;\
          varying vec3 pixelNormal;\
          \
          void main( void ) {\
              \
              float shade = (\
                    3.0 * pow ( abs ( pixelNormal.y ), 2.0 )\
                  + 2.0 * pow ( abs ( pixelNormal.z ), 2.0 )\
                  + 1.0 * pow ( abs ( pixelNormal.x ), 2.0 )\
              ) / 3.0;\
              \
              gl_FragColor = vec4( color * shade, 1.0 );\
              \
          }",

    fragmentClipping:
      "\
          uniform vec3 color;\
          uniform vec3 clippingLow;\
          uniform vec3 clippingHigh;\
          \
          varying vec3 pixelNormal;\
          varying vec4 worldPosition;\
          \
          void main( void ) {\
              \
              float shade = (\
                    3.0 * pow ( abs ( pixelNormal.y ), 2.0 )\
                  + 2.0 * pow ( abs ( pixelNormal.z ), 2.0 )\
                  + 1.0 * pow ( abs ( pixelNormal.x ), 2.0 )\
              ) / 3.0;\
              \
              if (\
                     worldPosition.x < clippingLow.x\
                  || worldPosition.x > clippingHigh.x\
                  || worldPosition.y < clippingLow.y\
                  || worldPosition.y > clippingHigh.y\
                  || worldPosition.z < clippingLow.z\
                  || worldPosition.z > clippingHigh.z\
              ) {\
                  \
                  discard;\
                  \
              } else {\
                  \
                  gl_FragColor = vec4( color * shade, 1.0 );\
                  \
              }\
              \
          }",

    fragmentClippingFront:
      "\
          uniform vec3 color;\
          uniform vec3 clippingLow;\
          uniform vec3 clippingHigh;\
          \
          varying vec3 pixelNormal;\
          varying vec4 worldPosition;\
          varying vec3 camPosition;\
          \
          void main( void ) {\
              \
              float shade = (\
                    3.0 * pow ( abs ( pixelNormal.y ), 2.0 )\
                  + 2.0 * pow ( abs ( pixelNormal.z ), 2.0 )\
                  + 1.0 * pow ( abs ( pixelNormal.x ), 2.0 )\
              ) / 3.0;\
              \
              if (\
                     worldPosition.x < clippingLow.x  && camPosition.x < clippingLow.x\
                  || worldPosition.x > clippingHigh.x && camPosition.x > clippingHigh.x\
                  || worldPosition.y < clippingLow.y  && camPosition.y < clippingLow.y\
                  || worldPosition.y > clippingHigh.y && camPosition.y > clippingHigh.y\
                  || worldPosition.z < clippingLow.z  && camPosition.z < clippingLow.z\
                  || worldPosition.z > clippingHigh.z && camPosition.z > clippingHigh.z\
              ) {\
                  \
                  discard;\
                  \
              } else {\
                  \
                  gl_FragColor = vec4( color * shade, 1.0 );\
                  \
              }\
              \
          }",

    invisibleVertexShader:
      "\
          void main() {\
              vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\
              gl_Position = projectionMatrix * mvPosition;\
          }",

    invisibleFragmentShader:
      "\
          void main( void ) {\
              gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );\
              discard;\
          }",
  },
  Simulation() {
    this.scene = undefined;
    this.capsScene = undefined;
    this.backStencil = undefined;
    this.frontStencil = undefined;

    this.camera = undefined;
    this.renderer = undefined;
    this.controls = undefined;

    this.showCaps = true;

    this.init();
  },
  UNIFORMS: {
    clipping: {
      color: { type: "c", value: new THREE.Color(0x3d9ecb) },
      clippingLow: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
      clippingHigh: { type: "v3", value: new THREE.Vector3(0, 0, 0) },
    },

    caps: {
      color: { type: "c", value: new THREE.Color(0xf83610) },
    },
  },
};

CAPS.PlaneGeometry.prototype = new THREE.Geometry();
CAPS.PlaneGeometry.prototype.constructor = CAPS.PlaneGeometry;

CAPS.Selection.prototype = {
  constructor: CAPS.Selection,

  updateVertices: function () {
    this.vertices[0].set(this.limitLow.x, this.limitLow.y, this.limitLow.z);
    this.vertices[1].set(this.limitHigh.x, this.limitLow.y, this.limitLow.z);
    this.vertices[2].set(this.limitLow.x, this.limitHigh.y, this.limitLow.z);
    this.vertices[3].set(this.limitHigh.x, this.limitHigh.y, this.limitLow.z);
    this.vertices[4].set(this.limitLow.x, this.limitLow.y, this.limitHigh.z);
    this.vertices[5].set(this.limitHigh.x, this.limitLow.y, this.limitHigh.z);
    this.vertices[6].set(this.limitLow.x, this.limitHigh.y, this.limitHigh.z);
    this.vertices[7].set(this.limitHigh.x, this.limitHigh.y, this.limitHigh.z);
  },

  updateGeometries: function () {
    for (var i = 0; i < this.meshGeometries.length; i++) {
      this.meshGeometries[i].verticesNeedUpdate = true;
      this.meshGeometries[i].computeBoundingSphere();
      this.meshGeometries[i].computeBoundingBox();
    }
    for (var i = 0; i < this.lineGeometries.length; i++) {
      this.lineGeometries[i].verticesNeedUpdate = true;
    }
  },

  setBox: function () {
    var width = new THREE.Vector3();
    width.subVectors(this.limitHigh, this.limitLow);

    this.boxMesh.scale.copy(width);
    width.multiplyScalar(0.5).add(this.limitLow);
    this.boxMesh.position.copy(width);
  },

  setUniforms: function () {
    var uniforms = CAPS.UNIFORMS.clipping;
    uniforms.clippingLow.value.copy(this.limitLow);
    uniforms.clippingHigh.value.copy(this.limitHigh);
  },

  setValue: function (axis, value) {
    var buffer = 0.4;
    var limit = 14;

    if (axis === "x1") {
      this.limitLow.x = Math.max(
        -limit,
        Math.min(this.limitHigh.x - buffer, value)
      );
    } else if (axis === "x2") {
      this.limitHigh.x = Math.max(
        this.limitLow.x + buffer,
        Math.min(limit, value)
      );
    } else if (axis === "y1") {
      this.limitLow.y = Math.max(
        -limit,
        Math.min(this.limitHigh.y - buffer, value)
      );
    } else if (axis === "y2") {
      this.limitHigh.y = Math.max(
        this.limitLow.y + buffer,
        Math.min(limit, value)
      );
    } else if (axis === "z1") {
      this.limitLow.z = Math.max(
        -limit,
        Math.min(this.limitHigh.z - buffer, value)
      );
    } else if (axis === "z2") {
      this.limitHigh.z = Math.max(
        this.limitLow.z + buffer,
        Math.min(limit, value)
      );
    }

    this.setBox();
    this.setUniforms();

    this.updateVertices();
    this.updateGeometries();
  },
};

CAPS.SelectionBoxFace.prototype = {
  constructor: CAPS.SelectionBoxFace,

  rayOver: function () {
    this.highlightLines(true);
  },

  rayOut: function () {
    this.highlightLines(false);
  },

  highlightLines: function (b) {
    for (var i = 0; i < this.lines.length; i++) {
      this.lines[i].setHighlight(b);
    }
  },
};

CAPS.SelectionBoxLine.prototype = {
  constructor: CAPS.SelectionBoxLine,

  setHighlight: function (b) {
    this.line.material = b
      ? CAPS.MATERIAL.BoxWireActive
      : CAPS.MATERIAL.BoxWireframe;
  },
};

CAPS.Simulation.prototype = {
  constructor: CAPS.Simulation,

  init: function () {
    var self = this;

    var loader = new THREE.ColladaLoader();
    loader.options.convertUpAxis = true;
    loader.load("./house.dae", function (collada) {
      self.initScene(collada.scene);
    });

    var container = document.createElement("div");
    document.body.appendChild(container);

    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      2000
    );
    this.camera.position.set(20, 20, 30);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.scene = new THREE.Scene();
    this.capsScene = new THREE.Scene();
    this.backStencil = new THREE.Scene();
    this.frontStencil = new THREE.Scene();

    this.selection = new CAPS.Selection(
      new THREE.Vector3(-7, -14, -14),
      new THREE.Vector3(14, 9, 3)
    );
    this.capsScene.add(this.selection.boxMesh);
    this.scene.add(this.selection.touchMeshes);
    this.scene.add(this.selection.displayMeshes);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0xffffff);
    this.renderer.autoClear = false;
    container.appendChild(this.renderer.domElement);

    var throttledRender = CAPS.SCHEDULE.deferringThrottle(
      this._render,
      this,
      40
    );
    this.throttledRender = throttledRender;

    CAPS.picking(this); // must come before OrbitControls, so it can cancel them

    this.controls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );
    this.controls.addEventListener("change", throttledRender);

    var onWindowResize = function () {
      self.camera.aspect = window.innerWidth / window.innerHeight;
      self.camera.updateProjectionMatrix();
      self.renderer.setSize(window.innerWidth, window.innerHeight);
      throttledRender();
    };
    window.addEventListener("resize", onWindowResize, false);

    var showCapsInput = document.getElementById("showCaps");
    this.showCaps = showCapsInput.checked;
    var onShowCaps = function () {
      self.showCaps = showCapsInput.checked;
      throttledRender();
    };
    showCapsInput.addEventListener("change", onShowCaps, false);

    throttledRender();
  },

  initScene: function (collada) {
    var setMaterial = function (node, material) {
      node.material = material;
      if (node.children) {
        for (var i = 0; i < node.children.length; i++) {
          setMaterial(node.children[i], material);
        }
      }
    };

    var back = collada.clone();
    setMaterial(back, CAPS.MATERIAL.backStencil);
    back.scale.set(0.03, 0.03, 0.03);
    back.updateMatrix();
    this.backStencil.add(back);

    var front = collada.clone();
    setMaterial(front, CAPS.MATERIAL.frontStencil);
    front.scale.set(0.03, 0.03, 0.03);
    front.updateMatrix();
    this.frontStencil.add(front);

    setMaterial(collada, CAPS.MATERIAL.sheet);
    collada.scale.set(0.03, 0.03, 0.03);
    collada.updateMatrix();
    this.scene.add(collada);

    this.throttledRender();
  },

  _render: function () {
    this.renderer.clear();

    var gl = this.renderer.context;

    if (this.showCaps) {
      this.renderer.state.setStencilTest(true);

      this.renderer.state.setStencilFunc(gl.ALWAYS, 1, 0xff);
      this.renderer.state.setStencilOp(gl.KEEP, gl.KEEP, gl.INCR);
      this.renderer.render(this.backStencil, this.camera);

      this.renderer.state.setStencilFunc(gl.ALWAYS, 1, 0xff);
      this.renderer.state.setStencilOp(gl.KEEP, gl.KEEP, gl.DECR);
      this.renderer.render(this.frontStencil, this.camera);

      this.renderer.state.setStencilFunc(gl.EQUAL, 1, 0xff);
      this.renderer.state.setStencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
      this.renderer.render(this.capsScene, this.camera);

      this.renderer.state.setStencilTest(false);
    }

    this.renderer.render(this.scene, this.camera);
  },
};
export { CAPS };

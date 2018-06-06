
import Scene from 'Scene';
import console from 'Diagnostics';
import Reactive from 'Reactive';
import TouchGestures from 'TouchGestures';
import DeviceMotion from 'DeviceMotion';
import CameraInfo from 'CameraInfo';
import Materials from 'Materials';

import getObjects from './get-objects';

const planes = getObjects();
const camera = Scene.root.find('Camera');
const out = Scene.root.find('outputText');
const planeTracker = Scene.root.find('planeTracker');
const materialNotDropped = Materials.get('HeyMaterialPreDrop');
const materialDropped = Materials.get('HeyMaterial');


const center = Reactive.point2d(
  CameraInfo.previewSize.width.mul(0.5),
  CameraInfo.previewSize.height.mul(0.5),
);

const centerProjected = Scene.unprojectToFocalPlane(center);

let index = 0;
let currentPlane;

out.text = Reactive.val("Confidence: ").concat(planeTracker.confidence);

changeCurrentPlane();

TouchGestures.onTap().subscribe((event) => {
  changeCurrentPlane();
});

function changeCurrentPlane() {
  if (currentPlane) {
    makePlaneStick(currentPlane);
    currentPlane.material = materialDropped;
  }

  console.log(`Active Plane: plane${index}`);

  currentPlane = planes.objects[index];

  currentPlane.material = materialNotDropped;
  currentPlane.hidden = Reactive.val(false);

  makePlaneFollow(currentPlane);

  index = (index + 1) % planes.objects.length;
}

function radToDeg(rad) {
  return rad.mul(Reactive.val(180).div(Reactive.val(Math.PI)));
}

function makePlaneFollow(plane) {
  const planePosition = Reactive.point(
    DeviceMotion.worldTransform.x.add(centerProjected.x),
    DeviceMotion.worldTransform.y.add(centerProjected.y),
    DeviceMotion.worldTransform.z.add(centerProjected.z),
  );

  plane.transform.position = planePosition;
}

function makePlaneStick(plane) {
  const worldPosition = Reactive.point(
    DeviceMotion.worldTransform.x.pin().add(centerProjected.x.pin()),
    DeviceMotion.worldTransform.y.pin().add(centerProjected.y.pin()),
    DeviceMotion.worldTransform.z.pin().add(centerProjected.z.pin()),
  );

  plane.transform.position = worldPosition;
}

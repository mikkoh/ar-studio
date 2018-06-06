
import Scene from 'Scene';
import console from 'Diagnostics';
import Reactive from 'Reactive';
import TouchGestures from 'TouchGestures';
import DeviceMotion from 'DeviceMotion';
import CameraInfo from 'CameraInfo';
import Materials from 'Materials';

import getObjects from './get-objects';

const planes = getObjects('plane');
const camera = Scene.root.find('Camera');
const out = Scene.root.find('outputText');
const planeTracker = Scene.root.find('planeTracker');

const materialsNotDropped = [
  Materials.get('GreenMaterialNotDropped'),
  Materials.get('BlueMaterialNotDropped'),
  Materials.get('RedMaterialNotDropped'),
];
const materialsDropped = [
  Materials.get('GreenMaterial'),
  Materials.get('BlueMaterial'),
  Materials.get('RedMaterial'),
];

const center = Reactive.point2d(
  CameraInfo.previewSize.width.mul(0.5),
  CameraInfo.previewSize.height.mul(0.5),
);

const centerProjected = Scene.unprojectToFocalPlane(center);

let index = 0;
let currentPlane;

out.text = Reactive.val("Confidence: ").concat(planeTracker.confidence);

hideAllPlanes();
changeCurrentPlane();

TouchGestures.onTap().subscribe((event) => {
  changeCurrentPlane();
});

function changeCurrentPlane() {
  const currentMaterialIdx = index;
  const previousMaterialIdx = index - 1 >= 0 ? index - 1 : planes.length - 1;

  if (currentPlane) {
    makePlaneStick(currentPlane);
    currentPlane.material = materialsDropped[previousMaterialIdx % materialsDropped.length];
  }

  currentPlane = planes[index];

  currentPlane.material = materialsNotDropped[currentMaterialIdx % materialsNotDropped.length];
  currentPlane.hidden = Reactive.val(false);

  makePlaneFollow(currentPlane);

  index = (index + 1) % planes.length;
}

function hideAllPlanes() {
  planes.forEach((plane) => {
    plane.hidden = Reactive.val(true);
  });
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

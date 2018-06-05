
import Scene from 'Scene';
import console from 'Diagnostics';
import Reactive from 'Reactive';
import TouchGestures from 'TouchGestures';
import DeviceMotion from 'DeviceMotion';

import getObjects from './get-objects';

const planes = getObjects();
const camera = Scene.root.find('Camera');
const out = Scene.root.find('outputText');
const planeTracker = Scene.root.find('planeTracker');

out.text = planeTracker.confidence;

let index = 0;

TouchGestures.onTap().subscribe((event) => {
  const plane = planes.objects[index];
  const location = Reactive.point2d(
    Reactive.val(event.location.x),
    Reactive.val(event.location.y),
  );
  const projected = Scene.unprojectToFocalPlane(location);

  const worldPosition = Reactive.point(
    DeviceMotion.worldTransform.x.pin().add(projected.x.pin()),
    DeviceMotion.worldTransform.y.pin().add(projected.y.pin()),
    DeviceMotion.worldTransform.z.pin().add(projected.z.pin()),
  );

  plane.hidden = Reactive.val(false);

  plane.transform.position = worldPosition;

  plane.transform.rotationX = DeviceMotion.worldTransform.rotationX.pin();
  plane.transform.rotationY = DeviceMotion.worldTransform.rotationY.pin();
  plane.transform.rotationZ = DeviceMotion.worldTransform.rotationZ.pin();

  index = (index + 1) % planes.objects.length;
});

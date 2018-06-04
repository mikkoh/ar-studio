
import Scene from 'Scene';
import console from 'Diagnostics';
import Reactive from 'Reactive';
import TouchGestures from 'TouchGestures';
import DeviceMotion from 'DeviceMotion';

import getObjects from './get-objects';

const planes = getObjects();

let index = 0;

TouchGestures.onTap().subscribe((event) => {
  const segment = planes.objects[index];
  const location = Reactive.point2d(
    Reactive.val(event.location.x),
    Reactive.val(event.location.y),
  );
  const projected = Scene.unprojectToFocalPlane(location);

  segment.hidden = Reactive.val(false);

  const worldPosition = Reactive.point(
    DeviceMotion.worldTransform.x.add(projected.x.pin()),
    DeviceMotion.worldTransform.y.add(projected.y.pin()),
    DeviceMotion.worldTransform.z.add(projected.z.pin()),
  );

  segment.transform.position = worldPosition;

  index = (index + 1) % planes.objects.length;
});

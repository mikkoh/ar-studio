
import Scene from 'Scene';
import console from 'Diagnostics';
import Reactive from 'Reactive';
import Time from 'Time';
import TouchGestures from 'TouchGestures';

import createRibbon from './create-ribbon';
import getPositionSignalFromTransform from './get-position-signal-from-transform';

const ribbon = createRibbon();

const camera = Scene.root.find('Camera');
const focalDistance = camera.child('Focal Distance');


let index = 0;

TouchGestures.onTap().subscribe((event) => {
  const segment = ribbon.segments[index];
  const location = Reactive.point2d(
    Reactive.val(event.location.x),
    Reactive.val(event.location.y),
  );
  const projected = Scene.unprojectWithDepth(location, 100);

  segment.hidden = Reactive.val(false);

  segment.transform.position = Reactive.point(
    projected.x.pin(),
    projected.y.pin(),
    projected.z.pin(),
  );

  index = (index + 1) % ribbon.segments.length;
});


// Scene.unprojectToFocalPlane()

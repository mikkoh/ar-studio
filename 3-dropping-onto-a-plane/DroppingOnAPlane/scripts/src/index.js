import Scene from 'Scene';
import console from 'Diagnostics';
import Reactive from 'Reactive';
import DeviceMotion from 'DeviceMotion';
import CameraInfo from 'CameraInfo';
import TouchGestures from 'TouchGestures';
import Units from 'Units';

const planeTracker = Scene.root.child('planeTracker');
const objectOnPlane = planeTracker.child('objectOnPlane');
const objectOnWorld = Scene.root.child('objectOnWorld');
const textConfidence = Scene.root.find('textConfidence');
const textTap = Scene.root.find('textTap');

const centerOfScreen = Reactive.point2d(
  CameraInfo.previewSize.width.div(2),
  CameraInfo.previewSize.height.div(2),
);

const planeTrackerIsConfident = getPlaneTrackerIsConfident(planeTracker);
const maxDistanceForPlane = Units.m(1);

let reusablePoint;

textConfidence.hidden = Reactive.val(true);
objectOnWorld.hidden = objectOnPlane.hidden = Reactive.val(true);

// we always want the object in world space to be `maxDistanceForPlane` away from the camera
objectOnWorld.transform.position = getPointAlwaysAwayFromCamera();

tapToInit((point) => {
  textTap.hidden = Reactive.val(true);

  reusablePoint = point;
  textConfidence.hidden = planeTrackerIsConfident;
  objectOnWorld.hidden = Reactive.val(false);

  updateScene();

  monitorDeviceMotion().subscribe(updateScene);
});

function tapToInit(callback) {
  TouchGestures.onTap().take(1).subscribe((event) => {
    callback(event.location);
  });
}

function getPointAlwaysAwayFromCamera() {
  const deviceNormal = getDirectionNormalFromDeviceMotion();
  const pointInSpaceOneMeterOut = deviceNormal.mul(maxDistanceForPlane);

  return Reactive.point(
    DeviceMotion.worldTransform.x.add(pointInSpaceOneMeterOut.x),
    DeviceMotion.worldTransform.y.add(pointInSpaceOneMeterOut.y),
    DeviceMotion.worldTransform.z.add(pointInSpaceOneMeterOut.z),
  );
}

function getDirectionNormalFromDeviceMotion() {
  const worldTransform = DeviceMotion.worldTransform;

  return worldTransform
    .applyTo(Reactive.vector(0, 0, 1))
    .sub(Reactive.vector(
      worldTransform.x,
      worldTransform.y,
      worldTransform.z,
    ))
    .neg();
}

function updateScene(data) {
  reusablePoint.x = centerOfScreen.x.lastValue;
  reusablePoint.y = centerOfScreen.y.lastValue;

  const planePoint = planeTracker.hitTest(reusablePoint);

  // the hitTest/raycast didn't hit the plane
  if (planePoint === null) {
    objectOnPlane.hidden = Reactive.val(true);
    objectOnWorld.hidden = planeTrackerIsConfident.not();

    return;
  }

  const planePointSignal = Reactive.point(
    Reactive.val(planePoint.x),
    Reactive.val(planePoint.y),
    Reactive.val(planePoint.z),
  );

  const isGreaterThanOneMeter = planePointSignal
    .sub(planeTracker.transform.position)
    .distance(DeviceMotion.worldTransform.position)
    .gt(maxDistanceForPlane);

  // if `planeTrackerIsConfident` is not confident don't show either plane
  // otherwise we swap which plane is showing based on how far away the point on the plane is
  objectOnPlane.hidden = planeTrackerIsConfident.not().or(isGreaterThanOneMeter);
  objectOnWorld.hidden = planeTrackerIsConfident.not().or(isGreaterThanOneMeter.not());

  objectOnPlane.transform.position = planePointSignal;
}

function monitorDeviceMotion() {
  return Reactive.monitorMany({
    x: DeviceMotion.worldTransform.x,
    y: DeviceMotion.worldTransform.y,
    z: DeviceMotion.worldTransform.z,
    rotationX: DeviceMotion.worldTransform.rotationX,
    rotationY: DeviceMotion.worldTransform.rotationY,
    rotationZ: DeviceMotion.worldTransform.rotationZ,
  });
}

function getPlaneTrackerIsConfident(planeTracker, minTrackingLevel = 'MEDIUM') {
  const confidenceLevels = [
    'NOT_TRACKING',
    'LOW',
    'MEDIUM',
    'HIGH',
  ];

  const index = confidenceLevels.indexOf(minTrackingLevel);

  if (index === -1) {
    throw new Error(`
      The \`minTrackingLevel\` ${minTrackingLevel} is not a valid value.
      Please use one of the following ${confidenceLevels.join(' - ')}`);
  }

  const boolSignals = confidenceLevels
    .filter((_level, i) => i >= index)
    .map((level) => {
      return planeTracker.confidence.eq(Reactive.val(level));
    });

  return Reactive.orList(boolSignals);
}

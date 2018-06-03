import Reactive from 'Reactive';
import console from 'Diagnostics';

export default function getPositionSignalFromTransform(transform) {
  const x = transform.x.lasValue || 0
  const y = transform.y.lasValue || 0;
  const z = transform.z.lasValue || 0;

  return Reactive.point(
    Reactive.val(x),
    Reactive.val(y),
    Reactive.val(z),
  );
}

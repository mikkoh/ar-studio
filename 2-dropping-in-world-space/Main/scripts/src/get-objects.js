import Scene from 'Scene';
import Reactive from 'Reactive';
import console from 'Diagnostics';

export default function createRibbon({
  segmentBaseName = 'plane',
  segmentCount = 10,
  itemToTrack = null,
} = {}) {
  const objects = Array(segmentCount)
    .fill(null)
    .map((_value, i) => {
      return Scene.root.find(`${segmentBaseName}${i}`);
    });

  hideAllobjects();

  function hideAllobjects() {
    objects.forEach((segment) => {
      segment.hidden = Reactive.val(true);
    });
  }

  function moveTo(location) {

  }

  return {
    objects,
    moveTo,
  };
}

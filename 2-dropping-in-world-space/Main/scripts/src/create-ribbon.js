import Scene from 'Scene';
import Reactive from 'Reactive';
import console from 'Diagnostics';

export default function createRibbon({
  segmentBaseName = 'plane',
  segmentCount = 10,
  itemToTrack = null,
} = {}) {
  const segments = Array(segmentCount)
    .fill(null)
    .map((_value, i) => {
      return Scene.root.find(`${segmentBaseName}${i}`);
    });

  hideAllSegments();

  function hideAllSegments() {
    segments.forEach((segment) => {
      segment.hidden = Reactive.val(true);
    });
  }

  function moveTo(location) {

  }

  return {
    segments,
    moveTo,
  };
}

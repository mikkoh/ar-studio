import Scene from 'Scene';
import console from 'Diagnostics';

export default function getObjects(itemName = 'plane') {
  const objects = [];

  let i = 0;

  try {
    while(true) {
      const item = Scene.root.find(`${itemName}${i}`);

      objects.push(item);

      i++;
    }
  } catch(e) {
    console.log(`Found ${i} ${itemName}`);
  }

  return objects;
}

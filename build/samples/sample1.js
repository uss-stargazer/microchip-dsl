import Microchip from '../src/index.js';
const microchip = new Microchip();
microchip.registerComponent('main', // Don't need this: componentdId could just be a number and setting entry could pass in function (setEntryComponent could just consult a map between ids and function pointers)
(a, b) => {
    return [b, a];
}, { name: 'FancyPants' });
microchip.setEntryComponent('main');
export default microchip;
//# sourceMappingURL=sample1.js.map
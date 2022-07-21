const { createWorker } = require('tesseract.js');
const path = require('path')

// const worker = createWorker();
// // const rectangle = { left: 914, top: 915, width: 320, height: 50 };
// const rectangle = { left: 924, top: 922, width: 309, height: 31 };
// // left is the distance from the upper-left corner of the bounding box, to the left border of the image.
// // top is the distance from the upper-left corner of the bounding box, to the top border of the image.
// // width and height are the width and height of the bounding box.
// // const rectangle = { left: 1051, top: 797, width: 208, height: 65 };

// (async () => {
//   await worker.load();
//   await worker.loadLanguage('eng');
//   await worker.initialize('eng');
//   await worker.setParameters({
//   tessedit_char_whitelist: '0123456789()%',
//   // tessedit_char_whitelist: '0123456789Lv.',
//     });

//   const a = path.join(__dirname, "../images/health.png")
//   console.log(a)

//   const { data: { text } } = await worker.recognize(a, { rectangle });
//   console.log(text)
//   await worker.terminate();
    
// })();

let text = 22235351212
console.log(addCommas(text))

function addCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
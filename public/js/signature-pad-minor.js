let canvas1 = document.getElementById('signature-pad-1');
let canvas2 = document.getElementById('signature-pad-2');
let canvas3 = document.getElementById('signature-pad-3');
let canvas4 = document.getElementById('signature-pad-4');

let signaturePad1 = new SignaturePad(canvas1, {
  backgroundColor: 'rgb(255, 255, 255)' // necessary for saving image as JPEG; can be removed is only saving as PNG or SVG
});
let signaturePad2 = new SignaturePad(canvas2, {
  backgroundColor: 'rgb(255, 255, 255)'
});
let signaturePad3 = new SignaturePad(canvas3, {
  backgroundColor: 'rgb(255, 255, 255)'
});
let signaturePad4 = new SignaturePad(canvas4, {
  backgroundColor: 'rgb(255, 255, 255)'
});

document.querySelector('#clear1').addEventListener('click', function () {
    signaturePad1.clear();
});
document.querySelector('#clear2').addEventListener('click', function () {
    signaturePad2.clear();
});
document.querySelector('#clear3').addEventListener('click', function () {
    signaturePad3.clear();
});
document.querySelector('#clear4').addEventListener('click', function () {
    signaturePad4.clear();
});
const input = document.getElementById('input-file');
const canvas = document.getElementById('preview');
const context = canvas.getContext('2d');
const ph = document.getElementById('placeholder');
const dlLink = document.getElementById('download-link');
dlLink.hidden = false;

input.addEventListener('change', drawImageFromInput);

function drawImageFromInput(callback) {
  context.clearRect(0, 0, 500, 500);

  if (input.files.length === 0) {
    context.drawImage(ph, 0, 0, 500, 500);
    if (typeof callback === 'function') callback();
  } else {
    const img = new Image();
    img.addEventListener('load', function () {
      size = Math.min(img.height, img.width);
      x1 = 0;
      y1 = 0;
      if (img.height < img.width) {
        //breit
        x1 = img.width / 2 - size / 2;
      } else if (img.height > img.width) {
        //hoch
        y1 = img.height / 2 - size / 2;
      }
      context.drawImage(img, x1, y1, size, size, 0, 0, 500, 500);
      for (var optionImage of document.querySelectorAll('.frame-option img')) {
        optionImage.style.backgroundImage = `url("${img.src}")`;
      }

      if (typeof callback === 'function') callback();
    });
    img.src = URL.createObjectURL(input.files[0]);
  }
}

function prepareDownloadLink() {
  if (input.files[0]) {
    dlLink.setAttribute(
      'download',
      input.files[0].name.replace(/\.\w+$/, '-avatar.png')
    );
  }
  dlLink.hidden = false;
  dlLink.href = canvas.toDataURL();
}

for (var button of document.querySelectorAll('.frame-option')) {
  button.addEventListener('click', function (event) {
    drawImageFromInput(function () {
      const image = event.target.querySelector('img');
      context.drawImage(image, 0, 0, 500, 500);
      prepareDownloadLink();
    });
  });
}

placeholder.onload = drawImageFromInput;

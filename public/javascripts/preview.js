/** @type {HTMLVideoElement} */
const videoElement = document.getElementById('video');
/** @type {HTMLInputElement} */
const videoUpload = document.getElementById('video-upload');
/** @type {HTMLFormElement} */
const submitForm = document.getElementById('submit-upload');

videoUpload.addEventListener('change', function (event) {
  if (event.target.files && event.target.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      const blob = new Blob([e.target.result]);
      videoElement.src = URL.createObjectURL(blob);
      videoElement.load();
    };

    reader.readAsArrayBuffer(event.target.files[0]);
  }
});

submitForm.onsubmit = async function (ev) {
  ev.preventDefault();
  const xhr = new XMLHttpRequest();
  const fd = new FormData();
  fd.append('video', videoUpload.files[0]);
  xhr.open('POST', '/video/upload');
  xhr.send(fd);
};

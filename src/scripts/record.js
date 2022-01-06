"use strict";
const { writeFile } = require("fs");
require("dotenv").config();
const notify = require("node-notifier");

const date = new Date();
const fileName =
  "meeting_recording_" +
  date.getDate() +
  "_" +
  date.getMonth() +
  1 +
  "_" +
  date.getFullYear() +
  "_" +
  date.getHours() +
  "_" +
  date.getMinutes() +
  "_" +
  date.getSeconds();

const meetingName = localStorage.getItem("name");
const meetingDuration = localStorage.getItem("duration");
const progress = document.getElementById("progress");
const progressBar = document.getElementById("progressBar");
localStorage.removeItem("duration");
localStorage.removeItem("name");
document.getElementById("name").innerText =
  meetingName !== "" ? meetingName : fileName;

const enableButton = (button) => {
  button.disabled = false;
  button.classList.remove("cursor-not-allowed");
  if (button == stopButton) {
    button.classList.add("hover:bg-blue-800");
  }
  if (button == recordButton) {
    button.classList.add("hover:bg-red-800");
  }
};

const disableButton = (button) => {
  button.disabled = false;
  button.classList.add("cursor-not-allowed");
  if (button == stopButton) {
    button.classList.remove("hover:bg-blue-800");
  }
  if (button == recordButton) {
    button.classList.remove("hover:bg-red-800");
  }
};

// Recording algorithm

URL = window.URL || window.webkitURL;

const recordButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
let gumStream;
let recorder;
let input;

disableButton(stopButton);

let endTime = meetingDuration ? meetingDuration : 60;
function startInterval() {
  let startTimer = setInterval(function () {
    countDown();
  }, 1000);
}
const setTimer = (e) => {
  endTime = e;
  time = e * 60;
  alerttime = (20 / 100) * time;
  alertTime1 = (50 / 100) * time;
};

const startRecording = async () => {
  let constraints = { audio: true, video: false };

  startInterval();
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (stream) {
      let audioContext = new AudioContext();

      //assign to gumStream for later use
      gumStream = stream;

      /* use the stream */
      input = audioContext.createMediaStreamSource(stream);

      recorder = new WebAudioRecorder(input, {
        workerDir: "js/", // must end with slash
        encoding: "mp3",
        numChannels: 2, //2 is the default, mp3 encoding supports only 2
      });

      recorder.onComplete = function (recorder, blob) {
        createDownloadLink(blob, recorder.encoding);
      };

      recorder.setOptions({
        timeLimit: 120,
        encodeAfterRecord: true,
        ogg: { quality: 0.5 },
        mp3: { bitRate: 160 },
      });

      //start the recording process
      recorder.startRecording();
    })
    .catch(function (err) {
      //enable the record button if getUSerMedia() fails
      recordButton.disabled = false;
      stopButton.disabled = true;
      console.log(err);
    });

  disableButton(recordButton);
  enableButton(stopButton);
};

function stopRecording() {
  console.log("stopRecording() called");

  //stop microphone access
  gumStream.getAudioTracks()[0].stop();

  //disable the stop button
  stopButton.disabled = true;
  recordButton.disabled = false;

  //tell the recorder to finish the recording (stop recording + encode the recorded audio)
  recorder.finishRecording();
}

async function createDownloadLink(blob, encoding) {
  const buffer = Buffer.from(await blob.arrayBuffer());
  await writeFile(
    `./public/assets/${
      meetingName !== "" ? meetingName : fileName
    }.${encoding}`,
    buffer,
    () => console.log("audio saved!"),
  );

  window.location.href = "../pages/index.html";
}

//PROGRESS BAR LOGIC

let time = endTime * 60;
let alerttime = Math.round((20 / 100) * time);
let alertTime1 = Math.round((50 / 100) * time);
console.log(alertTime1, alerttime);

const countDown = () => {
  console.log(time);
  let minutes = Math.abs(Math.floor(time / 60));
  let seconds = Math.abs(time % 60);
  let alertMinute = Math.floor(alerttime / 60);
  let alertSeconds = Math.floor(alerttime % 60);
  progress.setAttribute("style", `width: ${(time / (endTime * 60)) * 100}%`);
  if (time == alertTime1) {
    progress.classList.add("bg-yellow-500");
    progress.classList.remove("bg-green-500");
  }
  if (time == alerttime) {
    progress.classList.add("bg-red-500");
    progress.classList.remove("bg-yellow-500");
    const message = `Only ${alertMinute} minutes ${alertSeconds} seconds more`;
    let speech = new SpeechSynthesisUtterance();
    speech.text = message;
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);
    notify.notify({
      title: process.env.APP_NAME,
      message: message,
      icon: "public/images/recorder.png",
    });
  }
  seconds = seconds < 10 ? "0" + seconds : seconds;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  progress.innerHTML = minutes + ":" + seconds;
  time--;
  console.log(minutes, ":", seconds);
};

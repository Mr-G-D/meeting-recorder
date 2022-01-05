const date = new Date();
const fileName =
  "meeting_recording_" +
  date.getDate() +
  "_" +
  date.getMonth() +
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
localStorage.removeItem("duration");
localStorage.removeItem("name");
document.getElementById("name").innerText =
  meetingName !== "" ? meetingName : fileName;

// Recording algorithm

const record = async () => {
  console.log("working");
};

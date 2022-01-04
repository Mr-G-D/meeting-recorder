// const date = new Date();
// const fileName =
//   "meeting_recording_" +
//   date.getDate() +
//   "_" +
//   date.getMonth() +
//   "_" +
//   date.getFullYear() +
//   "_" +
//   date.getHours() +
//   "_" +
//   date.getMinutes() +
//   "_" +
//   date.getSeconds();
const submit = () => {
  const name = document.getElementById("meetingName").value;
  const duration = document.getElementById("meetingDuration").value;
  localStorage.setItem("name", name);
  localStorage.setItem("duration", duration ? duration : 60);
  window.location.href = "./record.html";
};

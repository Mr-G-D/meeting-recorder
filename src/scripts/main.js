const submit = () => {
  const name = document.getElementById("meetingName");
  const duration = document.getElementById("meetingDuration");
  localStorage.setItem("name", "name");
  window.location.href = "./record.html";
};

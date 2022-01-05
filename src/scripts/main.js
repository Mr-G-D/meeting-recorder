const submit = () => {
  const name = document.getElementById("meetingName").value;
  const duration = document.getElementById("meetingDuration").value;
  localStorage.setItem("name", name);
  localStorage.setItem("duration", duration ? duration : 60);
  window.location.href = "./record.html";
};

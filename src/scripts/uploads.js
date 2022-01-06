"use strict";

const { readdir, stat } = require("fs");
const poster = require("poster");
const path = require("path");
require("dotenv").config();

const uploadParent = document.getElementById("uploads");

readdir("public/assets/", (err, fileNames) => {
  fileNames.map((fileName) => {
    stat(`public/assets/${fileName}`, (err, fileStat) => {
      let file = fileName.split(".");
      let newFile = document.createElement("div");
      newFile.classList.add("flex", "justify-around");
      newFile.innerHTML = `<div class="w-full bg-gray-200 rounded-2xl mx-10 my-2"><div class="flex flex-row items-start w-full h-full px-10 py-7"><h4 class="w-full text-sm">${
        file[0]
      }</h4><h4 class="w-full text-center text-sm">${
        file[1]
      }</h4><h4 class="w-full text-center text-sm">
    ${(fileStat.size / 1048576).toFixed(2)} mb
    </h4><h4 class="w-full text-right text-sm flex justify-around"><button onclick="postFile('${fileName}')"><i id="uploadIcon-${fileName}" class="upload fas fa-upload"></i></button><button onclick="deleteFile()"><i class="far fa-trash-alt"></i></button></h4></div>`;
      uploadParent.appendChild(newFile);
    });
  });
});

const postFile = (fileName) => {
  let uploadIcon = document.getElementById(`uploadIcon-${fileName}`);
  uploadIcon.style.cursor = "not-allowed";
  uploadIcon.classList.remove("fa-upload");
  uploadIcon.classList.add("fas", "fa-spinner", "fa-pulse");
  let filepath = path.join(__dirname, "../../public/assets/", fileName);
  const url = process.env.SERVER_API;
  poster.post(
    filepath,
    {
      uploadUrl: url,
      method: "POST",
      fileId: "file",
      fields: {},
    },
    function (err, r) {
      if (err) {
        uploadIcon.style.cursor = "pointer";
        uploadIcon.classList.remove("fas", "fa-spinner", "fa-pulse");
        uploadIcon.classList.add("fas", "fa-upload");
        console.log(err);
      } else {
        uploadIcon.style.cursor = "pointer";
        uploadIcon.classList.remove("fas", "fa-spinner", "fa-pulse");
        uploadIcon.classList.add("fas", "fa-check-circle");
        uploadIcon.style.color = "green";
        console.log(r);
      }
    },
  );
};

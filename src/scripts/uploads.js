"use strict";

const { readdir, stat, unlink } = require("fs");
const poster = require("poster");
const path = require("path");
require("dotenv").config();

const uploadParent = document.getElementById("uploads");
let id = 0;

readdir("public/assets/", (err, fileNames) => {
  fileNames.map((fileName) => {
    let audio = new Audio(
      path.join(__dirname, "../../public/assets", fileName),
    );
    audio.onloadedmetadata = () => {
      const duration = audio.duration;
      stat(`public/assets/${fileName}`, (err, fileStat) => {
        const date = fileStat.birthtime.toString();
        let newFile = document.createElement("tr");
        newFile.classList.add("whitespace-nowrap");
        let file = fileName.split(".");
        newFile.innerHTML = `
                          <td class="px-6 py-4 text-sm text-center text-gray-500">
                          ${++id}
                          </td>
                          <td class="px-6 py-4 text-center">
                            <div class="text-sm text-gray-900">
                              ${file[0]}
                            </div>
                          </td>
                          <td class="px-6 py-4 text-center">
                            <div class="text-sm text-gray-500">${(
                              audio.duration / 60
                            ).toFixed(2)} mins</div>
                          </td>
                          <td class="px-6 py-4 text-sm text-center text-gray-500">
                            ${date.substring(4, 15)}
                          </td>
                          <td class="px-6 py-4 text-center">
                            <button onclick="postFile('${fileName}')"><i id="uploadIcon-${fileName}" class="upload fas fa-upload"></i></button>
                          </td>
                          <td class="px-6 py-4 text-center">
                            </button><button onclick="deleteFile('${fileName}')"><i class="far fa-trash-alt"></i></button>
                          </td>
                        `;
        uploadParent.appendChild(newFile);
      });
    };
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

const deleteFile = async (fileName) => {
  const response = await confirm(`Are you sure to delete ${fileName}`);
  if (response) {
    unlink(path.join(__dirname, "../../public/assets/", fileName), (err) => {
      if (err) {
        console.log(err);
      }
    });
    window.location.reload();
  }
};

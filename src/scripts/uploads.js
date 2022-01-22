"use strict";

const { readdir, stat, unlink } = require("fs");
const poster = require("poster");
const path = require("path");
require("dotenv").config();

const uploadParent = document.getElementById("uploads");
const uploaded = document.getElementById("uploaded");
const notUploaded = document.getElementById("notUploaded");
let id = 0;
let uploadedCount = 0,
  notUploadedCount = 0;
readdir(path.join(__dirname, "../../../assets/"), (err, fileNames) => {
  fileNames.map((fileName) => {
    // localStorage.setItem(fileName, false);
    const uploadedFile = localStorage.getItem(fileName);
    if (uploadedFile === "false") {
      notUploadedCount += 1;
    }
    if (uploadedFile === "true") {
      uploadedCount += 1;
    }
    let audio = new Audio(path.join(__dirname, "../../../assets", fileName));
    audio.onloadedmetadata = () => {
      stat(
        path.join(__dirname, "../../../assets", fileName),
        (err, fileStat) => {
          const date = fileStat.birthtime.toString();
          let newFile = document.createElement("tr");
          newFile.classList.add("whitespace-nowrap");
          let file = fileName.split(".");
          newFile.innerHTML = `
                          <td class="px-6 py-4 text-sm text-center text-gray-500">
                          ${++id}
                          </td>
                          <td class="px-6 py-4 text-center">
                            <div class="text-sm text-gray-900" title="${
                              file[0]
                            }">
                              ${
                                file[0].length < 19
                                  ? file[0]
                                  : file[0].substring(0, 18) + "..."
                              }
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
                          ${
                            uploadedFile === "false"
                              ? `<button onclick="postFile('${fileName}')"><i id="uploadIcon-${fileName}" class="upload fas fa-upload"></i></button>`
                              : `<button><i id="uploadIcon-${fileName}" style="color: green;" class="upload fas fa-check-circle"></i></button>`
                          }
                            
                          </td>
                          <td class="px-6 py-4 text-center">
                            </button><button onclick="deleteFile('${fileName}')"><i class="far fa-trash-alt"></i></button>
                          </td>
                        `;
          uploadParent.appendChild(newFile);
          uploaded.innerText = uploadedCount;
          notUploaded.innerText = notUploadedCount;
        },
      );
    };
  });
});

const postFile = (fileName) => {
  localStorage.removeItem(fileName);
  localStorage.setItem(fileName, true);
  let uploadIcon = document.getElementById(`uploadIcon-${fileName}`);
  uploadIcon.style.cursor = "not-allowed";
  uploadIcon.classList.remove("fa-upload");
  uploadIcon.classList.add("fas", "fa-spinner", "fa-pulse");
  let filepath = path.join(__dirname, "../../../assets/", fileName);
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
        uploadedCount += 1;
        notUploadedCount -= 1;
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
  localStorage.removeItem(fileName);
  const response = await confirm(`Are you sure to delete ${fileName}?`);
  if (response) {
    unlink(path.join(__dirname, "../../../assets/", fileName), (err) => {
      if (err) {
        console.log(err);
      }
    });
    window.location.reload();
  }
};

const uploadAll = async () => {
  const response = await confirm(
    "Do you want to delete all the files after uploading?",
  );
  readdir(path.join(__dirname, "../../../assets/"), (err, fileNames) => {
    fileNames.map(async (fileName) => {
      const fileStat = localStorage.getItem(fileName);
      if (fileStat === "false") {
        await postFile(fileName);
      }

      if (response) {
        await unlink(
          path.join(__dirname, "../../../assets/", fileName),
          (err) => {
            if (err) {
              console.log(err);
            }
          },
        );
      }
    });
  });
  window.location.reload();
};

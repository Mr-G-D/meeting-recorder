"use strict";

const { readdir, stat } = require("fs");

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
    </h4><h4 class="w-full text-right text-sm"><i class="upload fas fa-upload"></i></h4></div>`;
      uploadParent.appendChild(newFile);
    });
  });
});

const dropdown = () => {
  const options = document.getElementById("dropdownOptions");
  if (options.classList.contains("hidden")) {
    options.classList.remove("hidden");
  } else {
    options.classList.add("hidden");
  }
};

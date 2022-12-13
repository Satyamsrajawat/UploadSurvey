import { async } from 'regenerator-runtime';
import 'regenerator-runtime/runtime'
const { BlobServiceClient } = require("@azure/storage-blob");
const { AzureStorage } = require("@azure/storage-blob");

const selectButton = document.getElementById("select-button");
var fileInput = document.getElementById("file-input");

const blobUri = 'https://devcacdpdarchived.blob.core.windows.net/?sv=2021-06-08&ss=b&srt=co&sp=wlactfx&se=2022-12-20T14:46:15Z&st=2022-12-12T06:46:15Z&spr=https,http&sig=qH3T3PpP%2FBpwig6M%2Buk2J0ZrUl4Q3auQ%2BY5%2F%2BpXiq08%3D';
const blobServiceClient = new BlobServiceClient(blobUri);
const containerName = 'test';
const containerClient = blobServiceClient.getContainerClient(containerName);
let uploadStartTime;
let uploadFinishTime;

const sasToken = 'sp=racw&st=2022-12-07T10:59:36Z&se=2022-12-07T18:59:36Z&spr=https&sv=2021-06-08&sr=c&sig=RtyHys22y00rW8Tsc5LlidPXPEXAt5SLQU3k8csR7E4%3D';

// function readfiles(files) {
//     for (var i = 0; i < files.length; i++) {
//       document.getElementById('fileDragName').value = files[i].name
//       document.getElementById('fileDragSize').value = files[i].size
//       document.getElementById('fileDragType').value = files[i].type
//       reader = new FileReader();
//       reader.onload = function(event) {
//         document.getElementById('fileDragData').value = event.target.result;}
//       reader.readAsDataURL(files[i]);
//     }
//   }

//selecting all required elements
const dropArea = document.querySelector(".drag-area"),
dragText = dropArea.querySelector("header"),
button = dropArea.querySelector("button"),
input = dropArea.querySelector("input");
var progressArea = document.querySelector(".progress-area");
var uploadedArea = document.querySelector(".uploaded-area");
let file; //this is a global variable and we'll use it inside multiple functions

button.onclick = ()=>{
  input.click(); //if user click on the button then the input also clicked
}

input.addEventListener("change", function(){
  //getting user select file and [0] this means if user select multiple files then we'll select only the first one
  file = this.files[0];
  dropArea.classList.add("active");
  //showFile(); //calling function
});


//If user Drag File Over DropArea
dropArea.addEventListener("dragover", (event)=>{
  event.preventDefault(); //preventing from default behaviour
  dropArea.classList.add("active");
  dragText.textContent = "Release to Upload File";
});

//If user leave dragged File from DropArea
dropArea.addEventListener("dragleave", ()=>{
  dropArea.classList.remove("active");
  dragText.textContent = "Drag & Drop to Upload File";
});

//If user drop File on DropArea
dropArea.addEventListener("drop", (event)=>{
  event.preventDefault(); //preventing from default behaviour
  //getting user select file and [0] this means if user select multiple files then we'll select only the first one
      uploadStartTime = new Date();

    console.log('Start' + uploadStartTime.getMinutes() + 'm : '+ uploadStartTime.getSeconds()+'s');
  fileInput.files = event.dataTransfer.files;
  uploadFiles(); //calling function
});


  // var holder = document.getElementById('holder');
  // holder.ondragover = function () { 
  //   holder.classList.add("active");
  //   this.className = 'hover'; return false; };
  // holder.ondragend = function () { this.className = ''; return false; };
  // holder.ondrop = function (e) {
  //   this.className = '';
  //   e.preventDefault();
  //   fileInput.files = e.dataTransfer.files;
  //   const dateTime = new Date();
  //   console.log('Start' + dateTime.getMinutes() + 'm : '+ dateTime.getSeconds()+'s');
  //    uploadFiles();
  //   // readfiles(e.dataTransfer.files);
  // }

const uploadFiles = async() => {
    try{
        const promises = [];
        for(const file of fileInput.files){
            const blockBlobClient = containerClient.getBlockBlobClient(file.name);
            // blockBlobClient.upload(file);
            console.log(file.name, file.size, file.type);
            
        promises.push(blockBlobClient.uploadData(file,{ onProgress: (ev) => {
          let progressHTML = `<li class="row">
          <i class="fas fa-file-alt"></i>
          <div class="content">
            <div class="details">
              <span class="name">${file.name} • Uploading </span>
              <span class="percent"> ${((ev.loadedBytes/ file.size)*100).toFixed(2)}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress" style="width: ${((ev.loadedBytes/ file.size)*100).toFixed(2)}%"></div>
            </div>
          </div>
        </li>`;
        uploadedArea.classList.add("onprogress");
        progressArea.innerHTML = progressHTML;
    
        if(ev.loadedBytes == file.size){
          progressArea.innerHTML = "";
          let uploadedHTML = `<li class="row">
                                <div class="content upload">
                                  <i class="fas fa-file-alt"></i>
                                  <div class="details">
                                    <span class="name">${file.name} • Uploaded </span>
                                    <span class="size">${(file.size/(1024*1024)).toFixed(1)} Mb</span>
                                  </div>
                                </div>
                                <i class="fas fa-check"></i>
                              </li>`;
          uploadedArea.classList.remove("onprogress");
          uploadedArea.insertAdjacentHTML("afterbegin", uploadedHTML);
        }

        },}));
        // promises.push(blockBlobClient.uploadData(file,{ onProgress: (ev) => {console.log(ev.loadedBytes/(1024*1023))},}));
        }
        await Promise.all(promises);
        // await Promise.all(promises);
    const uploadFinishTime = new Date();
    console.log('Finish : ' + uploadFinishTime.getMinutes() + 'm : '+ uploadFinishTime.getSeconds()+'s');
  dropArea.classList.remove("active");
  dragText.textContent = "Drag & Drop to Upload File";

    alert('Done');
    let timeTakenMin = (uploadFinishTime.getMinutes() - uploadStartTime.getMinutes());
    let timeTakenSec = (uploadFinishTime.getSeconds() - uploadStartTime.getSeconds());
    console.log('Done : Time Taken - ' + timeTakenMin + ' Minutes , '+timeTakenSec +' Seconds');

    }catch(error){
        alert(error.message);
    console.log(error.message);

    }
}


selectButton.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", uploadFiles);

function UploadProgress(fileData){
    
}
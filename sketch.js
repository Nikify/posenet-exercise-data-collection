let video;
let poseNet;
let pose;
let skeleton;
let mode;
let collectedExercises = [];
const collectingTimeMs = 3000; //time period for collecting data points (in ms)
const collectingIntervalMs = 200; //interval between collection of data points (in ms)

function setup() {
  mode = "notCollecting";
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);
}

function modelLoaded() {
    console.log("PoseNet model loaded!");
}

function gotPoses(poses) {
  if(poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}

function draw() {
  translate(video.width, 0);
  scale(-1,1);
  image(video, 0, 0);
    
  if(pose){
    var eyeR = pose.rightEye;
    var eyeL = pose.leftEye;
    var d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);
      
    for(let i=0; i < pose.keypoints.length; i++) {
      var x = pose.keypoints[i].position.x;
      var y = pose.keypoints[i].position.y;
      fill(0, 255, 0);
      ellipse(x, y,16,16);
    }
    for(let i=0; i < skeleton.length; i++) {
        var x1 = skeleton[i][0].position.x;
        var y1 = skeleton[i][0].position.y;
        var x2 = skeleton[i][1].position.x;
        var y2 = skeleton[i][1].position.y;
        line(x1, y1, x2, y2);
        stroke(255);
        strokeWeight(3);
    }
  }   
}

function buttonPressedCollect(){
  let label = document.getElementById("label").value;
  if (label == "" || label == null) {
    alert("missing label");
  } else if (mode == "notCollecting") {
    mode = "collecting";
    countDownToCollect();
  }
}

function countDownToCollect() {
  console.log("Waiting for countdown...");
  var counter = document.getElementById("counter");
  counter.style.color = "black";
  var sec = 5;
  var countDown = setInterval(
    function(){ 
      if(sec > 0) {
        counter.innerHTML = sec--;
      } else {
        counter.innerHTML = 0;
        clearInterval(countDown);
        collectData();
      }
    } , 1000);
}

function collectData() {
  console.log("Collecting...");
  var counter = document.getElementById("counter");
  let collectedPoses = [];
  var elapsedMs = 0;
  var i = 0;
  counter.style.color = "red"; 
  counter.innerHTML = ((collectingTimeMs/1000) - (elapsedMs / 1000)) + " - collecting";
  var collector = setInterval(
    function(){ 
      if(elapsedMs < collectingTimeMs) {
        let poseData = {
          "score" : pose.score,
          "keypoints" : pose.keypoints
        }
        collectedPoses.push(poseData); // add pose to pose collection
        i++;
        elapsedMs = elapsedMs + collectingIntervalMs; 
        //console.log(elapsedMs + "ms"); 
        if (elapsedMs % 1000 == 0){  
          counter.innerHTML = ((collectingTimeMs/1000) - (elapsedMs / 1000)) + " - collecting";      
        }
      } 
      else {
        console.log("Data collected!")
        counter.innerHTML = "Finished collecting";
        counter.style.color = "darkgreen";
        mode = "notCollecting";
        let exerciseData = createExerciseData(collectedPoses); // create exercise from poses
        addExerciseData(exerciseData); // add exercise to data set
        clearInterval(collector);
      }
  } , collectingIntervalMs);
}

function addExerciseData(exerciseData) {
  if(exerciseData){
    collectedExercises.push(exerciseData);
    console.log("Data added!")
  } else {
    alert("error in addExerciseData");
  }
}

function createExerciseData(poseCollection) {
  var label = document.getElementById("label").value;
  if (!poseCollection || !label) {
    alert("error in createExerciseData");
  } else {
    let exercise = {
    "exercise" : label,
    "poses" : poseCollection
    };
    return exercise;
  } 
}

function buttonPressedExport(){
  exportToJsonFile(collectedExercises);
}

function exportToJsonFile(jsonData) {
  if (jsonData) {
    let dataStr = JSON.stringify(jsonData);
    let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    let exportFileName;
    let label = document.getElementById("label").value;
    exportFileName = 'data.json';
    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileName);
    linkElement.click();
  } else {
    alert("error in exportToJsonFile");
  }   
}
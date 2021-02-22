# Collect sequential skeletal pose data for exercises
## :clapper: Collecting data
1. Run `/index.html` on a local server or through the p5.js Web Editor: https://editor.p5js.org/Nikify/sketches/yXA5qmePw.
1. Allow access to webcam.
1. Verify that PoseNet has successfully loaded (success message will be logged in the terminal).
1. Enter the label/name of an exercise and press `Collect data`.
    1. Stand in front of the webcam and perpare to perform exercise.
    1. When the initial countdown (5 seconds) has finished, start performing the exercise. PoseNet data is now being collected.
    1. When the second countdown (3 seconds) has finished, data collection stops.
    1. If you wish to collect more exercise data, repeat step 4.1 - 4-3.
1. Export your data as JSON by pressing `Export data`.

## :wrench: Configuring data collection
The time required to collect exercise data can be changed by modifying `const collectingTimeMs = 3000;` in `/sketch.js` 
The interval with which exercise data is collected can be changed by modifying `const collectingIntervalMs = 200;` in `/sketch.js` 

## :memo: Converting data from JSON to NumPy
1. Install Python and NymPy
1. Run `python convert.py {your/path/data.json}`
1. The converted NumPy data is as in `/data.npy`

## :construction: Todo
* Add support for labels in NumPy 
    * The labels entered during data collection are included in the exported JSON file. However, the JSON to NumPy converter currently ignores labels.
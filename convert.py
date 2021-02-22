import sys
import numpy as np
import json
from numpy import array

def convert(json_path):
    with open(json_path) as json_file:
        data = json.load(json_file)
        sample = data[0]
        numSamples = len(data)
        numTimesteps = len(data[0]['poses'])
        numFeatures = len(data[0]['poses'][0]['keypoints']) * 2 #multipled by two for x and y
        batch = np.ndarray((numSamples, numTimesteps, numFeatures), None)
        s = 0 #sample index
        for exercise in data:
            t = 0 #timestep index
            for pose in exercise['poses']:
                f = 0 #feature index
                for keypoint in pose['keypoints']:
                    x = keypoint['position']['x']
                    y = keypoint['position']['y']
                    batch[s][t][f] = x
                    batch[s][t][f+1] = y
                    f = f + 2
                t = t + 1
            s = s + 1
        shape = [numSamples, numTimesteps, numFeatures]
        return batch, shape

if(len(sys.argv) != 2):
    exit('Missing argument: \'json_path\'')
else:
    path = str(sys.argv[1])
    print('Converting JSON to NumPy')
    npArray, shape = convert(path)
    np.save('data', npArray)
    print('Data successfully converted and saved in \'data.npy\'')
    print('Data shape:')
    print(str(shape[0]) + ' samples in batch')
    print(str(shape[1]) + ' timesteps per sample')
    print(str(shape[2]) +  ' features per timestep')
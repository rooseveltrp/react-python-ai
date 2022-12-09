import cv2
import subprocess
import os

PATH_TO_MODELS = "/app/models"
PATH_TO_TEMP = "/app/_temp"
PATH_TO_UPLOAD = "/app/_uploads"

def detect_objects(img):
    with open("%s/classes.txt" % (PATH_TO_MODELS), 'r') as f:
        classes = f.read().splitlines()

    net = cv2.dnn.readNetFromDarknet(
        "%s/cat_dog_person.cfg" % PATH_TO_MODELS, 
        "%s/cat_dog_person.weights" % PATH_TO_MODELS, 
    )

    model = cv2.dnn_DetectionModel(net)
    model.setInputParams(scale=1/255, size=(416, 416), swapRB=True)

    classIds, scores, boxes = model.detect(img, confThreshold=0.6, nmsThreshold=0.4)

    detectedClasses = []

    for (classId, score, box) in zip(classIds, scores, boxes):
        detectedClasses.append({
            "class": classes[classId],
            "confidence": score,
            "position": (box[0], box[1], box[2], box[3])
        })

    return detectedClasses

if __name__ == "__main__":

    video_file = "/app/_uploads/Dog.mp4"
    audio_file = "/app/audio/Audio.mp3"
    output_file = "/app/_temp/_result.mp4"

    # read images from a directory
    for filename in os.listdir(PATH_TO_TEMP):
        if ".jpg" not in filename:
            continue
        frame = cv2.imread("%s/%s" % (PATH_TO_TEMP, filename))
        if frame is not None:
            objects = detect_objects(frame)
            for object in objects:
                box = object["position"]
                cv2.rectangle(frame, (box[0], box[1]), (box[0] + box[2], box[1] + box[3]), color=(0, 255, 0), thickness=5)
                text = object["class"]
                cv2.putText(frame, text, (box[0], box[1] - 5), cv2.FONT_HERSHEY_SIMPLEX, 50, color=(0, 255, 0), thickness=2)
            cv2.imwrite("%s/detections/%s" % (PATH_TO_TEMP, filename), frame)

    # use ffmpeg to convert images to video
    subprocess.call([
        "ffmpeg",
        "-framerate", "25",
        "-i", "%s/detections/%s" % (PATH_TO_TEMP, "output_%04d.jpg"),
        "-i", audio_file,
        "-map", "0:v",
        "-map", "1:a",
        "-c:v", "libx264",
        "-r", "30",
        "-pix_fmt", "yuv420p",
        output_file
    ])
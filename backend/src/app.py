import cv2
import subprocess
import os

from typing import Union
from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from pydantic import BaseModel

ALLOWED_EXTENSIONS = {"mp4"}
UPLOAD_FOLDER = "/app/_uploads"
FFMPEG = "/usr/bin/ffmpeg"
TEMP_FOLDER = "/app/_temp"
PATH_TO_MODELS = "/app/models"

class TikTokVideo(BaseModel):
    videoFile: str

def ml_detect_objects(img):
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

# FastAPI

app = FastAPI()

app.mount("/static", StaticFiles(directory="_temp"), name="static")

origins = [
    "http://localhost",
    "http://localhost:5000",
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
def hello_geek():
    return {"Hello": "Geek!"}

@app.get('/api/videos')
def get_videos():
    return {"videos": os.listdir(UPLOAD_FOLDER)}

@app.post('/api/upload')
async def upload_file(file: UploadFile = File(...)):

    if file.filename.split(".")[-1] not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="File extension not allowed")

    if len(file.filename) == 0:
        raise HTTPException(status_code=400, detail="Please select a file to upload")

    try:
        contents = file.file.read()
        dest = "%s/%s" % (UPLOAD_FOLDER, file.filename)
        with open(dest, 'wb') as f:
            f.write(contents)
    except Exception:
        return {"msg": "There was an error uploading the file"}
    finally:
        file.file.close()

    return {"msg": f"Successfully uploaded {file.filename}"}

@app.post('/api/extract-frames')
def extract_frames(tiktokVideo: TikTokVideo):

    video_path = "%s/%s" % ( UPLOAD_FOLDER, tiktokVideo.videoFile )

    if not os.path.exists(video_path):
        raise HTTPException(status_code=400, detail="Video file not found")

    # Delete all files in temp folder
    subprocess.getoutput("rm -rf %s/*.jpg" % TEMP_FOLDER)

    # # export frames from video using ffmpeg
    subprocess.call([FFMPEG, "-i", video_path, "%s/output_%%04d.jpg" % TEMP_FOLDER])

    # get all frames from temp folder
    frames = os.listdir(TEMP_FOLDER)

    return {
        "frames": frames,
    }

@app.post('/api/detect-objects')
def detect_objects():

    subprocess.getoutput("rm -rf %s/detections/*.jpg" % TEMP_FOLDER)

    # read images from a directory
    for filename in os.listdir(TEMP_FOLDER):
        if ".jpg" not in filename:
            continue
        frame = cv2.imread("%s/%s" % (TEMP_FOLDER, filename))
        if frame is not None:
            objects = ml_detect_objects(frame)
            for object in objects:
                box = object["position"]
                cv2.rectangle(frame, (box[0], box[1]), (box[0] + box[2], box[1] + box[3]), color=(0, 255, 0), thickness=5)
                text = object["class"]
                cv2.putText(frame, text, (box[0], box[1] - 5), cv2.FONT_HERSHEY_SIMPLEX, 5, color=(0, 255, 0), thickness=2)
            cv2.imwrite("%s/detections/%s" % (TEMP_FOLDER, filename), frame)

    # get all frames
    frames = os.listdir("%s/detections" % TEMP_FOLDER)

    return {
        "frames": frames,
    }

@app.post('/api/render-video')
def render_video():
    output_file = "/app/_temp/_result.mp4"
    audio_file = "/app/audio/Audio.mp3"
    # use ffmpeg to convert images to video
    subprocess.call([
        "ffmpeg",
        "-y",
        "-framerate", "25",
        "-i", "%s/detections/%s" % (TEMP_FOLDER, "output_%04d.jpg"),
        "-i", audio_file,
        "-map", "0:v",
        "-map", "1:a",
        "-c:v", "libx264",
        "-r", "30",
        "-pix_fmt", "yuv420p",
        "-shortest",
        output_file
    ])

    return {
        "video": os.path.basename(output_file),
    }

if __name__ == "__main__":
    app.run(debug=True)
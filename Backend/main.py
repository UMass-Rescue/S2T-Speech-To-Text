from fastapi import FastAPI, File, UploadFile,Response
from fastapi.middleware.cors import CORSMiddleware
from transcribeWhisper import transcribe
import os

app = FastAPI()

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World!!!! Lets Transcribe"}

@app.post("/uploadfile/")
async def create_upload_file(file_upload: UploadFile):
    data = await file_upload.read()
    path = os.path.join("../audioData",file_upload.filename)
    print(path)
    with open(path,'wb') as f:
        f.write(data)
    
    text = transcribe(path)
    return Response(content=text)
    # return {"filename": file_upload.filename,"text":text}

# @app.get("/transcribe/")
# async def transcribeAudio():

@app.post("/diarization/")
async def create_diarization(file_upload: UploadFile):
    data = await file_upload.read()
    path = os.path.join("../audioData",file_upload.filename)
    print(path)
    with open(path,'wb') as f:
        f.write(data)
    
    text = transcribe(path)
    return Response(content=text)
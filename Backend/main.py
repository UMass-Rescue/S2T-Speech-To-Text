from fastapi import FastAPI, File, UploadFile,Response
from fastapi.middleware.cors import CORSMiddleware
from transcribeWhisper import transcribe
from typing import List
import os
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from transcript_diarize import diarize

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
async def create_upload_file(file_upload: List[UploadFile]):
    # files = await file_upload
    text=list()
    returnDict = {}
    cnt=0
    for file in file_upload:
        data =await file.read()
        path = os.path.join("../audioData",file.filename)
        print(path)
        with open(path,'wb') as f:
            f.write(data)
        returnDict[cnt]={"file_name":file.filename,"transcript":transcribe(path)}
        cnt+=1
        # returnDict[file.filename] = transcribe(path)
    return returnDict

        #text.append(transcribe(path))
    # return text
        # json_compatible_item_data = jsonable_encoder(returnDict)
    # return JSONResponse(content=json_compatible_item_data)
        
    
    
    # return Response(content=text)
    # return {"filename": file_upload.filename,"text":text}

# @app.get("/transcribe/")
# async def transcribeAudio():

@app.post("/diarization/")
async def create_diarization(file_upload: List[UploadFile]):
    for file in file_upload:
        data =await file.read()
        path = os.path.join("../audioData",file.filename)
        with open(path,'wb') as f:
            f.write(data)
    diarize_output = diarize()
    return diarize_output

'''
    {
    0:
    {
    file_name:" "
    transcript:" "
    }
    }
'''
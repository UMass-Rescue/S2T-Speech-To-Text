from fastapi import FastAPI, File, UploadFile
from transcribeWhisper import transcribe

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World!!!! Lets Transcribe"}

@app.post("/uploadfile/")
async def create_upload_file(file_upload: UploadFile):
    data = await file_upload.read()
    path = file_upload.filename
    print(path)
    with open(path,'wb') as f:
        f.write(data)
    
    text = transcribe(path)
    return {"filename": file_upload.filename,"text":text}

# @app.get("/transcribe/")
# async def transcribeAudio():

import whisper

# whisper has multiple models that you can load as per size and requirements



def transcribe(path,target="en",modelName= "small.en"):
    # result = model.transcribe(path)
    model = whisper.load_model(modelName)
    result = model.transcribe(path,language=target,task="translate")
    print(result["text"])
    return result["text"]

# def translate(text,target="en"):
#     result = model.translate(text,target,task="translate")
#     print(result)
#     return result
# # path to the audio file you want to transcribe
# PATH = "Audio.mp3"

# result = model.transcribe(PATH)
# print(result["text"])
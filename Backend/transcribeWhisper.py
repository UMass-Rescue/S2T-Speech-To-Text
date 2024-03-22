import whisper

# whisper has multiple models that you can load as per size and requirements
model = whisper.load_model("small.en")


def transcribe(path):
    result = model.transcribe(path)
    print(result["text"])
    return result["text"]
# # path to the audio file you want to transcribe
# PATH = "Audio.mp3"

# result = model.transcribe(PATH)
# print(result["text"])
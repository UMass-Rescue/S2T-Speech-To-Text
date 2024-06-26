import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import "./App.css";

interface FileData {
  fileName: string;
  transcriptData: string;
}

const AudioDropDisplay: React.FC = () => {
  const [file, setFile] = useState<File[]>([]);
  const initialOutputText =
    "                                        Output Box";
  const loadingText = "                                          Loading...";
  const [outputText, setOutputText] = useState<string>(initialOutputText);
  var outputString = "";
  const [outputArray, setOutputArray] = useState<FileData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentFileName, setCurrentFileName] = useState<string>("");
  const [whisperVersion, setWhisperVersion] = useState<string>("");

  const transcribed_text = ""
  

  const onDrop = useCallback((acceptedFiles: File[]) => {
    //Accept array of file
    setFile((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, []);

  // Function to remove the selected audio file
  const removeAllAudio = () => {
    setFile([]); // Reset the file state to null
    setOutputText(initialOutputText);
    setCurrentFileName("");
  };

  const removeOneAudio = (index: number) => {
    setFile((currentFiles) => currentFiles.filter((_, idx) => idx !== index));
    if(file.length == 1){
      setOutputText(initialOutputText)
    } 
  };

  //Sourced from https://stackoverflow.com/questions/44656610/download-a-string-as-txt-file-in-react
  const downloadTextFile = () => {
    const element = document.createElement("a");
    const file = new Blob([outputText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "${currentFileName}.txt"; //Test to make it download name of file
    //element.download = "output.txt";
    document.body.appendChild(element);
    element.click();
  };

  const downloadAllTextFile = () => {
    outputArray.forEach((item) => {
      const file = new Blob([item.transcriptData], { type: "text/plain" });
      const element = document.createElement("a");

      element.href = URL.createObjectURL(file);
      element.download = "${item.fileName}.txt";
      document.body.appendChild(element);
      element.click();
    });
  };

  const nextButton = () => {
    if (currentIndex < outputArray.length - 1) {
      const nextInd = currentIndex + 1;
      setCurrentIndex(nextInd);
      const fileView = outputArray[nextInd];
      const outputUpdate = fileView.transcriptData;
      const outputNameUpdate = fileView.fileName;
      setOutputText(outputUpdate);
      setCurrentFileName(outputNameUpdate);
    }
  };

  const backButton = () => {
    if (currentIndex > 0) {
      const prevInd = currentIndex - 1;
      setCurrentIndex(prevInd);
      const fileView = outputArray[prevInd];
      const outputUpdate = fileView.transcriptData;
      const outputNameUpdate = fileView.fileName;
      setOutputText(outputUpdate);
      setCurrentFileName(outputNameUpdate);
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    setOutputText("Uploading files and transcribing it...")
    e.preventDefault();
    const formData = new FormData();
    file.forEach((file) => {
      formData.append("file_upload", file);
    });
    // formData.append("whisper_version", whisperVersion);
    console.log(formData);
    try {
      const endpoint = "http://127.0.0.1:8000/uploadfile/";
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("File Uploaded Successfully");
        const output = JSON.parse(await response.text());
        //var outputString = "";
        file.forEach((file, index) => {
          const fileName = file.name.toString();
          const transcriptData = output[index]["transcript"];
          // outputString = outputString + fileName + "\n";
          // outputString += output[0]["transcript"] + "\n";
          outputArray.push({ fileName, transcriptData });
          // console.log(output[fileName])
        });

        // console.log(output);
        // console.log(output[0]);
        // console.log(output[1]);

        // setOutputText(outputString);

        const fileView = outputArray[currentIndex];
        const outputUpdate = fileView.transcriptData;
        setOutputText(outputUpdate);
      } else {
        console.error("Failed to uplaod");
        console.error(response)
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDiarizeSubmit = async (e: { preventDefault: () => void }) => {
    setOutputText("Uploading files and diarizing it...")
    e.preventDefault();
    const formData = new FormData();
    file.forEach((file) => {
      formData.append("file_upload", file);
    });
    try {
      const endpoint = "http://127.0.0.1:8000/diarization/";
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("File Uploaded Successfully");
        const output = JSON.parse(await response.text());
        file.forEach((file, index) => {
          const fileName = file.name.toString();
          const transcriptData = output[index]["transcript"];
          outputString = outputString + fileName + "\n";
          outputString += output[0]["transcript"] + "\n";
          outputArray.push({ fileName, transcriptData });
        });
        const fileView = outputArray[currentIndex];
        const outputUpdate = fileView.transcriptData;
        setOutputText(outputUpdate);
      } else {
        console.error("Failed to uplaod");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "audip/mp3": [".mp3"],
      "audip/m4a": [".m4a"],
    }, // Accept audio files only
  });

  const summarizeText = async (e: { preventDefault: () => void }) => {
    setOutputText("Summarizing the output...")
    console.log("Summarizing Text");
    e.preventDefault();
    try {
      const endpoint = "http://127.0.0.1:8000/summarize/";
      const fileView = outputArray[currentIndex];
      const outputUpdate = fileView.transcriptData;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {'Accept': 'application/json',
        'Content-Type': 'application/json'},
        body: JSON.stringify({"transcribed_text": outputUpdate})
      });

      if (response.ok) {
        const response_output = JSON.parse(await response.text());
        const response_output_string = response_output["summarized_text"];
        setOutputText(response_output_string)
      } else {
        setOutputText("Error while summarizing text");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const endSession = async () => {
    try {
      const endpoint = "http://127.0.0.1:8000/endSession/";
      const response = await fetch(endpoint, {
        method: "POST"
      });
      if (response.ok) {
        console.log("Ending Session");
        setFile([]); // Reset the file state to null
        setOutputText("Ending Session");
        setCurrentFileName("");
        setOutputArray([])
        setCurrentIndex(0)
        window.close()
      }
    
    }
    catch(error){
      console.log(error)
    }
    };

  return (
    <div style={{ margin: "20px" }}>
      <div
        {...getRootProps()}
        style={{
          border: "2px dashed #000",
          padding: "20px",
          cursor: "pointer",
          backgroundColor: "white",
        }}
      >
        <input {...getInputProps()} />
        <p className="dropzone-text">
          Either Drop A File Here Or Click To Browse Your Device
        </p>
      </div>

      {/* Dropdown for selecting Whisper version
      {file.length > 0 && (
        <div style={{ marginTop: "10px" }}>
          <label htmlFor="whisper-ver-select">Choose a Whisper Model</label>
          <select
            id="whisper-ver-select"
            value={whisperVersion}
            onChange={(e) => setWhisperVersion(e.target.value)}
            style={{ marginLeft: "10px" }}
          >
            <option value="base.en">Base</option>
            <option value="small.en">Small</option>
            <option value="medium.en">Medium</option>
          </select>
        </div>
      )} */}
      {/* Display Submit Button and Remove Button, Once a file is uploaded */}
      {file.length > 0 && (
        <div
          style={{
            marginTop: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          <button className="button" onClick={handleSubmit}>Transcribe Audio</button>
          <button className="button" onClick={removeAllAudio}>Remove All Audio</button>
          <button className="button" onClick={handleDiarizeSubmit}>Diarize Audio</button>
        </div>
      )}
      {/* Display Files Attached */}
      {file.length > 0 && (
        <div style={{ marginTop: "10px" }}>
          <h4>Files Attached:</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {file.map((file, index) => (
              <li
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "5px",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    //flexGrow: 1,
                    marginRight: "10px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {file.name}
                </span>
                <button
                className="button"
                  onClick={() => removeOneAudio(index)}
                  style={{ marginLeft: "10px" }}
                >
                  X
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/*File being viewed text*/}
      {currentFileName && (
        <div style={{ marginTop: "10px" }}>
          <strong>Viewing File:</strong> {currentFileName}
        </div>
      )}

      {/* Output Box, by using Textarea element, should allow the box to expand with longer text*/}
      <textarea
        value={outputText}
        onChange={(e) => setOutputText(e.target.value)}
        style={{ marginTop: "20px", width: "100%", height: "150px" }}
        readOnly
      />
      {outputText !== initialOutputText && outputText !== loadingText && (
        <div
          style={{
            marginTop: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px"
          }}
        >
          {currentIndex > 0 && <button className="button" onClick={backButton}>Back</button>}
          <button className="button" onClick={downloadTextFile}>Download Output</button>
          {currentIndex < outputArray.length - 1 && (
            <button className="button" onClick={nextButton}>Next</button>
          )}
        </div>
      )}
      {outputText !== initialOutputText && outputText !== loadingText && (
        <div
          style={{
            marginTop: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          <button className="button" onClick={summarizeText}>Summarize Text</button>
          <button className="button" onClick={endSession}>End Session & Close Tab</button>
          <button className="button" onClick={downloadAllTextFile}>Download All Text</button>
        </div>
      )}
    </div>
  );
};

export default AudioDropDisplay;

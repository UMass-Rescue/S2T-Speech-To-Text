import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

const AudioDropDisplay: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Assuming you only want the first audio file if multiple are dropped
    const audioFile = acceptedFiles[0];
    setFile(audioFile);
  }, []);

  // Function to remove the selected audio file
  const removeAudio = () => {
    setFile(null); // Reset the file state to null
  };

  const handleSubmit = async() => {
    const formData = new FormData();
    formData.append("file_upload",file)

    try{
      const endpoint = "http://127.0.0.1:8000/uploadfile/"
      const  response = await fetch(endpoint,
        {
          method:"POST",
          body:formData
        });

        if(response.ok){
          console.log("File Uploaded Successfully")
        }else{
          console.error("Failed to uplaod")
        }
    }catch(error){
      console.error(error)
  }
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "audip/mp3": [".mp3"],
      "audip/m4a": [".m4a"],
    }, // Accept audio files only
  });

  return (
    <div>
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
      {/* Display Submit Button, Once a file is uplaoded */}
      {file && (
          <div style={{ marginTop: "10px" }}>
              <button onClick={handleSubmit}>Upload Audio</button>
          </div>
          )}

      {/*Display File attachd and Remove Button */}
      {file && (
        <div style={{ marginTop: "10px" }}>
          <p>File Attached: {file.name}</p>
          <button onClick={removeAudio}>Remove Audio</button>
        </div>
      )}
    </div>
  );
};

export default AudioDropDisplay;

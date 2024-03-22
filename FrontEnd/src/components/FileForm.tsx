import { useState } from "react";

function FileForm(){
    const[file,setFile] = useState(null);

    const handleFileInputChange = (event) => {
        console.log(event.target.files)
        setFile(event.target.files[0])
    }

    const handleSubmit = async(event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("file_upload",file)

        try{
        const endpoint = "http://127.0.0.1:8000/"
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
    return(
        <div>
            <h1>Upload File</h1>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileInputChange} />
                <button type="submit">Upload</button>
            </form>
        </div>
    )
}

export default FileForm;
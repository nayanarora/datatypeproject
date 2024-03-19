import React, { useState } from 'react';
import axios from 'axios';
import './csv.css';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const [modifiedDataTypes, setModifiedDataTypes] = useState({});
  const [uploadProgress, setUploadProgress] = useState(0); // State to track upload progress
  const [isUploading, setIsUploading] = useState(false); // State to indicate if upload is in progress

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setUploadProgress(0); // Reset progress when a new file is selected
  };

  const handleRemoveFile = () => {
    setFile(null);
    setResponseData(null);
    setError(null);
    setModifiedDataTypes({});
    setUploadProgress(0); // Reset progress
    setIsUploading(false); // Reset uploading state
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }
    setIsUploading(true); // Indicate upload has started
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('http://127.0.0.1:8000/data/infer/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: progressEvent => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted); // Update progress
        },
      });

      setResponseData(response.data);
      setError(null);
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while processing the file.');
      setResponseData(null);
    } finally {
      setIsUploading(false); // Reset uploading state after completion
    }
  };

  const handleModifyDataType = (column, dataType) => {
    const newDataType = prompt('Enter new data type:', dataType);
    if (newDataType !== null) {
      setModifiedDataTypes({ ...modifiedDataTypes, [column]: newDataType });
    }
  };

//   const mapDataType = (column, dataType) => {
//     const modifiedType = modifiedDataTypes[column];
//     if (modifiedType) {
//       return modifiedType;
//     } else if (dataType === 'datetime64[ns]' || dataType === 'timedelta64[ns]') {
//       return 'Date';
//     } else if (dataType === 'object') {
//       return 'Text';
//     } else if (dataType.includes('float')) {
//       return 'Number';
//     } else if (dataType.includes('int')) {
//       return 'Number';
//     }
//     return dataType;
//   };

  const mapDataType = (column, dataType) => {
    // Ensure dataType is always treated as a string
    const typeStr = String(dataType);
  
    const modifiedType = modifiedDataTypes[column];
    if (modifiedType) {
      return modifiedType;
    } else if (typeStr === 'datetime64[ns]' || typeStr === 'timedelta64[ns]') {
      return 'Date';
    } else if (typeStr === 'object') {
      return 'Text';
    } else if (typeStr.includes('float')) {
      return 'Number';
    } else if (typeStr.includes('int')) {
      return 'Number';
    }
    return dataType;
  };
  const handleSaveModifiedCSV = async () => {
    try {
        const response = await axios.post('http://127.0.0.1:8000/data/save/', {
            modifiedDataTypes: modifiedDataTypes, // Assuming this state exists and tracks modifications
        });
        alert('CSV saved successfully'); // Notify user of success
    } catch (error) {
        console.error('Error saving modified CSV:', error);
        alert('Failed to save CSV'); // Notify user of failure
    }
};

  return (
    <div className="container">
      <header className="header">
        <h1 id="Rhombus" style={{ color: 'black', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>Rhombus</h1>
      </header>
      <div className="content">
        <h3 className="title">Upload a CSV</h3>
        <form onSubmit={handleSubmit} className="form">
          <label htmlFor="file-upload" className="custom-file-upload">
            {file ? file.name : 'Choose File'}
            <input id="file-upload" type="file" onChange={handleFileChange} />
          </label>
          {file && (
            <button type="button" onClick={handleRemoveFile} className="remove-button">
              Remove
            </button>
          )}
          <button type="submit" className="upload-button">
            Upload
          </button>
        </form>

        {isUploading && (
          <div className="upload-progress">
            <progress value={uploadProgress} max="100" />
            <p>Uploading: {uploadProgress}%</p>
          </div>
        )}

        {responseData && (
          <div className="data-types">
            <br /><br /><h2>Data Type Inferences</h2>
            <div className="card-container">
              {Object.entries(responseData).map(([column, dataType], index) => (
                <div key={column} className="data-card">
                  <h3 className="card-title">{column}</h3>
                  <p className="card-content">{mapDataType(column, dataType)}</p>
                  {/* <button
                    onClick={() => handleModifyDataType(column, dataType)}
                    className="modify-button"
                  >
                    Modify
                    </button> */}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* {responseData && responseData.preview_rows && responseData.preview_rows.length > 0 && (
            <div className="preview-container">
                <h3>Preview of Uploaded Data</h3>
                <table className="preview-table">
                <thead>
                    <tr>
                    {Object.keys(responseData.preview_rows[0]).map((key) => (
                        <th key={key}>
                        {key} ({responseData.data_types[key]})
                        </th>
                    ))}
                    </tr>
                </thead>
                <tbody>
                    {responseData.preview_rows.map((row, index) => (
                    <tr key={index}>
                        {Object.entries(row).map(([key, value], idx) => (
                        // Using Object.entries() to ensure alignment with keys and handling null/undefined values
                        <td key={idx}>{value !== null && value !== undefined ? value.toString() : ''}</td>
                        ))}
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
        )} 
        <button onClick={handleSaveModifiedCSV} className="save-button">Save Modified CSV</button>
        */}
        
        
        {error && (
          <div className="error">
            <p>Error: {error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;

                

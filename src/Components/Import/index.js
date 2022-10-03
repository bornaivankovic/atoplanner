import { Button } from "@mui/material";
import React, { useRef } from "react";
import { B64ToJson } from "../../utils/utils";
import "./Import.css";

function Import() {
  const inputRef = useRef();
  const textRef = useRef();
  let reader;
  function handleB64Build() {
    let b64str;
    if (reader !== undefined && reader.readyState === 2) {
      b64str = reader.result;
    } else {
      b64str = textRef.current.value;
    }
    window.localStorage.setItem("persist:root", B64ToJson(b64str));
    window.location.reload();
  }
  function parseInputFile(file) {
    reader = new FileReader();
    reader.onloadend = handleB64Build;
    reader.readAsText(file);
  }
  return (
    <div className="Import">
      <div>
        <textarea ref={textRef} placeholder="Input your base64 encoded build" />
        <br />
        <Button variant="contained" onClick={handleB64Build}>IMPORT</Button>
      </div>
      <div>
        <input
          type="file"
          ref={inputRef}
          onChange={(e) => parseInputFile(e.target.files[0])}
        />
      </div>
    </div>
  );
}

export default Import;

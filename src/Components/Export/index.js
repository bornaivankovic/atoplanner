import React, { useRef } from "react";
import "./Export.css";
import { useStore } from "react-redux";
import { jsonToB64 } from "../../utils/utils";
import { Button } from "@mui/material";

function Export() {
  const store = useStore();
  const stateB64 = jsonToB64(store.getState());
  const textRef = useRef();
  function exportToFile() {
    const blob = new Blob([stateB64]);
    const fileDownloadUrl = URL.createObjectURL(blob);
    let link = document.createElement("a");
    link.setAttribute("download", "");
    link.href = fileDownloadUrl;
    link.click();
    URL.revokeObjectURL(fileDownloadUrl);
  }
  function selectAll() {
    textRef.current.select();
  }
  return (
    <div className="Export">
      <div>
        <textarea
          onFocus={selectAll}
          ref={textRef}
          defaultValue={stateB64}
          readOnly
        />
      </div>
      <div>
        <Button variant="contained" onClick={exportToFile}>DOWNLOAD</Button>
      </div>
    </div>
  );
}
export default Export;

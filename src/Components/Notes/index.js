import React from "react";
import ReactQuill from "react-quill";
import "./Notes.css";
import "react-quill/dist/quill.snow.css";
import { useDispatch, useSelector } from "react-redux";
import { selectNotes, setNoteContents } from "../../Redux/Reducers/Notes";

function Notes() {
  const dispatch = useDispatch();
  const notes = useSelector(selectNotes);
  function updateNotes(html) {
    dispatch(setNoteContents({ noteContents: html }));
  }
  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"], // toggled buttons
      ["blockquote", "code-block"],

      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }], // superscript/subscript
      [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
      [{ direction: "rtl" }], // text direction
      [{ size: ["small", false, "large", "huge"] }],
      [({ color: [] }, { background: [] })], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],

      ["clean"], // remove formatting button
    ],
  };
  return (
    <ReactQuill
      className="Notes"
      theme="snow"
      value={notes}
      modules={modules}
      onChange={updateNotes}
    />
  );
}

export default Notes;

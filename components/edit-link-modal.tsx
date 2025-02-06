import { useEffect, useRef } from "react";
import Button from "./button";

export default function EditLinkModal({
  dialogOpen,
  setDialogOpen,
  editLink
}: {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  editLink: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>();
  const editLinkRef = useRef<HTMLInputElement>();

  useEffect(() => {
    import("dialog-polyfill").then(dp => {
      dp.default.registerDialog(dialogRef.current);
    });
    if (dialogOpen) {
      dialogRef.current.showModal();
      editLinkRef.current.focus();
      editLinkRef.current.select();
      document.execCommand("copy");
    }
  }, [dialogOpen]);

  return (
    <dialog ref={dialogRef}>
      <div className="content-container">
        <div className="edit-link">
          <h2>Secret Edit Link</h2>
          <input ref={editLinkRef} type="text" value={editLink} readOnly />
          <p>
            The edit link has been copied to your clipboard! Please don't share it with anyone 
            you don't want editing your page.
          </p>
        </div>

        <p
          className="close"
          onClick={() => {
            dialogRef.current.close();
            setDialogOpen(false);
          }}
        >
          Close
        </p>
      </div>
      <style jsx>{`
        dialog {
          display: none;
        }
        dialog[open] {
          display: flex;
          background: #f9d749;
          border-radius: 6px;
          position: fixed;
          height: 300px;
          width: 600px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        dialog::backdrop {
          background: rgba(0, 0, 0, 0.4);
        }
        .content-container {
          height: 100%;
          width: 100%;
          padding: 10px 15px;
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .edit-link input {
          height: 53px;
          width: 447px;
          border-radius: 5px;
          border: none;
          background: #000;
          color: #fff;
          font-family: "Comic Sans Ms", Menlo, monospace;
          font-size: 24px;
        }
        .edit-link h2 {
          font-size: 40px;
          margin-top: 24px;
          margin-bottom: 16px;
        }
        p {
          font-size: 12px;
          width: 400px;
          padding: 16px;
          font-weight: bold;
          font-family: Menlo, monospace;
        }
        .close {
          font-size: 16px;
          width: fit-content;
          cursor: pointer;
        }

        @media (max-width: 500px) {
          dialog[open] {
            width: 100%;
          }
          .edit-link input {
            width: 80%;
          }
          .edit-link p {
            width: 80%;
            margin: auto;
          }
        }
      `}</style>
    </dialog>
  );
}

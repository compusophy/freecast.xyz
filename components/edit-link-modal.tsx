import { useEffect, useRef } from "react";
import dialogPolyfill from "dialog-polyfill";

interface EditLinkModalProps {
  editLink: string;
  open: boolean;
  onClose: () => void;
}

export default function EditLinkModal({ editLink, open, onClose }: EditLinkModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const editLinkRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Only run if we have a dialog element
    if (dialogRef.current) {
      dialogPolyfill.registerDialog(dialogRef.current);
    }
  }, []);

  useEffect(() => {
    if (open && dialogRef.current && editLinkRef.current) {
      dialogRef.current.showModal();
      editLinkRef.current.select();
      editLinkRef.current.focus();
    }
  }, [open]);

  return (
    <dialog 
      ref={dialogRef} 
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) {
          dialogRef.current?.close();
        }
      }}
    >
      <input
        ref={editLinkRef}
        readOnly
        value={editLink}
        onClick={(e) => (e.target as HTMLInputElement).select()}
      />
      <style jsx>{`
        dialog {
          position: fixed;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          margin: 0;
          padding: 12px;
          background: #fff;
          border-radius: 8px;
          z-index: 100;
          border: none;
        }
        dialog::backdrop {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          background: rgba(255, 255, 255, 0.3);
        }
        input {
          font-family: Menlo, monospace;
          font-size: 16px;
          padding: 8px;
          border: none;
          border-radius: 4px;
          background: #eee;
          min-width: 300px;
        }
      `}</style>
    </dialog>
  );
}

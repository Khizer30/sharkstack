import { useEffect } from "react";

export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && onClose();
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2>{title}</h2>
          <button type="button" aria-label="Close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  );
}

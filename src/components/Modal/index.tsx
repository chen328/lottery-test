import React, { useEffect } from "react";
import "./index.less";

export interface IModal {
  onClose?(): void;
  visible?: boolean;
  showClose?: boolean;
  children?: React.ReactNode;
  className?: string
}

const Modal: React.FC<IModal> = ({ className, children, ...props }) => {
  const { showClose, onClose } = props;

  function preventDefault(e) {
    e.preventDefault();
  }

  useEffect(() => {
    document.addEventListener('touchmove', preventDefault, { passive: false });

    return () => {
      document.removeEventListener('touchmove', preventDefault, { passive: false } as any);
    }
  }, [])

  return <div className={`modal ${className}`}>
    <div className="modal-body">
      {children}
      {showClose && <div className="modal-close" onClick={onClose} />}
    </div>
  </div>;
};

export default Modal;

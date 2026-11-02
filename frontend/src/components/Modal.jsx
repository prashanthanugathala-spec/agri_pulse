import React, { useEffect, useRef } from 'react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-lg',
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      {/* Modal Dialog */}
      <div
        ref={modalRef}
        className={`relative w-full ${maxWidth} bg-white rounded-[28px] p-6 lg:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-black/[0.06] z-10 max-h-[90vh] overflow-y-auto transform transition-all animate-in fade-in zoom-in-95 duration-200`}
      >
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-black/[0.04]">
          <div>
            <h2 className="text-xl font-medium text-[#1D1D1F] tracking-tight">{title}</h2>
            {subtitle && <p className="text-xs text-[#6E6E73] mt-1">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#6E6E73] hover:bg-black/5 hover:text-[#1D1D1F] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;

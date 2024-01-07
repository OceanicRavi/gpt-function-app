import React from 'react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ isOpen, onConfirm, onCancel, message }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded">
        <p>{message}</p>
        <div className="flex justify-end mt-4">
          <button onClick={onCancel} className="mr-2 px-4 py-2 rounded bg-gray-200">No</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded bg-red-500 text-white">Yes</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;

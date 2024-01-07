import React from 'react';
import { Button } from '@tremor/react';

interface DropdownMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ isOpen, onToggle, onEdit, onDelete }) => {
  return (
    <div>
      <Button onClick={onToggle} className="text-white text-left text-base font-large">
        ⋮ {/* This is the vertical three dots icon */}
      </Button>
      {isOpen && (
        <div className="absolute right-0 w-48 py-2 mt-2 bg-white rounded-md shadow-xl z-20">
          <button className="block px-4 py-2 w-full text-sm capitalize text-gray-700 hover:bg-blue-500 hover:text-white" onClick={onEdit}>
            Edit
          </button>
          <button className="block px-4 py-2 w-full text-sm capitalize text-gray-700 hover:bg-red-500 hover:text-white" onClick={onDelete}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Text
} from '@tremor/react';
import { DropdownMenu } from './dropdown';
import ConfirmationDialog from './confirmationDialog';
import useGptFunctionData from '../utils/useGptFunctionData';
import { useRouter } from 'next/navigation';
import { SparklesIcon } from '@heroicons/react/24/outline';

interface GptFunctionRecords {
  id: number;
  name: string;
  createdBy: string;
  lastModified: string;
  fileSize: string;
  function: any;
}


export default function GptFunctionTable({ records }: { records: GptFunctionRecords[] }) {
  const router = useRouter();
  const { deleteFunction } = useGptFunctionData();
  const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedFunctionId, setSelectedFunctionId] = useState<number | null>(null);

  const handleEdit = (id: number) => {
    // Logic for handling edit
    console.log(`Edit record with id: ${id}`);
    router.push(`/gptfunction?id=${id}`);
  };

  const handleDelete = (id: number) => {
    // Logic for handling delete
    console.log(`Delete record with id: ${id}`);
    setActiveDropdownId(null);
    setIsDeleteConfirmOpen(true);
    setSelectedFunctionId(id);
  };

  const confirmDelete = async () => {
    if (selectedFunctionId) {
      await deleteFunction(selectedFunctionId);
      router.refresh(); //TODO: need a better way to refresh table data
    }
    setIsDeleteConfirmOpen(false);
  };

  const toggleDropdown = (id: number) => {
    setActiveDropdownId(activeDropdownId === id ? null : id);
  };
  
  return (
    <>
    <ConfirmationDialog
      isOpen={isDeleteConfirmOpen}
      onConfirm={confirmDelete}
      onCancel={() => setIsDeleteConfirmOpen(false)}
      message="Are you sure that you want to delete this function? This action cannot be undone."
    />
    <Table className="text-white text-left text-base font-large rounded w-full rounded bg-white bg-opacity-10 gap-2 px-4 py-2 mt-6">
      <TableHead>
        <TableRow>
          <TableHeaderCell className="w-1/2">Name</TableHeaderCell>
          <TableHeaderCell>Created by</TableHeaderCell>
          <TableHeaderCell>Last modified</TableHeaderCell>
          <TableHeaderCell>File size</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {records.map((record) => (
          <TableRow key={record.id}>
            <TableCell className="mt-2 flex items-center"><SparklesIcon className="h-5 md:ml-4 text-white text-base font-medium mr-2" />{record.name}</TableCell>
            <TableCell>
              <Text>{record.createdBy}</Text>
            </TableCell>
            <TableCell>
              <Text>{record.lastModified}</Text>
            </TableCell>
            <TableCell>
              <Text>{record.fileSize}</Text>
            </TableCell>
            <TableCell>
            <DropdownMenu
                isOpen={activeDropdownId === record.id}
                onToggle={() => toggleDropdown(record.id)}
                onEdit={() => handleEdit(record.id)}
                onDelete={() => handleDelete(record.id)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </>
  );
}

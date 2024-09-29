'use client'

import React, { useState } from "react";
import { ColumnSchema, DataTable } from "./datatable";
import { Button } from "@/components/ui/button";
import { Trash2, FolderPlus } from "lucide-react";

export type Upload = {
    id: number
    uploadName: string
    source: 'local' | 'web'
    createdAt: Date
}

const columnSchema: ColumnSchema = [
    {
        accessorKey: 'uploadName',
        header: 'Upload Name',
        allowSorting: false,
    },
    {
        accessorKey: 'source',
        header: 'Source',
        allowSorting: true,
    },
    {
        accessorKey: 'createdAt',
        header: 'Creation date',
        allowSorting: true,
        valueModifier: (value: Date) => {
            return value.toLocaleDateString('en-US')
        },
        align: 'left'
    },
]

const data: Upload[] = [
    {
      id: 1,
      uploadName: 'Project Report',
      source: 'local',
      createdAt: new Date('2023-08-12'),
    },
    {
      id: 2,
      uploadName: 'Profile Picture',
      source: 'web',
      createdAt: new Date('2023-09-05'),
    },
    {
      id: 3,
      uploadName: 'Sales Data',
      source: 'local',
      createdAt: new Date('2024-01-10'),
    },
    {
      id: 4,
      uploadName: 'Company Logo',
      source: 'web',
      createdAt: new Date('2024-02-20'),
    },
    {
      id: 5,
      uploadName: 'Presentation Slides',
      source: 'local',
      createdAt: new Date('2024-03-15'),
    },
];

const ActionFooter = ({ selectedCount, onDelete, onAddToCollection }: {
    selectedCount: number;
    onDelete: () => void;
    onAddToCollection: () => void;
  }) => {
    console.log(selectedCount)
    if (selectedCount === 0) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-end items-center space-x-4">
            <span className="mr-auto font-medium">{selectedCount} item(s) selected</span>
            <Button variant="outline" onClick={onDelete}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
            </Button>
            <Button onClick={onAddToCollection}>
                <FolderPlus className="w-4 h-4 mr-2" />
                Add to Collection
            </Button>
        </div>
    );
};

export default function UploadsTable() {
    const [rowSelection, setRowSelection] = useState({});

    const handleDelete = () => {
        console.log("Delete action for selected rows");
        // Implement delete logic here
    };

    const handleAddToCollection = () => {
        console.log("Add to collection action for selected rows");
        // Implement add to collection logic here
    };

    console.log(rowSelection)
    const selectedCount = Object.keys(rowSelection).length;

    return (
        <div className="relative min-h-screen pb-16">
            <DataTable 
                data={data} 
                columnSchema={columnSchema} 
                searchColumn="uploadName" 
                rowSelection={rowSelection}
                setRowSelection={setRowSelection}
            />
            <ActionFooter 
                selectedCount={selectedCount}
                onDelete={handleDelete}
                onAddToCollection={handleAddToCollection}
            />
        </div>
    );
}
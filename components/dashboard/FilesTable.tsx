'use client'

import React, { useState } from "react";
import { ColumnSchema, DataTable } from "./datatable";
import { Button } from "@/components/ui/button";
import { Trash2, FolderPlus } from "lucide-react";

export type File = {
    id: number;
    fileName: string;
    uploadName: string;
    source: 'local' | 'web';
    fileType: 'pdf' | 'txt' | 'md' | 'html' | 'other'; // New field to track file types
    createdAt: Date;
}

const columnSchema: ColumnSchema = [
    {
        accessorKey: 'fileName',
        header: 'File Name',
        allowSorting: true,
    },
    {
        accessorKey: 'uploadName',
        header: 'Upload Name',
        allowSorting: false,
    },
    {
        accessorKey: 'fileType',
        header: 'File Type',
        allowSorting: true,
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

const data: File[] = [
    {
      id: 1,
      fileName: 'project_report.pdf',
      uploadName: 'Project Report',
      source: 'local',
      fileType: 'pdf',
      createdAt: new Date('2023-08-12'),
    },
    {
      id: 2,
      fileName: 'profile_picture.jpg',
      uploadName: 'Profile Picture',
      source: 'web',
      fileType: 'other',
      createdAt: new Date('2023-09-05'),
    },
    {
      id: 3,
      fileName: 'sales_data.txt',
      uploadName: 'Sales Data',
      source: 'local',
      fileType: 'txt',
      createdAt: new Date('2024-01-10'),
    },
    {
      id: 4,
      fileName: 'company_logo.png',
      uploadName: 'Company Logo',
      source: 'web',
      fileType: 'other',
      createdAt: new Date('2024-02-20'),
    },
    {
      id: 5,
      fileName: 'presentation.md',
      uploadName: 'Presentation Slides',
      source: 'local',
      fileType: 'md',
      createdAt: new Date('2024-03-15'),
    },
];

const ActionFooter = ({ selectedCount, onDelete, onAddToCollection }: {
    selectedCount: number;
    onDelete: () => void;
    onAddToCollection: () => void;
  }) => {
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

export default function FilesTable() {
    const [rowSelection, setRowSelection] = useState({});

    const handleDelete = () => {
        console.log("Delete action for selected files");
        // Implement delete logic here
    };

    const handleAddToCollection = () => {
        console.log("Add to collection action for selected files");
        // Implement add to collection logic here
    };

    const selectedCount = Object.keys(rowSelection).length;

    return (
        <div className="relative min-h-screen pb-16">
            <DataTable 
                data={data} 
                columnSchema={columnSchema} 
                searchColumn="fileName" 
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
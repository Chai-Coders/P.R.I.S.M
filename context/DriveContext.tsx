import React, { createContext, useContext, useState } from 'react';
import { DriveDocument, FileCategory, SortField, SortOrder, ViewMode } from '../types/drive';

export const INITIAL_DOCUMENTS: DriveDocument[] = [
  {
    id: 'doc-1',
    name: 'Quarterly_Financial_Report_Q3.pdf',
    category: 'pdf',
    size: '2.4 MB',
    updatedAt: '2 hours ago',
    isStarred: true,
    contentSnippet: 'Quarterly earnings report summary including key metrics, revenue growth, and budget allocation for Q3.',
    thumbnailColor: '#EA4335',
  },
  {
    id: 'doc-2',
    name: 'Invoice_Scan_Store_Receipt.scan',
    category: 'scan',
    size: '1.1 MB',
    updatedAt: 'Yesterday',
    isStarred: false,
    contentSnippet: 'Scanned receipt from Hardware Store. Total amount $342.50. Itemized hardware supplies.',
    thumbnailColor: '#34A853',
  },
  {
    id: 'doc-3',
    name: 'Project_PRISM_Architecture_Diagram.png',
    category: 'image',
    size: '4.8 MB',
    updatedAt: '3 days ago',
    isStarred: true,
    contentSnippet: 'High resolution screenshot of system workflow diagram and UI components blueprint.',
    thumbnailColor: '#FBBC04',
  },
  {
    id: 'doc-4',
    name: 'Meeting_Notes_Product_Strategy.doc',
    category: 'doc',
    size: '650 KB',
    updatedAt: 'Aug 12, 2026',
    isStarred: false,
    contentSnippet: 'Product roadmap update meeting notes. Key milestones for Q4 launch and design updates.',
    thumbnailColor: '#4285F4',
  },
  {
    id: 'doc-5',
    name: 'Medical_Insurance_Claim_Form.pdf',
    category: 'pdf',
    size: '1.8 MB',
    updatedAt: 'Aug 05, 2026',
    isStarred: false,
    contentSnippet: 'Signed medical health insurance claim form for annual checkup reimbursement.',
    thumbnailColor: '#EA4335',
  },
];

interface DriveContextType {
  documents: DriveDocument[];
  filteredDocuments: DriveDocument[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: FileCategory;
  setSelectedCategory: (cat: FileCategory) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  sortField: SortField;
  setSortField: (field: SortField) => void;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
  toggleStar: (id: string) => void;
  deleteDocument: (id: string) => void;
  renameDocument: (id: string, newName: string) => void;
  addDocument: (doc: Omit<DriveDocument, 'id' | 'updatedAt'>) => void;
  clearAllDocuments: () => void;
  resetSampleDocuments: () => void;
}

const DriveContext = createContext<DriveContextType | undefined>(undefined);

export const DriveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<DriveDocument[]>(INITIAL_DOCUMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FileCategory>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const toggleStar = (id: string) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, isStarred: !doc.isStarred } : doc))
    );
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const renameDocument = (id: string, newName: string) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, name: newName } : doc))
    );
  };

  const addDocument = (doc: Omit<DriveDocument, 'id' | 'updatedAt'>) => {
    const newDoc: DriveDocument = {
      ...doc,
      id: `doc-${Date.now()}`,
      updatedAt: 'Just now',
    };
    setDocuments((prev) => [newDoc, ...prev]);
  };

  const clearAllDocuments = () => {
    setDocuments([]);
  };

  const resetSampleDocuments = () => {
    setDocuments(INITIAL_DOCUMENTS);
  };

  // Filter & Sort Logic
  const filteredDocuments = documents
    .filter((doc) => {
      // Category filter
      if (selectedCategory === 'starred') {
        if (!doc.isStarred) return false;
      } else if (selectedCategory !== 'all') {
        if (doc.category !== selectedCategory) return false;
      }

      // Search query filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        return (
          doc.name.toLowerCase().includes(query) ||
          (doc.contentSnippet && doc.contentSnippet.toLowerCase().includes(query))
        );
      }

      return true;
    })
    .sort((a, b) => {
      if (sortField === 'name') {
        return sortOrder === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      return 0; // Default order by array position
    });

  return (
    <DriveContext.Provider
      value={{
        documents,
        filteredDocuments,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        viewMode,
        setViewMode,
        sortField,
        setSortField,
        sortOrder,
        setSortOrder,
        toggleStar,
        deleteDocument,
        renameDocument,
        addDocument,
        clearAllDocuments,
        resetSampleDocuments,
      }}
    >
      {children}
    </DriveContext.Provider>
  );
};

export const useDrive = () => {
  const context = useContext(DriveContext);
  if (!context) {
    throw new Error('useDrive must be used within a DriveProvider');
  }
  return context;
};

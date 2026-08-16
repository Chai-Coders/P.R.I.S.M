export type FileCategory = 'all' | 'pdf' | 'scan' | 'image' | 'doc' | 'starred';

export type ViewMode = 'grid' | 'list';

export type SortField = 'name' | 'date' | 'size';
export type SortOrder = 'asc' | 'desc';

export interface DriveDocument {
  id: string;
  name: string;
  category: Exclude<FileCategory, 'all' | 'starred'>;
  size: string;
  updatedAt: string;
  isStarred: boolean;
  contentSnippet?: string;
  thumbnailColor?: string;
}

export type ThemeMode = 'light' | 'dark';

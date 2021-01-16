interface Folder {
  location: string;
  name: string;
  thumbnail?: string;
}

interface FolderFilterParams {
  name?: string;
  category?: string;
  language?: string;
  tag?: [
    {
      tagType: string;
      tagName: string;
    }
  ];
}

interface FolderQueryResult {
  folders?: Array<Folder>;
  message: string;
  status: number;
}

export { Folder, FolderFilterParams, FolderQueryResult };

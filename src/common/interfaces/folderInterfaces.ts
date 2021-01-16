interface folder {
  location: string;
  name: string;
  thumbnail?: string;
}

interface folderFilterParams {
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

interface folderQueryResult {
  folders?: Array<folder>;
  message: string;
  status: number;
}

export { folder, folderFilterParams, folderQueryResult };

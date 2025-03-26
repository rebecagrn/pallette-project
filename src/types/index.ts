export interface Image {
  id: string;
  url: string;
  groupIds: string[];
  tagIds: string[];
  comments: Comment[];
  createdAt: Date;
}

export interface ColorPalette {
  id: string;
  colors: string[];
  name: string;
  groupIds: string[];
  tagIds: string[];
  comments: Comment[];
  createdAt: Date;
}

export interface Group {
  id: string;
  name: string;
  parentId?: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface Comment {
  id: string;
  text: string;
  createdAt: Date;
  updatedAt?: Date;
}

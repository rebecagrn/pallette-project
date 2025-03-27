export interface ImageProps {
  id: string;
  url: string;
  groupIds: string[];
  tagIds: string[];
  comments: CommentProps[];
  createdAt: string;
  isFavorite?: boolean;
}

export interface ColorPaletteProps {
  id: string;
  colors: string[];
  name: string;
  groupIds: string[];
  tagIds: string[];
  comments: CommentProps[];
  createdAt: string;
  isFavorite?: boolean;
}

export interface GroupProps {
  id: string;
  name: string;
  parentId?: string;
}

export interface TagProps {
  id: string;
  name: string;
}

export interface CommentProps {
  id: string;
  imageId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

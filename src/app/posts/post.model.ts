export interface Post {
  id: string,
  title: string,
  content: string,
  imagePath: string,
  creator: string
}

export interface EditablePost {
  id: string,
  title: string,
  content: string,
  image: File | string
}
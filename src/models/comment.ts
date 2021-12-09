interface Comment {
  articleId: string
  uid: string
  parentId: string | null
  text: string
}

export default Comment

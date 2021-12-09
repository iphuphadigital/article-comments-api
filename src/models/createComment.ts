interface CreateComment {
  articleId: string
  parentId?: string | null
  text: string
}

export default CreateComment

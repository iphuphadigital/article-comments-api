interface CreateComment {
  uid: string
  reference: string
  parentId?: string | null
  text: string
}

export default CreateComment

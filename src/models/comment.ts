interface Comment {
  reference: string
  uid: string
  parentId: string | null
  text: string
}

export default Comment

export type Prompt = {
  unique_key: string
  description: string
  uuid: string
}
export type Organization = {
  name: string
  description: string
  uuid: string
}
export type Project = {
  name: string
  description: string
  uuid: string
}


export type UserResp = {
  data: {
    user: {
      email: string
      username: string
      display: string
    },
    methods: [
      {
        method: string
        at: number
        email: string
      }
    ]
  },
  meta: {
    is_authenticated: boolean
  }
}

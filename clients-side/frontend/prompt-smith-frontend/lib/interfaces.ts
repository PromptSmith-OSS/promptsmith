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

export type PayloadBody = Record<string, unknown>

export type Headers = Record<string, string>


export type RequestOptions = {
  method: string;
  headers: {
    accept?: string;
    'X-CSRFToken'?: string;
    'Content-Type'?: string;
    'X-Email-Verification-Key'?: string;
    'X-Password-Reset-Key'?: string;

  };
  credentials?: string;
  body?: string;
}

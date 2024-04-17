export interface VerificationCode {
  code: string | null;
  email: string;
  receivedAt: Date;
  sender: string;
  emailText: string;
}

export interface Email {
  internalDate: string;
  payload: EmailPayload;
}

export interface EmailPayload {
  headers: {
    name: string;
    value: string;
  }[];
  mimeType: string;
  parts: EmailPayload[];
  body: { data: string };
}

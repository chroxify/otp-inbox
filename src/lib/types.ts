export interface VerificationCode {
  code: string;
  email: string;
  receivedAt: Date;
  sender: string;
  emailText: string;
}

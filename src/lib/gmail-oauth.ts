import { OAuthService } from "@raycast/utils";

const clientId = "40309893347-6omfsvp2l10u2fhrvnpug51m11s0jt3s.apps.googleusercontent.com";

export async function authorize(): Promise<string> {
  const google = OAuthService.google({
    clientId: clientId,
    scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/gmail.readonly",
  });

  // Authorize with Google
  const authRequest = await google.authorize();

  return authRequest;
}

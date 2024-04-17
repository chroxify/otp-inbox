import { VerificationCode } from "./types";

export function extractVerificationCode(text: string): string {
  const patterns: RegExp[] = [
    /\b\w*(?:-\w*)+\b/g, // Pattern for codes with hyphen
    /\b\d{3,4}\s?\d{3,4}\b/g, // Pattern for 6-8 digit numeric codes with optional space
  ];

  const verificationCodes: string[] = [];

  // Extract the verification codes
  for (const pattern of patterns) {
    const matches = text.match(pattern);
    if (matches && matches.length > 0) {
      for (const match of matches) {
        if (pattern.source === /\b\w*(?:-\w*)+\b/g.source) {
          // Check if the parts on either side of the hyphen have equal length
          const parts = match.split("-");
          if (parts.length === 2 && parts[0].length === parts[1].length) {
            verificationCodes.push(match);
          }
        } else {
          verificationCodes.push(match);
        }
      }
    }
  }

  return verificationCodes[0] || "";
}

export function processEmails(emails: any[]): VerificationCode[] {
  // Valiadate if there are emails
  if (!emails || emails.length === 0) {
    console.log("No emails found");
    return [];
  }

  // List of verification codes
  const verificationCodes: VerificationCode[] = [];

  // Loop through the emails
  emails.forEach((email) => {
    try {
      // Email headers
      const headers = email["payload"]["headers"];

      // Extract the verification code from the email
      const verificationCode = extractVerificationCode(atob(email["payload"]["parts"][0]["body"]["data"]));

      if (!verificationCode) {
        console.log("No verification code found");
        return;
      }

      // Add the verification code to the list
      verificationCodes.push({
        code: verificationCode,
        email: headers[0]["value"],
        receivedAt: new Date(parseInt(email["internalDate"], 10)),
        sender: headers.find((header: any) => header.name === "From").value?.split(" ")[0],
        emailText: atob(email["payload"]["parts"][0]["body"]["data"]),
      });
    } catch (error) {
      console.log("Failed to process email", error);
    }
  });

  return verificationCodes;
}

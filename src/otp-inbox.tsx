import { ActionPanel, List, Action, Color, Icon, getFrontmostApplication, Detail } from "@raycast/api";
import { Clipboard, showHUD } from "@raycast/api";
import { getEmails } from "./lib/gmail";
import { getTimeAgo, processEmails } from "./lib/utils";
import { VerificationCode } from "./lib/types";
import AuthWrapper from "./components/auth-wrapper";
import React from "react";

export default function OTPInbox() {
  const [frontmostApp, setFrontmostApp] = React.useState<string>("");
  const [verificationCodes, setVerificationCodes] = React.useState<VerificationCode[] | null>(null);

  async function getVerificationCodes() {
    // Get the emails
    const emails = await getEmails();

    // Process emails
    const codes = processEmails(emails);

    // Set the verification codes
    return codes;
  }

  React.useEffect(() => {
    (async () => {
      try {
        // Set the frontmost app
        setFrontmostApp((await getFrontmostApplication()).name);

        // Set the verification codes
        setVerificationCodes(await getVerificationCodes());
      } catch (error) {
        console.log("No verification codes found");
      }
    })();
  }, []);

  return (
    <AuthWrapper>
      <List isLoading={verificationCodes === null}>
        <List.Section title="Verification Codes">
          {verificationCodes?.map((code) => (
            <List.Item
              key={code.receivedAt.toISOString()}
              title={code.sender}
              subtitle={code.email}
              accessories={[
                {
                  text: `${getTimeAgo(code.receivedAt)} ago`,
                },
                {
                  text: code.code,
                },
              ]}
              actions={
                <ActionPanel>
                  <Action
                    title={`Paste to ${frontmostApp}`}
                    icon={{ source: Icon.Paperclip, tintColor: Color.PrimaryText }}
                    onAction={async () => {
                      const app = await getFrontmostApplication();
                      await Clipboard.paste(code.code);
                      await showHUD(`Pasted code for ${code.sender} to ${app.name}`, { clearRootSearch: true });
                    }}
                  />
                  <Action
                    title={`Copy code to clipboard`}
                    icon={{ source: Icon.Clipboard }}
                    onAction={async () => {
                      await Clipboard.copy(code.code);
                      await showHUD(`Copied code for ${code.sender} to clipboard`, { clearRootSearch: true });
                    }}
                  />
                  <Action.Push
                    title="Show Email Content"
                    icon={{ source: Icon.Text }}
                    shortcut={{ modifiers: ["cmd"], key: "e" }}
                    target={<Detail markdown={`### Email from ${code.sender}\n\n${code.emailText}`} />}
                  />
                  <Action
                    title="Refresh"
                    icon={{ source: Icon.ArrowClockwise }}
                    shortcut={{ modifiers: ["cmd"], key: "r" }}
                    onAction={() => {
                      setVerificationCodes(null);
                      getVerificationCodes().then(setVerificationCodes);
                    }}
                  />
                </ActionPanel>
              }
            />
          ))}
        </List.Section>
        <List.EmptyView
          title="No Verification Codes Found"
          description="No verification codes found from the last 10 minutes. Try refreshing."
          actions={
            <ActionPanel>
              <Action
                title="Refresh"
                icon={{ source: Icon.ArrowClockwise }}
                onAction={() => {
                  setVerificationCodes(null);
                  getVerificationCodes().then(setVerificationCodes);
                }}
              />
            </ActionPanel>
          }
        />
      </List>
    </AuthWrapper>
  );
}

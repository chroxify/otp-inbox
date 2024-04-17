import { ActionPanel, List, Action, getFrontmostApplication, Detail } from "@raycast/api";
import { Clipboard, showHUD } from "@raycast/api";
import { getEmails } from "./lib/gmail";
import { processEmails } from "./lib/utils";
import { VerificationCode } from "./lib/types";
import AuthWrapper from "./components/auth-wrapper";
import React from "react";

export default function MagicCodes() {
  const [frontmostApp, setFrontmostApp] = React.useState<string>("");
  const [verificationCodes, setVerificationCodes] = React.useState<VerificationCode[] | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        // Set the frontmost app
        setFrontmostApp((await getFrontmostApplication()).name);

        // Get the emails
        const emails = await getEmails();

        // Process emails
        const codes = processEmails(emails);

        // Set the verification codes
        setVerificationCodes(codes);
      } catch (error) {
        console.error(error);
        console.log("No text selected");
      }
    })();
  }, []);

  return (
    <AuthWrapper>
      <List isLoading={verificationCodes === null}>
        <List.Section title="Magic Codes">
          {verificationCodes?.map((code) => (
            <List.Item
              key={code.receivedAt.toISOString()}
              title={code.sender}
              subtitle={code.email}
              accessories={[
                {
                  text: `Received at ${code.receivedAt.toLocaleTimeString()}`,
                },
                {
                  text: code.code,
                },
              ]}
              actions={
                <ActionPanel>
                  <Action
                    title={`Paste to ${frontmostApp}`}
                    onAction={async () => {
                      const app = await getFrontmostApplication();
                      await Clipboard.paste(code.code);

                      await showHUD(`Pasted code for ${code.sender} to ${app.name}`, { clearRootSearch: true });
                    }}
                  />
                  <Action
                    title={`Copy code to clipboard`}
                    onAction={async () => {
                      await Clipboard.copy(code.code);
                      await showHUD(`Copied code for ${code.sender} to clipboard`, { clearRootSearch: true });
                    }}
                  />
                  <Action.Push
                    title="Show Email Content"
                    target={<Detail markdown={`### Email from ${code.sender}\n\n${code.emailText}`} />}
                  />
                </ActionPanel>
              }
            />
          ))}
        </List.Section>
        <List.EmptyView title="No Magic Codes found for the last 10 minutes." />
      </List>
    </AuthWrapper>
  );
}

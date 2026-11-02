/**
 * The one outbound path for every enquiry on this site.
 *
 * Sends through an HTTP email API with a plain `fetch` - no SMTP library, no
 * new dependency. Everything is driven by env vars (see `.env.example`):
 *
 *   ENQUIRY_API_KEY  provider API key
 *   ENQUIRY_FROM     verified sender, e.g. "GM Dalui <website@gmdalui.co.in>"
 *   ENQUIRY_TO       recipient(s), comma-separated
 *
 * It never pretends to have sent: when the vars are missing or the provider
 * rejects the call it returns `ok: false` and logs the whole enquiry body, so
 * a lost enquiry is always recoverable from the server log.
 *
 * shortcut: the endpoint and JSON body are Resend's. To move to another
 * provider (Brevo, Postmark, SES) change ENDPOINT and the body in sendEnquiry;
 * the callers and env var names stay the same.
 */

const ENDPOINT = 'https://api.resend.com/emails';

export type NotifyResult =
  | { ok: true }
  | { ok: false; reason: 'not-configured' | 'send-failed'; detail: string };

export async function sendEnquiry(subject: string, body: string): Promise<NotifyResult> {
  const apiKey = process.env.ENQUIRY_API_KEY;
  const from = process.env.ENQUIRY_FROM;
  const to = process.env.ENQUIRY_TO;

  if (!apiKey || !from || !to) {
    const missing = [
      !apiKey && 'ENQUIRY_API_KEY',
      !from && 'ENQUIRY_FROM',
      !to && 'ENQUIRY_TO',
    ].filter(Boolean);
    const detail = `email is not configured (missing ${missing.join(', ')})`;
    console.error('[enquiry] NOT SENT - %s. Full enquiry below so it is not lost:\n%s\n%s', detail, subject, body);
    return { ok: false, reason: 'not-configured', detail };
  }

  let response: Response;
  try {
    response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: to.split(',').map((address) => address.trim()).filter(Boolean),
        subject,
        text: body,
      }),
      signal: AbortSignal.timeout(10_000),
    });
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    console.error('[enquiry] NOT SENT - request failed: %s. Full enquiry below so it is not lost:\n%s\n%s', detail, subject, body);
    return { ok: false, reason: 'send-failed', detail };
  }

  if (!response.ok) {
    const detail = `${response.status} ${await response.text().catch(() => '')}`.trim();
    console.error('[enquiry] NOT SENT - provider rejected: %s. Full enquiry below so it is not lost:\n%s\n%s', detail, subject, body);
    return { ok: false, reason: 'send-failed', detail };
  }

  return { ok: true };
}

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

/**
 * Which of the three env vars above are missing. The one source of truth for
 * "is enquiry mail set up", so /api/health can answer it without ever reading
 * a value. Presence only - the key, the sender and the recipient must never
 * leave the server.
 */
export function missingEnquiryConfig(): string[] {
  return [
    !process.env.ENQUIRY_API_KEY && 'ENQUIRY_API_KEY',
    !process.env.ENQUIRY_FROM && 'ENQUIRY_FROM',
    !process.env.ENQUIRY_TO && 'ENQUIRY_TO',
  ].filter((name): name is string => Boolean(name));
}

export async function sendEnquiry(subject: string, body: string): Promise<NotifyResult> {
  const apiKey = process.env.ENQUIRY_API_KEY;
  const from = process.env.ENQUIRY_FROM;
  const to = process.env.ENQUIRY_TO;

  if (!apiKey || !from || !to) {
    const detail = `email is not configured (missing ${missingEnquiryConfig().join(', ')})`;
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

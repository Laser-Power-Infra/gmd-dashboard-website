/**
 * The one outbound path for every enquiry on this site.
 *
 * POSTs `{ subject, text }` to an n8n Webhook node with a plain `fetch`; the
 * n8n workflow owns the actual email (sender, recipients, template).
 *
 *   ENQUIRY_WEBHOOK_URL    n8n production webhook URL
 *   ENQUIRY_WEBHOOK_TOKEN  optional; sent as `Authorization: Bearer <token>`
 *                          when the Webhook node uses Header Auth
 *
 * It never pretends to have sent: when the URL is missing or n8n rejects the
 * call it returns `ok: false` and logs the whole enquiry body, so a lost
 * enquiry is always recoverable from the server log.
 */

export type NotifyResult =
  | { ok: true }
  | { ok: false; reason: 'not-configured' | 'send-failed'; detail: string };

/**
 * Which env vars are missing. The one source of truth for "is enquiry mail
 * set up", so /api/health can answer it without ever reading a value.
 */
export function missingEnquiryConfig(): string[] {
  return process.env.ENQUIRY_WEBHOOK_URL ? [] : ['ENQUIRY_WEBHOOK_URL'];
}

export async function sendEnquiry(subject: string, body: string): Promise<NotifyResult> {
  const url = process.env.ENQUIRY_WEBHOOK_URL;
  const token = process.env.ENQUIRY_WEBHOOK_TOKEN;

  if (!url) {
    const detail = 'email is not configured (missing ENQUIRY_WEBHOOK_URL)';
    console.error('[enquiry] NOT SENT - %s. Full enquiry below so it is not lost:\n%s\n%s', detail, subject, body);
    return { ok: false, reason: 'not-configured', detail };
  }

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ subject, text: body }),
      signal: AbortSignal.timeout(10_000),
    });
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    console.error('[enquiry] NOT SENT - request failed: %s. Full enquiry below so it is not lost:\n%s\n%s', detail, subject, body);
    return { ok: false, reason: 'send-failed', detail };
  }

  if (!response.ok) {
    const detail = `${response.status} ${await response.text().catch(() => '')}`.trim();
    console.error('[enquiry] NOT SENT - n8n rejected: %s. Full enquiry below so it is not lost:\n%s\n%s', detail, subject, body);
    return { ok: false, reason: 'send-failed', detail };
  }

  return { ok: true };
}

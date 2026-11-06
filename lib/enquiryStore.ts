import { prisma } from '@/lib/prisma';
import { sendEnquiry, type NotifyResult } from '@/lib/notify';

/**
 * The one inbound path for every enquiry on this site - the mirror of
 * lib/notify.ts, which is the one outbound path.
 *
 * The row is the record of the enquiry; mail is best-effort on top. The row is
 * written *before* the send is attempted, so a crash or timeout inside the mail
 * provider cannot lose the enquiry, and `mailed` tells /admin/enquiries which
 * rows still need chasing by hand.
 *
 * `subject` and `details` are the same strings the email carries, so the admin
 * list and the mailbox show one enquiry in one format.
 */

export type EnquiryRow = {
  kind: 'quote' | 'valve' | 'purchase';
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
  subject: string;
  details: string;
};

export async function recordEnquiry(row: EnquiryRow): Promise<{ saved: boolean; sent: NotifyResult }> {
  let id: string | null = null;
  try {
    id = (await prisma.enquiry.create({ data: row })).id;
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    console.error(
      '[enquiry] NOT SAVED - %s. Mail is the only remaining path; full enquiry below:\n%s\n%s',
      detail,
      row.subject,
      row.details
    );
  }

  // sendEnquiry logs the full enquiry itself whenever it fails.
  const sent = await sendEnquiry(row.subject, row.details);

  if (id !== null && sent.ok) {
    try {
      await prisma.enquiry.update({ where: { id }, data: { mailed: true } });
    } catch (err) {
      // The enquiry is safe in both places; only the "needs chasing" flag is stale.
      console.error('[enquiry] %s was saved and mailed, but could not be flagged as mailed:', id, err);
    }
  }

  return { saved: id !== null, sent };
}

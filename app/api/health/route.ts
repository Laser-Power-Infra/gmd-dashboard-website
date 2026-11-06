import { missingEnquiryConfig } from '@/lib/notify';
import { missingRazorpayConfig } from '@/lib/razorpay';

/**
 * GET /api/health - public. Anything added here is world-readable.
 *
 * `mail` says only whether the three ENQUIRY_* vars are set on this server, so
 * a deploy can be confirmed without sending a real enquiry to the business
 * inbox. It must never report the API key, its length, the sender or the
 * recipient, nor which var is missing - that would name the mailbox.
 */
export async function GET() {
  return Response.json({
    status: 'ok',
    mail: missingEnquiryConfig().length === 0 ? 'configured' : 'not-configured',
    razorpay: missingRazorpayConfig().length === 0 ? 'configured' : 'not-configured',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  }, {
    headers: { 'Access-Control-Allow-Origin': '*' }
  });
}

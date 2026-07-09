/**
 * Contact-form endpoint: relays a lead to a Telegram chat.
 *
 * The bot token must never reach the browser, so the form posts here and the
 * server does the Telegram call. Configure per environment:
 *   TELEGRAM_BOT_TOKEN — from @BotFather
 *   TELEGRAM_CHAT_ID   — where the leads land (see .env.example)
 * Locally: .env.local (gitignored). On Vercel: Project → Settings → Environment Variables.
 */

type Lead = {
  name?: unknown;
  phone?: unknown;
  message?: unknown;
  subject?: unknown;
  locale?: unknown;
  page?: unknown;
  /** Honeypot: real users never see this field, bots fill it in. */
  company?: unknown;
};

const LIMITS = { name: 80, phone: 32, message: 2000, subject: 120 };
/** Refuse oversized bodies before parsing them. */
const MAX_BODY_BYTES = 8 * 1024;
const PHONE_RE = /^[\d+()\-.\s]{5,32}$/;

/** Telegram `parse_mode: HTML` only special-cases these three. */
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

const json = (data: unknown, status = 200) => Response.json(data, { status });

export async function POST(request: Request): Promise<Response> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.error("lead: TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID are not configured");
    return json({ ok: false, error: "not_configured" }, 500);
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return json({ ok: false, error: "too_large" }, 413);

  let body: Lead;
  try {
    body = JSON.parse(raw) as Lead;
  } catch {
    return json({ ok: false, error: "bad_json" }, 400);
  }

  // Silently accept honeypot hits: a bot that gets a 200 does not come back to
  // probe why it failed.
  if (str(body.company, 200)) return json({ ok: true });

  const name = str(body.name, LIMITS.name);
  const phone = str(body.phone, LIMITS.phone);
  const message = str(body.message, LIMITS.message);
  const subject = str(body.subject, LIMITS.subject);
  const locale = str(body.locale, 8);
  const page = str(body.page, 200);

  if (name.length < 2) return json({ ok: false, error: "bad_name" }, 400);
  if (!PHONE_RE.test(phone)) return json({ ok: false, error: "bad_phone" }, 400);

  const lines = [
    "🚗 <b>Новая заявка — LevelAuto</b>",
    "",
    `<b>Имя:</b> ${esc(name)}`,
    `<b>Телефон:</b> ${esc(phone)}`,
  ];
  if (subject) lines.push(`<b>Автомобиль:</b> ${esc(subject)}`);
  if (message) lines.push("", "<b>Сообщение:</b>", esc(message));
  lines.push("", `<i>${esc([page, locale && locale.toUpperCase()].filter(Boolean).join(" · "))}</i>`);

  const tg = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: lines.join("\n"),
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });

  if (!tg.ok) {
    // Never surface Telegram's response to the client — it echoes the token path.
    console.error("telegram sendMessage failed", tg.status, await tg.text().catch(() => ""));
    return json({ ok: false, error: "send_failed" }, 502);
  }

  return json({ ok: true });
}

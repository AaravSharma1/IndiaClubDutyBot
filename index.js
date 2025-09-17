require('dotenv').config();
const { App, LogLevel } = require('@slack/bolt');

const ASSIGNMENTS = [];

function parseDueDate(s) {
  if (!s) return null;
  const trimmed = s.trim();

  let m = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) {
    const [_, y, mo, d] = m;
    const dt = new Date(`${y}-${mo}-${d}T23:59:00`);
    return isNaN(dt) ? null : dt;
  }

  m = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) {
    const [_, mo, d, y] = m;
    const dt = new Date(`${y}-${mo.padStart(2,'0')}-${d.padStart(2,'0')}T23:59:00`);
    return isNaN(dt) ? null : dt;
  }

  m = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2})$/);
  if (m) {
    const [_, mo, d, yy] = m;
    const y = Number(yy) + 2000;
    const dt = new Date(`${y}-${String(mo).padStart(2,'0')}-${String(d).padStart(2,'0')}T23:59:00`);
    return isNaN(dt) ? null : dt;
  }

  return null;
}

function formatDate(dt) {
  try {
    return dt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch { return dt.toISOString().slice(0,10); }
}

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  logLevel: LogLevel.INFO,
});

app.error((err) => console.error('Bolt error:', err));

app.command('/duty', async ({ ack, body, respond }) => {
  await ack();

  const text = (body.text || '').trim();
  if (!text) {
    await respond('Usage: `/duty <title> <due-date>` e.g. `/duty Book room 9/18/25`');
    return;
  }

  const parts = text.split(/\s+/);
  const maybeDate = parts[parts.length - 1];
  const due = parseDueDate(maybeDate);

  let title;
  if (due) {
    title = parts.slice(0, -1).join(' ').trim();
  } else {
    await respond('Could not read the due date. Try formats: `MM/DD/YY`, `MM/DD/YYYY`, or `YYYY-MM-DD`.\nExample: `/duty Flyer draft 2025-09-18`');
    return;
  }

  if (!title) {
    await respond('Please include a title before the date. Example: `/duty Flyer draft 9/18/25`');
    return;
  }

  const item = {
    user_id: body.user_id,
    title,
    due_at: due.toISOString(),
    created_at: new Date().toISOString(),
    status: 'OPEN',
  };
  ASSIGNMENTS.push(item);

  await respond(`✅ Saved: *${title}* — due *${formatDate(due)}*`);
});

app.command('/duties', async ({ ack, body, respond }) => {
  await ack();

  const mine = ASSIGNMENTS.filter(a => a.user_id === body.user_id && a.status === 'OPEN')
                          .sort((a,b) => new Date(a.due_at) - new Date(b.due_at));

  if (mine.length === 0) {
    await respond('You have no open duties.');
    return;
  }

  const lines = mine.map((a, i) => `${i+1}. *${a.title}* — due *${formatDate(new Date(a.due_at))}*`);
  await respond(lines.join('\n'));
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ DutyBot is running on port ' + (process.env.PORT || 3000));
})();

// Lily Design System — date-time-picker (headless, vanilla JS).
//
// A text field plus an icon button that opens a WAI-ARIA APG Date Picker
// Dialog: a month grid with a full keyboard contract, optional time
// selects, optional shortcut buttons, and a Confirm/Cancel/Clear footer.
//
// Mirrors the front-end-with-svelte convention
// (front-end-with-svelte/src/lib/components/ui/DateTimePicker.svelte) and
// ports its arithmetic and interaction algorithms from the Lily HTML
// custom element (lily-design-system-html-date-time-picker/date-time-picker.ts) —
// see that package's spec/index.md for the full behavioural contract this
// file implements. Unlike the four preference helpers (theme-select,
// locale-select, text-size-picker, share-picker) this control persists
// nothing to localStorage: a date is data, not a preference (spec §2).
//
// VENDOR-ONLY. This module is not wired into any form's index.html or
// dashboard.html — it ships as an available module for future opt-in use
// and is copied byte-identical into every form's js/ folder, so it must
// contain no form-specific content (no slug, no storage key).
//
// Usage:
//   import { initDateTimePicker } from './date-time-picker.js';
//   initDateTimePicker(document.querySelector('.date-time-picker'), {
//     label: 'Appointment date',
//     labels: {
//       previousYear: 'Previous year', previousMonth: 'Previous month',
//       nextMonth: 'Next month', nextYear: 'Next year',
//       confirm: 'OK', cancel: 'Cancel',
//     },
//   });
//
// The root element passed in must already contain the static markup: the
// text field (`.date-time-picker-input`), the trigger button
// (`.date-time-picker-button`), and an empty dialog container
// (`.date-time-picker-dialog`) — see the DOM contract in the Svelte
// helper's spec §4.3. `initDateTimePicker` builds the dialog's dynamic
// interior (header, grid, time selects, shortcuts, footer) once, then
// keeps it in sync with state on every interaction — the same
// structural-build vs. in-place-update split the Lily custom element
// implements internally as `#render()` / `#syncState()`, without the
// custom-element class shape.

// -----------------------------------------------------------------------
// Civil-date arithmetic
//
// Pure and total: no local-time `Date` values, no throwing, empty
// string/null for "not a date". A consumer wiring `min`, `max`,
// `shortcuts`, or `isDateDisabled` can reuse these instead of reaching
// for a `Date` and reintroducing the local-midnight bug this module
// exists to avoid, so they are exported.
// -----------------------------------------------------------------------

/** Zero-pad to `width`. */
export function pad(n, width = 2) {
  return String(Math.abs(n)).padStart(width, '0');
}

/** Days in a month. `month` is 1-12. */
export function daysInMonth(year, month) {
  // Day 0 of the next month is the last day of this one.
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/** `{year: 2026, month: 3, day: 1}` -> `"2026-03-01"`. */
export function formatIsoDate(date) {
  return `${pad(date.year, 4)}-${pad(date.month)}-${pad(date.day)}`;
}

/**
 * `"2026-03-01"` -> `{year, month, day}`, or null.
 *
 * Rejects impossible components rather than rolling them over, so
 * `"2026-02-31"` is null and not the 3rd of March.
 */
export function parseIsoDate(text) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(text).trim());
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > daysInMonth(year, month)) return null;
  return { year, month, day };
}

/** Days since the Unix epoch. The unit all date arithmetic goes through. */
export function toEpochDay(date) {
  return Date.UTC(date.year, date.month - 1, date.day) / 86400000;
}

/** Inverse of `toEpochDay`. */
export function fromEpochDay(epochDay) {
  const d = new Date(epochDay * 86400000);
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() };
}

/** Shift an ISO date by whole days. */
export function addDays(isoDate, days) {
  const date = parseIsoDate(isoDate);
  if (!date) return isoDate;
  return formatIsoDate(fromEpochDay(toEpochDay(date) + days));
}

/**
 * Shift an ISO date by whole months, clamping the day.
 *
 * 31 January + 1 month is 28 February (29 in a leap year), not 3 March.
 */
export function addMonths(isoDate, months) {
  const date = parseIsoDate(isoDate);
  if (!date) return isoDate;
  const total = date.year * 12 + (date.month - 1) + months;
  const year = Math.floor(total / 12);
  const month = (((total % 12) + 12) % 12) + 1;
  return formatIsoDate({ year, month, day: Math.min(date.day, daysInMonth(year, month)) });
}

/** Day of week: 0 = Sunday ... 6 = Saturday. */
export function weekdayOf(isoDate) {
  const date = parseIsoDate(isoDate);
  if (!date) return 0;
  return new Date(Date.UTC(date.year, date.month - 1, date.day)).getUTCDay();
}

/**
 * ISO-8601 week number.
 *
 * Weeks start Monday and week 1 is the one containing the first
 * Thursday, which is why this pivots on Thursday rather than counting
 * from 1 January.
 */
export function isoWeek(isoDate) {
  if (!parseIsoDate(isoDate)) return 0;
  const mondayIndex = (weekdayOf(isoDate) + 6) % 7;
  const thursday = addDays(isoDate, 3 - mondayIndex);
  const parsed = parseIsoDate(thursday);
  if (!parsed) return 0;
  const jan1 = parseIsoDate(formatIsoDate({ year: parsed.year, month: 1, day: 1 }));
  if (!jan1) return 0;
  return Math.floor((toEpochDay(parsed) - toEpochDay(jan1)) / 7) + 1;
}

/** `"09:30"` -> `{hour: 9, minute: 30}`, or null. */
export function parseIsoTime(text) {
  const m = /^(\d{2}):(\d{2})$/.exec(String(text).trim());
  if (!m) return null;
  const hour = Number(m[1]);
  const minute = Number(m[2]);
  if (hour > 23 || minute > 59) return null;
  return { hour, minute };
}

/** `{hour: 9, minute: 30}` -> `"09:30"`. */
export function formatIsoTime(time) {
  return `${pad(time.hour)}:${pad(time.minute)}`;
}

/** Pull the date and time halves out of a mode-appropriate ISO value. */
export function splitValue(value, mode) {
  if (!value) return { date: '', time: '' };
  if (mode === 'time') {
    return { date: '', time: parseIsoTime(value) ? value : '' };
  }
  const [datePart = '', timePart = ''] = String(value).split('T');
  return {
    date: parseIsoDate(datePart) ? datePart : '',
    time: mode === 'datetime' && parseIsoTime(timePart) ? timePart : '',
  };
}

/** Recombine the halves. Returns "" when the value is incomplete. */
export function joinValue(date, time, mode) {
  if (mode === 'date') return date;
  if (mode === 'time') return time;
  return date && time ? `${date}T${time}` : '';
}

/** Is `isoDate` inside the inclusive [min, max] window? Empty bounds pass. */
export function withinRange(isoDate, min, max) {
  if (min && isoDate < min) return false;
  if (max && isoDate > max) return false;
  return true;
}

/** Uppercase region subtag of a BCP 47 tag, or "". */
function regionOf(locale) {
  if (!locale) return '';
  for (const part of String(locale).split(/[-_]/).slice(1)) {
    if (/^[A-Za-z]{2}$/.test(part)) return part.toUpperCase();
  }
  return '';
}

const SUNDAY_FIRST_REGIONS = new Set([
  'AR', 'BR', 'CA', 'CL', 'CO', 'DO', 'GT', 'HK', 'IL', 'IN', 'JP',
  'KR', 'MO', 'MX', 'PE', 'PH', 'PK', 'TH', 'TW', 'US', 'VE', 'ZA',
]);

const SATURDAY_FIRST_REGIONS = new Set([
  'AE', 'AF', 'BH', 'DJ', 'DZ', 'EG', 'IQ', 'IR', 'JO', 'KW', 'LY',
  'OM', 'QA', 'SA', 'SD', 'SY', 'YE',
]);

/**
 * First day of the week for a locale: 0 = Sunday ... 6 = Saturday.
 *
 * `Intl.Locale.prototype.getWeekInfo` is the right answer, but it is
 * recent enough that a fallback still earns its place. The fallback is a
 * short region table plus a Monday default, Monday being both the
 * ISO-8601 rule and the majority convention worldwide.
 */
export function firstDayOfWeekFor(locale) {
  if (locale) {
    try {
      const loc = new Intl.Locale(locale);
      const info = typeof loc.getWeekInfo === 'function' ? loc.getWeekInfo() : loc.weekInfo;
      // getWeekInfo reports 1 = Monday ... 7 = Sunday, so Sunday (7) has
      // to fold to 0.
      if (info && typeof info.firstDay === 'number') return info.firstDay % 7;
    } catch {
      // Malformed tag -- fall through to the table.
    }
  }
  const region = regionOf(locale);
  if (SUNDAY_FIRST_REGIONS.has(region)) return 0;
  if (SATURDAY_FIRST_REGIONS.has(region)) return 6;
  return 1;
}

/**
 * The dates of one month's grid, always six rows of seven.
 *
 * Fixed height on purpose: a grid sized to its month is four to six
 * rows, so the footer would move as the user pages.
 */
export function monthMatrix(year, month, firstDayOfWeek) {
  const first = formatIsoDate({ year, month, day: 1 });
  const lead = (weekdayOf(first) - firstDayOfWeek + 7) % 7;
  const start = addDays(first, -lead);
  const weeks = [];
  for (let row = 0; row < 6; row++) {
    const week = [];
    for (let col = 0; col < 7; col++) week.push(addDays(start, row * 7 + col));
    weeks.push(week);
  }
  return weeks;
}

/** Long and short month names for a locale, index 0 = January. */
export function monthNames(locale) {
  const build = (month) => {
    try {
      const fmt = new Intl.DateTimeFormat(locale, { month, timeZone: 'UTC' });
      return Array.from({ length: 12 }, (_, i) => fmt.format(new Date(Date.UTC(2021, i, 15))));
    } catch {
      return [];
    }
  };
  return { long: build('long'), short: build('short') };
}

/** Match a token against a locale's month names. Returns 1-12, or 0. */
function matchMonthName(token, names) {
  const norm = (s) => s.toLocaleLowerCase().replace(/\.$/, '').normalize('NFKD');
  const t = norm(token);
  if (!t || /^\d+$/.test(t)) return 0;
  for (let i = 0; i < 12; i++) {
    if (norm(names.long[i] ?? '') === t) return i + 1;
    if (norm(names.short[i] ?? '') === t) return i + 1;
  }
  // Prefix match, so "Sept" finds September. Three characters minimum:
  // "Ma" cannot choose between March and May.
  if (t.length >= 3) {
    for (let i = 0; i < 12; i++) {
      const long = norm(names.long[i] ?? '');
      if (long && long.startsWith(t)) return i + 1;
    }
  }
  return 0;
}

/**
 * The order a locale writes a numeric date in -- `["day","month","year"]`
 * for en-GB, `["month","day","year"]` for en-US.
 */
export function numericFieldOrder(locale) {
  try {
    const parts = new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'UTC',
    }).formatToParts(new Date(Date.UTC(2021, 4, 6)));
    const order = parts
      .map((p) => p.type)
      .filter((t) => t === 'day' || t === 'month' || t === 'year');
    if (order.length === 3) return order;
  } catch {
    // Fall through.
  }
  return ['day', 'month', 'year'];
}

/**
 * Parse typed text into an ISO date.
 *
 * Accepts, in order: ISO `YYYY-MM-DD`; a numeric form whose field order
 * follows the locale; and a form with a written month matched against
 * the locale's own long and short month names. Anything else is null.
 * Two-digit years pivot at 70 (`69` -> 2069, `70` -> 1970).
 */
export function parseDateInput(text, locale) {
  const trimmed = String(text).trim();
  if (!trimmed) return null;

  const iso = parseIsoDate(trimmed);
  if (iso) return formatIsoDate(iso);

  const parts = trimmed.split(/[\s./-]+/).filter(Boolean);
  if (parts.length !== 3) return null;

  const names = monthNames(locale);
  let month = 0;
  let monthIndex = -1;
  for (let i = 0; i < parts.length; i++) {
    const found = matchMonthName(parts[i], names);
    if (found) {
      month = found;
      monthIndex = i;
      break;
    }
  }

  let day = 0;
  let year = 0;

  if (monthIndex >= 0) {
    const rest = parts.filter((_, i) => i !== monthIndex).map((p) => Number(p));
    if (rest.some((n) => Number.isNaN(n))) return null;
    [day, year] = rest[0] > rest[1] ? [rest[1], rest[0]] : rest;
  } else {
    const nums = parts.map((p) => Number(p));
    if (nums.some((n) => Number.isNaN(n))) return null;
    const order = numericFieldOrder(locale);
    year = nums[order.indexOf('year')];
    day = nums[order.indexOf('day')];
    month = nums[order.indexOf('month')];
  }

  // Two-digit years: the usual 70 pivot.
  if (year < 100) year += year < 70 ? 2000 : 1900;
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > daysInMonth(year, month)) return null;
  return formatIsoDate({ year, month, day });
}

/** Accepts `9:30`, `09:30`, `0930`, `9.30`, and a trailing am/pm. */
export function parseTimeInput(text) {
  const m = /^(\d{1,2})[:.]?(\d{2})\s*([ap])\.?m\.?$|^(\d{1,2})[:.]?(\d{2})$/.exec(
    String(text).trim().toLowerCase(),
  );
  if (!m) return null;
  let hour = Number(m[1] ?? m[4]);
  const minute = Number(m[2] ?? m[5]);
  const meridiem = m[3];
  if (meridiem === 'p' && hour < 12) hour += 12;
  if (meridiem === 'a' && hour === 12) hour = 0;
  if (hour > 23 || minute > 59) return null;
  return formatIsoTime({ hour, minute });
}

/** Does this locale write times on a 12-hour clock? */
function localeUsesHour12(locale) {
  try {
    const parts = new Intl.DateTimeFormat(locale, { hour: 'numeric', timeZone: 'UTC' }).formatToParts(
      new Date(Date.UTC(2021, 0, 1, 13)),
    );
    return parts.some((p) => p.type === 'dayPeriod');
  } catch {
    return false;
  }
}

/** The locale's own AM / PM strings, so neither is hardcoded. */
function dayPeriodName(locale, pm) {
  try {
    const parts = new Intl.DateTimeFormat(locale, {
      hour: 'numeric',
      hour12: true,
      timeZone: 'UTC',
    }).formatToParts(new Date(Date.UTC(2021, 0, 1, pm ? 13 : 1)));
    const found = parts.find((p) => p.type === 'dayPeriod')?.value;
    if (found) return found;
  } catch {
    // Fall through.
  }
  return pm ? 'PM' : 'AM';
}

/** The host's current calendar day, read through the local getters. */
function todayIso() {
  const now = new Date();
  return formatIsoDate({ year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() });
}

let uid = 0;
/** Stable per-instance id prefix. */
export function nextDateTimePickerId() {
  uid += 1;
  return `date-time-picker-${uid}`;
}

/**
 * Default button glyph: U+1F4C5 CALENDAR, followed by U+FE0E VARIATION
 * SELECTOR-15 to request text (monochrome) presentation.
 *
 * Written as an escape, never as a bare character: a variation selector
 * has no visual form at all, so a bare one is invisible in an editor and
 * trivially lost to a careless edit.
 */
export const CALENDAR = '\u{1F4C5}\uFE0E';

const DEFAULT_LABELS = {
  previousYear: '',
  previousMonth: '',
  nextMonth: '',
  nextYear: '',
  confirm: '',
  cancel: '',
};

// -----------------------------------------------------------------------
// initDateTimePicker(root, options)
// -----------------------------------------------------------------------

/**
 * Wire up one date-time-picker instance.
 *
 * `root` must already contain the static markup: `.date-time-picker-input`
 * (the text field), `.date-time-picker-button` (the trigger), and an
 * empty `.date-time-picker-dialog` container. This function builds the
 * dialog's dynamic interior once and keeps it in sync thereafter.
 *
 * `options` mirrors the cross-framework prop table (label, labels, mode,
 * value, locale, min, max, isDateDisabled, firstDayOfWeek, minuteStep,
 * hour12, showWeekNumbers, shortcuts, confirmOnSelect, onChange,
 * onShortcut, onInvalidInput). `disabled` / `readonly` / `required` /
 * `placeholder` / `name` / `inputId` / `describedBy` are read live off
 * the static field markup instead of being config here, since the DOM
 * contract already puts them on the field the caller authored.
 *
 * Returns `{ getValue, setValue, open, close }` for programmatic control,
 * or `null` if `root` is missing the required static elements.
 */
export function initDateTimePicker(root, options = {}) {
  if (!root) return null;

  const fieldEl = root.querySelector('.date-time-picker-input');
  const buttonEl = root.querySelector('.date-time-picker-button');
  const dialogEl = root.querySelector('.date-time-picker-dialog');
  const hiddenEl = root.querySelector('input[type="hidden"]');
  if (!fieldEl || !buttonEl || !dialogEl) return null;

  const mode = options.mode === 'time' || options.mode === 'datetime' ? options.mode : 'date';
  const label = options.label ?? '';
  const labels = { ...DEFAULT_LABELS, ...(options.labels ?? {}) };
  const locale = options.locale;
  const min = options.min ?? '';
  const max = options.max ?? '';
  const isDateDisabledFn = typeof options.isDateDisabled === 'function' ? options.isDateDisabled : null;
  const minuteStep = Number.isFinite(options.minuteStep) && options.minuteStep > 0 ? options.minuteStep : 1;
  const hour12 = typeof options.hour12 === 'boolean' ? options.hour12 : localeUsesHour12(locale);
  const firstDayOfWeek =
    Number.isInteger(options.firstDayOfWeek) && options.firstDayOfWeek >= 0 && options.firstDayOfWeek <= 6
      ? options.firstDayOfWeek
      : firstDayOfWeekFor(locale);
  const showWeekNumbers = options.showWeekNumbers === true;
  const shortcuts = Array.isArray(options.shortcuts) ? options.shortcuts.slice() : [];
  const confirmOnSelect =
    typeof options.confirmOnSelect === 'boolean' ? options.confirmOnSelect : mode === 'date';
  const onChange = typeof options.onChange === 'function' ? options.onChange : null;
  const onShortcut = typeof options.onShortcut === 'function' ? options.onShortcut : null;
  const onInvalidInput = typeof options.onInvalidInput === 'function' ? options.onInvalidInput : null;

  if (!dialogEl.id) dialogEl.id = nextDateTimePickerId();
  const dialogId = dialogEl.id;
  const periodId = `${dialogId}-period`;
  const hourId = `${dialogId}-hour`;
  const minuteId = `${dialogId}-minute`;
  const meridiemId = `${dialogId}-meridiem`;

  // ---- Mutable state (closed over, not global -- one per instance) ----
  let value = typeof options.value === 'string' ? options.value : '';
  let open = false;
  let invalid = false;
  let typed = null;
  let pendingDate = '';
  let pendingTime = '';
  let viewYear = 1970;
  let viewMonth = 1;
  let cursor = '';
  let today = todayIso();

  // ---- Refs into the built dialog interior ----
  let periodEl = null;
  let weekdayThs = [];
  let weekHeadingTh = null;
  let weekThs = [];
  let dayCells = []; // [{ td, button }]
  let hourSelect = null;
  let minuteSelect = null;
  let meridiemSelect = null;

  function usesDate() {
    return mode !== 'time';
  }
  function usesTime() {
    return mode !== 'date';
  }

  // ---- Selectability ----

  function dayDisabled(isoDate) {
    if (!withinRange(isoDate, min, max)) return true;
    return isDateDisabledFn ? isDateDisabledFn(isoDate) === true : false;
  }

  /** The nearest selectable day to `isoDate`, searching outwards. */
  function nearestSelectable(isoDate) {
    if (!dayDisabled(isoDate)) return isoDate;
    // Bounded: a year either way is far beyond any real min/max window,
    // and an unbounded search would hang on a predicate disabling
    // everything.
    for (let delta = 1; delta <= 366; delta++) {
      const after = addDays(isoDate, delta);
      if (!dayDisabled(after)) return after;
      const before = addDays(isoDate, -delta);
      if (!dayDisabled(before)) return before;
    }
    return isoDate;
  }

  /** Where an unset time starts: now, snapped down to the step. */
  function defaultTime() {
    if (!usesTime()) return '';
    const now = new Date();
    const step = Math.max(1, minuteStep);
    return formatIsoTime({ hour: now.getHours(), minute: Math.floor(now.getMinutes() / step) * step });
  }

  // ---- Open / close ----

  function focusables() {
    return Array.from(
      dialogEl.querySelectorAll('button:not([disabled]):not([tabindex="-1"]), select:not([disabled])'),
    );
  }

  function focusCursor() {
    if (!cursor) return;
    // An attribute selector, not #id: the id is not on this element, and
    // a value we generated as YYYY-MM-DD needs no escaping.
    const el = dialogEl.querySelector(`[data-date="${cursor}"]`);
    // Guard the methods, not only the element: some test environments
    // implement no scrollIntoView, and an unguarded call throws.
    el?.focus?.();
    el?.scrollIntoView?.({ block: 'nearest' });
  }

  function focusInitial() {
    if (usesDate()) {
      focusCursor();
      return;
    }
    focusables()[0]?.focus();
  }

  /** Open the dialog, seeding pending state from the committed value. */
  function openDialog() {
    if (fieldEl.disabled || fieldEl.readOnly) return;
    today = todayIso();
    const committed = splitValue(value, mode);
    pendingDate = committed.date || nearestSelectable(today);
    pendingTime = committed.time || defaultTime();
    cursor = pendingDate;
    const anchor = parseIsoDate(pendingDate) ?? parseIsoDate(today);
    if (anchor) {
      viewYear = anchor.year;
      viewMonth = anchor.month;
    }
    open = true;
    syncState();
    queueMicrotask(focusInitial);
  }

  /** Close the dialog. `value` is untouched unless `commit()` ran first. */
  function closeDialog(refocus = true) {
    if (!open) return;
    open = false;
    syncState();
    if (refocus) queueMicrotask(() => buttonEl.focus());
  }

  // ---- Commit / clear ----

  function commitValue(next) {
    if (next === value) return;
    value = next;
    if (hiddenEl) hiddenEl.value = value;
    onChange?.(value);
  }

  /** Commit the pending selection to `value` and notify. */
  function commit() {
    const next = joinValue(pendingDate, pendingTime, mode);
    // An incomplete datetime is not committed. Half a timestamp is not a
    // smaller truth; it is a different one.
    if (!next) return;
    typed = null;
    invalid = false;
    commitValue(next);
    closeDialog();
  }

  function clear() {
    typed = null;
    invalid = false;
    commitValue('');
    closeDialog();
  }

  // ---- Grid navigation ----

  /**
   * Move the cursor, paging the view when the target is off-screen.
   *
   * Disabled days are still reachable -- the cursor lands on them and
   * the button is disabled, so arrowing across a blocked range works.
   * What is refused is leaving the min/max window entirely.
   */
  function moveCursor(nextIso) {
    if (!withinRange(nextIso, min, max)) return;
    cursor = nextIso;
    const parsed = parseIsoDate(nextIso);
    if (parsed && (parsed.year !== viewYear || parsed.month !== viewMonth)) {
      viewYear = parsed.year;
      viewMonth = parsed.month;
    }
    syncState();
    queueMicrotask(focusCursor);
  }

  function selectDay(isoDate) {
    if (dayDisabled(isoDate)) return;
    pendingDate = isoDate;
    cursor = isoDate;
    if (confirmOnSelect) commit();
    else syncState();
  }

  function shiftMonth(delta) {
    const anchor = formatIsoDate({ year: viewYear, month: viewMonth, day: 1 });
    const next = parseIsoDate(addMonths(anchor, delta));
    if (!next) return;
    viewYear = next.year;
    viewMonth = next.month;
    // Carry the cursor into the new month rather than leaving focus on a
    // cell that is no longer rendered.
    const c = parseIsoDate(cursor);
    if (c) {
      cursor = formatIsoDate({
        year: next.year,
        month: next.month,
        day: Math.min(c.day, daysInMonth(next.year, next.month)),
      });
    }
    syncState();
    queueMicrotask(focusCursor);
  }

  function shiftYear(delta) {
    shiftMonth(delta * 12);
  }

  function onGridKeydown(event) {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        moveCursor(addDays(cursor, -1));
        break;
      case 'ArrowRight':
        event.preventDefault();
        moveCursor(addDays(cursor, 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        moveCursor(addDays(cursor, -7));
        break;
      case 'ArrowDown':
        event.preventDefault();
        moveCursor(addDays(cursor, 7));
        break;
      case 'Home': {
        event.preventDefault();
        const offset = (weekdayOf(cursor) - firstDayOfWeek + 7) % 7;
        moveCursor(addDays(cursor, -offset));
        break;
      }
      case 'End': {
        event.preventDefault();
        const offset = (weekdayOf(cursor) - firstDayOfWeek + 7) % 7;
        moveCursor(addDays(cursor, 6 - offset));
        break;
      }
      case 'PageUp':
        event.preventDefault();
        if (event.shiftKey) shiftYear(-1);
        else shiftMonth(-1);
        break;
      case 'PageDown':
        event.preventDefault();
        if (event.shiftKey) shiftYear(1);
        else shiftMonth(1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        selectDay(cursor);
        break;
      default:
        break;
    }
  }

  // ---- Dialog keys and the focus trap ----

  function onDialogKeydown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      // Escape discards: `value` is untouched.
      closeDialog();
      return;
    }
    if (event.key !== 'Tab') return;

    // The trap. `aria-modal="true"` is a promise the browser does not
    // keep for us: an untrapped aria-modal dialog tells a screen reader
    // the rest of the page is inert while Tab quietly walks into it.
    const all = focusables();
    if (all.length === 0) return;
    const first = all[0];
    const last = all[all.length - 1];
    const active = document.activeElement;
    if (event.shiftKey && (active === first || !dialogEl.contains(active))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function onDocumentClick(event) {
    if (!open) return;
    if (event.target && !root.contains(event.target)) closeDialog(false);
  }

  // ---- Text field ----

  /** Default text parsing, per mode. */
  function parseTypedForMode(text) {
    if (mode === 'time') return parseTimeInput(text);
    if (mode === 'date') return parseDateInput(text, locale);
    // datetime: split on the last whitespace run or a literal T, and
    // require both halves.
    const m = /^(.*?)[T\s]+([^\sT]+)$/.exec(text.trim());
    if (!m) return null;
    const date = parseDateInput(m[1], locale);
    const time = parseTimeInput(m[2]);
    return date && time ? `${date}T${time}` : null;
  }

  /** Resolve typed text on blur or Enter. */
  function resolveTyped() {
    if (typed === null) return;
    const text = typed;
    try {
      if (!text.trim()) {
        typed = null;
        invalid = false;
        commitValue('');
        return;
      }

      const parsed = parseTypedForMode(text);
      const parsedDate = parsed ? splitValue(parsed, mode).date : '';
      const outOfBounds = parsed !== null && usesDate() && parsedDate !== '' && dayDisabled(parsedDate);

      if (!parsed || outOfBounds) {
        // Parseable-but-out-of-bounds gets the same outcome as
        // unparseable: the text stays put, marked invalid, rather than
        // being silently snapped to a nearby legal date the user never
        // typed.
        invalid = true;
        onInvalidInput?.(text);
        return;
      }

      typed = null;
      invalid = false;
      commitValue(parsed);
    } finally {
      syncState();
    }
  }

  function onFieldInput(event) {
    typed = event.currentTarget.value;
  }

  function onFieldBlur() {
    resolveTyped();
  }

  function onFieldKeydown(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      resolveTyped();
    } else if (event.key === 'ArrowDown' && event.altKey) {
      // The platform convention for "open the picker" from a field,
      // matching <input type="date"> in every major browser.
      event.preventDefault();
      openDialog();
    }
  }

  // ---- Time selects ----

  function hourOptions() {
    const clock12 = hour12;
    const pendingHour = parseIsoTime(pendingTime)?.hour ?? 0;
    const out = [];
    for (let h = 0; h < 24; h++) {
      if (clock12 && h < 12 !== pendingHour < 12) continue;
      out.push({ value: h, label: clock12 ? String(((h + 11) % 12) + 1) : pad(h) });
    }
    return out;
  }

  function minuteOptions() {
    const out = [];
    for (let m = 0; m < 60; m += Math.max(1, minuteStep)) out.push(m);
    return out;
  }

  function setHour(hour) {
    const minute = parseIsoTime(pendingTime)?.minute ?? 0;
    pendingTime = formatIsoTime({ hour, minute });
    syncState();
  }

  function setMinute(minute) {
    const hour = parseIsoTime(pendingTime)?.hour ?? 0;
    pendingTime = formatIsoTime({ hour, minute });
    syncState();
  }

  /** Cross between AM and PM without changing the minute of the hour. */
  function setMeridiem(pm) {
    const hour = parseIsoTime(pendingTime)?.hour ?? 0;
    setHour((hour % 12) + (pm ? 12 : 0));
  }

  // ---- Shortcuts ----

  function applyShortcut(shortcut) {
    const base = todayIso();
    let target = shortcut.date ?? base;
    if (shortcut.days !== undefined) target = addDays(base, shortcut.days);
    else if (shortcut.months !== undefined) target = addMonths(base, shortcut.months);
    // A shortcut to a blocked date does nothing rather than landing
    // somewhere near it.
    if (dayDisabled(target)) return;

    pendingDate = target;
    cursor = target;
    const parsed = parseIsoDate(target);
    if (parsed) {
      viewYear = parsed.year;
      viewMonth = parsed.month;
    }
    onShortcut?.(shortcut.id, target);
    if (confirmOnSelect) commit();
    else {
      syncState();
      queueMicrotask(focusCursor);
    }
  }

  // ---- Formatting ----

  function formatTimeForDisplay(isoTime) {
    const parsed = parseIsoTime(isoTime);
    if (!parsed) return isoTime;
    try {
      return new Intl.DateTimeFormat(locale, {
        hour: '2-digit',
        minute: '2-digit',
        hour12,
        timeZone: 'UTC',
      }).format(new Date(Date.UTC(2021, 0, 1, parsed.hour, parsed.minute)));
    } catch {
      return isoTime;
    }
  }

  /** Render an ISO value the way this locale writes it. */
  function defaultFormat(isoValue) {
    if (!isoValue) return '';
    const { date, time } = splitValue(isoValue, mode);
    const chunks = [];
    const parsed = date ? parseIsoDate(date) : null;
    if (parsed) {
      try {
        chunks.push(
          new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(
            new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day)),
          ),
        );
      } catch {
        chunks.push(date);
      }
    }
    if (time) chunks.push(formatTimeForDisplay(time));
    return chunks.join(' ');
  }

  /** The text shown in the field. A pending edit wins until resolved. */
  function displayValue() {
    if (typed !== null) return typed;
    return defaultFormat(value);
  }

  /** Accessible name for one day cell, e.g. "Sunday 1 March 2026". */
  function dayLabel(isoDate) {
    const parsed = parseIsoDate(isoDate);
    if (!parsed) return isoDate;
    try {
      return new Intl.DateTimeFormat(locale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day)));
    } catch {
      return isoDate;
    }
  }

  /** The "March 2026" heading. */
  function periodText() {
    try {
      return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
        new Date(Date.UTC(viewYear, viewMonth - 1, 1)),
      );
    } catch {
      return `${viewYear}-${pad(viewMonth)}`;
    }
  }

  /** Column headings, in this locale, starting on `firstDayOfWeek`. */
  function weekdays() {
    const weekStart = firstDayOfWeek;
    const out = [];
    for (let i = 0; i < 7; i++) {
      // 2021-08-01 was a Sunday, so this walks the week from whichever
      // day the locale starts on.
      const d = new Date(Date.UTC(2021, 7, 1 + ((weekStart + i) % 7)));
      try {
        out.push({
          short: new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' }).format(d),
          long: new Intl.DateTimeFormat(locale, { weekday: 'long', timeZone: 'UTC' }).format(d),
        });
      } catch {
        out.push({ short: '', long: '' });
      }
    }
    return out;
  }

  function glyphSpan(char) {
    const span = document.createElement('span');
    span.setAttribute('aria-hidden', 'true');
    span.textContent = char;
    return span;
  }

  // ---- Structural build (runs once) ----

  /** Build the trigger's icon content, if the static markup left it empty. */
  function buildButtonIcon() {
    let iconEl = buttonEl.querySelector('.date-time-picker-icon');
    if (!iconEl) {
      iconEl = document.createElement('span');
      iconEl.className = 'date-time-picker-icon';
      iconEl.setAttribute('aria-hidden', 'true');
      buttonEl.appendChild(iconEl);
    }
    if (!iconEl.textContent) iconEl.textContent = CALENDAR;
  }

  /**
   * Build the dialog's dynamic interior: header, month grid, time
   * selects, shortcuts, and footer. Runs once against the empty
   * `.date-time-picker-dialog` container the caller supplied.
   */
  function buildDialog() {
    dialogEl.setAttribute('role', 'dialog');
    dialogEl.setAttribute('aria-modal', 'true');
    dialogEl.setAttribute('aria-label', label);
    dialogEl.tabIndex = -1;
    dialogEl.hidden = true;
    dialogEl.addEventListener('keydown', onDialogKeydown);

    if (usesDate()) {
      const header = document.createElement('div');
      header.className = 'date-time-picker-header';

      const previousYear = document.createElement('button');
      previousYear.type = 'button';
      previousYear.className = 'date-time-picker-previous-year';
      previousYear.setAttribute('aria-label', labels.previousYear);
      previousYear.appendChild(glyphSpan('«'));
      previousYear.addEventListener('click', () => shiftYear(-1));
      header.appendChild(previousYear);

      const previousMonth = document.createElement('button');
      previousMonth.type = 'button';
      previousMonth.className = 'date-time-picker-previous-month';
      previousMonth.setAttribute('aria-label', labels.previousMonth);
      previousMonth.appendChild(glyphSpan('‹'));
      previousMonth.addEventListener('click', () => shiftMonth(-1));
      header.appendChild(previousMonth);

      periodEl = document.createElement('span');
      periodEl.className = 'date-time-picker-period';
      periodEl.id = periodId;
      periodEl.setAttribute('aria-live', 'polite');
      header.appendChild(periodEl);

      const nextMonth = document.createElement('button');
      nextMonth.type = 'button';
      nextMonth.className = 'date-time-picker-next-month';
      nextMonth.setAttribute('aria-label', labels.nextMonth);
      nextMonth.appendChild(glyphSpan('›'));
      nextMonth.addEventListener('click', () => shiftMonth(1));
      header.appendChild(nextMonth);

      const nextYear = document.createElement('button');
      nextYear.type = 'button';
      nextYear.className = 'date-time-picker-next-year';
      nextYear.setAttribute('aria-label', labels.nextYear);
      nextYear.appendChild(glyphSpan('»'));
      nextYear.addEventListener('click', () => shiftYear(1));
      header.appendChild(nextYear);

      dialogEl.appendChild(header);

      const tableEl = document.createElement('table');
      tableEl.className = 'date-time-picker-calendar';
      tableEl.setAttribute('role', 'grid');
      tableEl.setAttribute('aria-labelledby', periodId);
      tableEl.addEventListener('keydown', onGridKeydown);

      const thead = document.createElement('thead');
      const headRow = document.createElement('tr');
      if (showWeekNumbers) {
        weekHeadingTh = document.createElement('th');
        weekHeadingTh.className = 'date-time-picker-week-heading';
        weekHeadingTh.scope = 'col';
        headRow.appendChild(weekHeadingTh);
      }
      for (let i = 0; i < 7; i++) {
        const th = document.createElement('th');
        th.className = 'date-time-picker-weekday';
        th.scope = 'col';
        headRow.appendChild(th);
        weekdayThs.push(th);
      }
      thead.appendChild(headRow);
      tableEl.appendChild(thead);

      const tbody = document.createElement('tbody');
      for (let row = 0; row < 6; row++) {
        const tr = document.createElement('tr');
        if (showWeekNumbers) {
          const weekTh = document.createElement('th');
          weekTh.className = 'date-time-picker-week';
          weekTh.scope = 'row';
          tr.appendChild(weekTh);
          weekThs.push(weekTh);
        }
        for (let col = 0; col < 7; col++) {
          const td = document.createElement('td');
          td.setAttribute('role', 'gridcell');
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'date-time-picker-day';
          button.addEventListener('click', () => {
            const iso = button.dataset.date;
            if (iso) selectDay(iso);
          });
          td.appendChild(button);
          tr.appendChild(td);
          dayCells.push({ td, button });
        }
        tbody.appendChild(tr);
      }
      tableEl.appendChild(tbody);
      dialogEl.appendChild(tableEl);
    }

    if (usesTime()) {
      const timeWrap = document.createElement('div');
      timeWrap.className = 'date-time-picker-time';

      const hourLabel = document.createElement('label');
      hourLabel.className = 'date-time-picker-time-label';
      hourLabel.htmlFor = hourId;
      hourLabel.textContent = labels.hour ?? '';
      timeWrap.appendChild(hourLabel);

      hourSelect = document.createElement('select');
      hourSelect.className = 'date-time-picker-hour';
      hourSelect.id = hourId;
      hourSelect.addEventListener('change', () => setHour(Number(hourSelect.value)));
      timeWrap.appendChild(hourSelect);

      const minuteLabel = document.createElement('label');
      minuteLabel.className = 'date-time-picker-time-label';
      minuteLabel.htmlFor = minuteId;
      minuteLabel.textContent = labels.minute ?? '';
      timeWrap.appendChild(minuteLabel);

      minuteSelect = document.createElement('select');
      minuteSelect.className = 'date-time-picker-minute';
      minuteSelect.id = minuteId;
      minuteSelect.addEventListener('change', () => setMinute(Number(minuteSelect.value)));
      timeWrap.appendChild(minuteSelect);

      if (hour12) {
        const meridiemLabel = document.createElement('label');
        meridiemLabel.className = 'date-time-picker-time-label';
        meridiemLabel.htmlFor = meridiemId;
        meridiemLabel.textContent = labels.meridiem ?? '';
        timeWrap.appendChild(meridiemLabel);

        meridiemSelect = document.createElement('select');
        meridiemSelect.className = 'date-time-picker-meridiem';
        meridiemSelect.id = meridiemId;
        meridiemSelect.addEventListener('change', () => setMeridiem(meridiemSelect.value === 'pm'));
        timeWrap.appendChild(meridiemSelect);
      }

      dialogEl.appendChild(timeWrap);
    }

    if (shortcuts.length > 0) {
      const wrap = document.createElement('div');
      wrap.className = 'date-time-picker-shortcuts';
      for (const shortcut of shortcuts) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'date-time-picker-shortcut';
        button.dataset.shortcutId = shortcut.id;
        button.textContent = shortcut.label;
        button.addEventListener('click', () => applyShortcut(shortcut));
        wrap.appendChild(button);
      }
      dialogEl.appendChild(wrap);
    }

    const footer = document.createElement('div');
    footer.className = 'date-time-picker-footer';

    if (labels.clear) {
      const clearBtn = document.createElement('button');
      clearBtn.type = 'button';
      clearBtn.className = 'date-time-picker-clear';
      clearBtn.textContent = labels.clear;
      clearBtn.addEventListener('click', clear);
      footer.appendChild(clearBtn);
    }

    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'date-time-picker-cancel';
    cancelBtn.textContent = labels.cancel;
    cancelBtn.addEventListener('click', () => closeDialog());
    footer.appendChild(cancelBtn);

    const confirmBtn = document.createElement('button');
    confirmBtn.type = 'button';
    confirmBtn.className = 'date-time-picker-confirm';
    confirmBtn.textContent = labels.confirm;
    confirmBtn.addEventListener('click', commit);
    footer.appendChild(confirmBtn);

    dialogEl.appendChild(footer);
  }

  // ---- In-place sync (runs on every state change) ----

  /**
   * Update every state-carrying attribute / text node without touching
   * the elements `buildDialog()` created: `aria-expanded`, dialog
   * `hidden`, the field's display value and `aria-invalid`, the hidden
   * input, the period heading, the weekday headings, every day cell's
   * date / label / state, the week-number column, and the time selects.
   *
   * Everything here is an in-place write, so a state change never
   * destroys focus inside an open dialog or the text field mid-edit.
   */
  function syncState() {
    buttonEl.setAttribute('aria-haspopup', 'dialog');
    buttonEl.setAttribute('aria-expanded', String(open));
    buttonEl.setAttribute('aria-controls', dialogId);
    buttonEl.setAttribute('aria-label', label);
    buttonEl.disabled = fieldEl.disabled || fieldEl.readOnly;

    dialogEl.hidden = !open;
    dialogEl.setAttribute('aria-label', label);

    const display = displayValue();
    // Guarded: while the user is mid-edit, `display` already equals the
    // field's own current value (both derive from `typed`), so this
    // never disturbs the caret.
    if (fieldEl.value !== display) fieldEl.value = display;
    if (invalid) fieldEl.setAttribute('aria-invalid', 'true');
    else fieldEl.removeAttribute('aria-invalid');

    if (hiddenEl) hiddenEl.value = value;

    if (usesDate()) {
      if (periodEl) periodEl.textContent = periodText();

      const headings = weekdays();
      weekdayThs.forEach((th, i) => {
        th.setAttribute('abbr', headings[i]?.long ?? '');
        th.textContent = headings[i]?.short ?? '';
      });

      if (weekHeadingTh) {
        const text = labels.week ?? '';
        weekHeadingTh.setAttribute('abbr', text);
        weekHeadingTh.textContent = text;
      }

      const weeks = monthMatrix(viewYear, viewMonth, firstDayOfWeek);
      const flat = weeks.flat();
      dayCells.forEach(({ td, button }, i) => {
        const isoDate = flat[i];
        const parsed = parseIsoDate(isoDate);
        const isToday = isoDate === today;
        const isSelected = isoDate === pendingDate;
        const isOutside = parsed?.month !== viewMonth;
        const isDisabled = dayDisabled(isoDate);

        button.dataset.date = isoDate;
        if (isOutside) button.setAttribute('data-outside', '');
        else button.removeAttribute('data-outside');
        if (isToday) button.setAttribute('data-today', '');
        else button.removeAttribute('data-today');
        if (isSelected) button.setAttribute('data-selected', '');
        else button.removeAttribute('data-selected');
        button.tabIndex = isoDate === cursor ? 0 : -1;
        button.setAttribute('aria-label', dayLabel(isoDate));
        if (isToday) button.setAttribute('aria-current', 'date');
        else button.removeAttribute('aria-current');
        button.disabled = isDisabled;
        button.textContent = String(parsed?.day ?? '');

        td.setAttribute('aria-selected', String(isSelected));
      });

      weekThs.forEach((th, row) => {
        th.textContent = String(isoWeek(weeks[row][0]));
      });
    }

    if (usesTime()) {
      const pendingHour = parseIsoTime(pendingTime)?.hour ?? 0;
      const pendingMinute = parseIsoTime(pendingTime)?.minute ?? 0;

      if (hourSelect) {
        hourSelect.replaceChildren(
          ...hourOptions().map(({ value: v, label: l }) => {
            const opt = document.createElement('option');
            opt.value = String(v);
            opt.textContent = l;
            return opt;
          }),
        );
        hourSelect.value = String(pendingHour);
      }

      if (minuteSelect) {
        minuteSelect.replaceChildren(
          ...minuteOptions().map((m) => {
            const opt = document.createElement('option');
            opt.value = String(m);
            opt.textContent = pad(m);
            return opt;
          }),
        );
        minuteSelect.value = String(pendingMinute);
      }

      if (meridiemSelect) {
        const am = document.createElement('option');
        am.value = 'am';
        am.textContent = dayPeriodName(locale, false);
        const pm = document.createElement('option');
        pm.value = 'pm';
        pm.textContent = dayPeriodName(locale, true);
        meridiemSelect.replaceChildren(am, pm);
        meridiemSelect.value = pendingHour >= 12 ? 'pm' : 'am';
      }
    }
  }

  // ---- Wire it all up ----

  fieldEl.addEventListener('input', onFieldInput);
  fieldEl.addEventListener('blur', onFieldBlur);
  fieldEl.addEventListener('keydown', onFieldKeydown);
  buttonEl.addEventListener('click', () => (open ? closeDialog() : openDialog()));
  document.addEventListener('click', onDocumentClick);

  const anchor = parseIsoDate(splitValue(value, mode).date) ?? parseIsoDate(today);
  if (anchor) {
    viewYear = anchor.year;
    viewMonth = anchor.month;
    cursor = formatIsoDate(anchor);
  }

  buildButtonIcon();
  buildDialog();
  if (hiddenEl) hiddenEl.value = value;
  syncState();

  return {
    /** The current committed ISO value. */
    getValue: () => value,
    /** Set the committed value programmatically (bypasses parsing). */
    setValue: (next) => {
      typed = null;
      invalid = false;
      commitValue(next ?? '');
      syncState();
    },
    /** Open the dialog. */
    open: openDialog,
    /** Close the dialog without committing. */
    close: () => closeDialog(),
  };
}

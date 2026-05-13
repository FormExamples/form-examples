import { s as ssr_context, g as getContext, a as attr, b as attr_class, c as clsx, e as escape_html, d as derived, f as stringify, i as attr_style, j as spread_props, k as bind_props, l as ensure_array_like, m as setContext, h as head, n as store_get, u as unsubscribe_stores, o as fallback } from "../../chunks/renderer.js";
import "clsx";
import { uid, locale, getDuodecade, dateToString, setEnv, setID } from "@svar-ui/lib-dom";
import { en } from "@svar-ui/core-locales";
import { env } from "@svar-ui/lib-svelte";
import { en as en$1 } from "@svar-ui/grid-locales";
import { EventBusRouter } from "@svar-ui/lib-state";
import { getRenderValue, getValue, isCommunity, getPrintCellStyle, getPrintFilterValue, getHeaderFooterPrintColumns, getPrintColumns, DataStore } from "@svar-ui/grid-store";
import { s as scorecards } from "../../chunks/data.js";
import { b as bandToRecommendation } from "../../chunks/recommendation.js";
import { w as writable } from "../../chunks/index.js";
function html(value) {
  var html2 = String(value);
  var open = "<!---->";
  return open + html2 + "<!---->";
}
function onDestroy(fn) {
  /** @type {SSRContext} */
  ssr_context.r.on_destroy(fn);
}
function getInputId(id) {
  const contextId = getContext("wx-input-id");
  return id || contextId || uid();
}
function Button$1($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      type = "",
      css = "",
      icon = "",
      disabled = false,
      title = "",
      text = "",
      children,
      onclick
    } = $$props;
    let buttonCss = derived(() => {
      let cssType = type ? type.split(" ").filter((a) => a !== "").map((x) => "wx-" + x).join(" ") : "";
      return css + (css ? " " : "") + cssType;
    });
    $$renderer2.push(`<button${attr("title", title)}${attr_class(`wx-button ${buttonCss()}`, "svelte-1dn0zk2", { "wx-icon": icon && !children })}${attr("disabled", disabled, true)}>`);
    if (icon) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<i${attr_class(clsx(icon), "svelte-1dn0zk2")}></i>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (children) {
      $$renderer2.push("<!--[0-->");
      children($$renderer2);
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`${escape_html(text)}`);
    }
    $$renderer2.push(`<!--]--></button>`);
  });
}
function Popup($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      left = 0,
      top = 0,
      at = "bottom",
      parent = null,
      width = "auto",
      css = "",
      oncancel,
      children,
      trackScroll = false
    } = $$props;
    let x = 0;
    let y = 0;
    let w = "auto";
    $$renderer2.push(`<div${attr_class(`wx-popup ${stringify(css)}`, "svelte-3qtw20")}${attr_style(`position:absolute;top:${stringify(y)}px;left:${stringify(x)}px;width:${stringify(w)};`)}>`);
    children?.($$renderer2);
    $$renderer2.push(`<!----></div>`);
  });
}
function InlineDropdown($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      position = "bottom",
      align = "start",
      autoFit = true,
      oncancel = null,
      width = "100%",
      css = "",
      children
    } = $$props;
    $$renderer2.push(`<div${attr_class(`wx-dropdown ${stringify(`wx-${position}-${align}`)} ${stringify(css)}`, "svelte-hhjuqw")}${attr_style(`width:${stringify(width)}`)}>`);
    children?.($$renderer2);
    $$renderer2.push(`<!----></div>`);
  });
}
function Dropdown($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      position = "bottom",
      align = "start",
      autoFit = true,
      inline = false,
      oncancel,
      width = "100%",
      $$slots,
      $$events,
      ...props
    } = $$props;
    let target = void 0;
    const at = derived(() => `${position}-${align}`);
    if (inline) {
      $$renderer2.push("<!--[0-->");
      InlineDropdown($$renderer2, spread_props([{ oncancel, position, align, autoFit, width }, props]));
    } else {
      $$renderer2.push("<!--[-1-->");
      Portal($$renderer2, {
        children: ($$renderer3) => {
          Popup($$renderer3, spread_props([{ parent: target, at: at(), oncancel, width }, props]));
        },
        $$slots: { default: true }
      });
    }
    $$renderer2.push(`<!--]--> <span class="wx-portal-node svelte-1k44xx1"></span>`);
  });
}
function defaultLocale() {
  return locale(en);
}
function SuggestDropdown($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      items = [],
      children,
      onselect,
      onready,
      virtualized = false,
      checkboxes,
      multiselect,
      value,
      $$slots,
      $$events,
      ...rest
    } = $$props;
    (getContext("wx-i18n") || defaultLocale()).getGroup("core");
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function Text$1($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      value = "",
      id,
      readonly = false,
      focus = false,
      select = false,
      type = "text",
      placeholder = "",
      disabled = false,
      error = false,
      inputStyle = "",
      title = "",
      css = "",
      icon = "",
      clear = false,
      onchange
    } = $$props;
    const inputId = getInputId(id);
    let cssString = derived(() => icon && css.indexOf("wx-icon-left") === -1 ? "wx-icon-right " + css : css);
    let hasLeftIcon = derived(() => icon && css.indexOf("wx-icon-left") !== -1);
    $$renderer2.push(`<div${attr_class(`wx-text ${stringify(cssString())}`, "svelte-wqrnun", {
      "wx-error": error,
      "wx-disabled": disabled,
      "wx-clear": clear
    })}>`);
    if (type == "password") {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<input${attr("value", value)}${attr("id", inputId)}${attr("readonly", readonly, true)}${attr("disabled", disabled, true)}${attr("placeholder", placeholder)} type="password"${attr_style(inputStyle)}${attr("title", title)} class="svelte-wqrnun"/>`);
    } else if (type == "number") {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<input${attr("value", value)}${attr("id", inputId)}${attr("readonly", readonly, true)}${attr("disabled", disabled, true)}${attr("placeholder", placeholder)} type="number"${attr_style(inputStyle)}${attr("title", title)} class="svelte-wqrnun"/>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<input${attr("value", value)}${attr("id", inputId)}${attr("readonly", readonly, true)}${attr("disabled", disabled, true)}${attr("placeholder", placeholder)}${attr("title", title)}${attr_style(inputStyle)} class="svelte-wqrnun"/>`);
    }
    $$renderer2.push(`<!--]--> `);
    if (clear && !disabled && value) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<i class="wx-icon wxi-close svelte-wqrnun"></i> `);
      if (hasLeftIcon()) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<i${attr_class(`wx-icon ${stringify(icon)}`, "svelte-wqrnun")}></i>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]-->`);
    } else if (icon) {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<i${attr_class(`wx-icon ${stringify(icon)}`, "svelte-wqrnun")}></i>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, { value });
  });
}
function Header($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const { calendar, formats } = getContext("wx-i18n").getRaw();
    let { date, type, part } = $$props;
    const year = derived(() => date.getFullYear());
    const label = derived(() => {
      switch (type) {
        case "month":
          return dateToString(formats.monthYearFormat, calendar)(date);
        case "year":
          return dateToString(formats.yearFormat, calendar)(date);
        case "duodecade": {
          const { start, end } = getDuodecade(year());
          const yearFormat = dateToString(formats.yearFormat, calendar);
          return `${yearFormat(new Date(start, 0, 1))} - ${yearFormat(new Date(end, 11, 31))}`;
        }
      }
    });
    $$renderer2.push(`<div class="wx-header svelte-g3ydb4">`);
    if (part != "right") {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<i class="wx-pager wxi-angle-left svelte-g3ydb4"></i>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<span class="wx-spacer svelte-g3ydb4"></span>`);
    }
    $$renderer2.push(`<!--]-->  <span class="wx-label svelte-g3ydb4">${escape_html(label())}</span> `);
    if (part != "left") {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<i class="wx-pager wxi-angle-right svelte-g3ydb4"></i>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<span class="wx-spacer svelte-g3ydb4"></span>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
function Button($$renderer, $$props) {
  let { onclick, children } = $$props;
  $$renderer.push(`<button class="svelte-19ddftd">`);
  children?.($$renderer);
  $$renderer.push(`<!----></button>`);
}
function Month($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      value,
      current = void 0,
      part = "",
      markers = null,
      oncancel,
      onchange
    } = $$props;
    const locale2 = (getContext("wx-i18n") || defaultLocale()).getRaw().calendar;
    const weekStart = (locale2.weekStart || 7) % 7;
    const weekdays = locale2.dayShort.slice(weekStart).concat(locale2.dayShort.slice(0, weekStart));
    const dv = (d, dm, dd) => new Date(d.getFullYear(), d.getMonth() + (dm || 0), d.getDate() + (dd || 0));
    let ranges = part !== "normal";
    function isWeekEnd(date2) {
      const d = date2.getDay();
      return d === 0 || d === 6;
    }
    function getStart() {
      const start = dv(current, 0, 1 - current.getDate());
      start.setDate(start.getDate() - (start.getDay() - (weekStart - 7)) % 7);
      return start;
    }
    function getEnd() {
      const end = dv(current, 1, -current.getDate());
      end.setDate(end.getDate() + (6 - end.getDay() + weekStart) % 7);
      return end;
    }
    const date = derived(() => {
      if (part == "normal") return [value ? dv(value).valueOf() : 0];
      return value ? [
        value.start ? dv(value.start).valueOf() : 0,
        value.end ? dv(value.end).valueOf() : 0
      ] : [0, 0];
    });
    const days = derived(() => {
      const start = getStart();
      const end = getEnd();
      const curMonth = current.getMonth();
      let days2 = [];
      for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
        const day = {
          day: d.getDate(),
          in: d.getMonth() === curMonth,
          date: d.valueOf()
        };
        let css = "";
        css += !day.in ? " wx-inactive" : "";
        css += date().indexOf(day.date) > -1 ? " wx-selected" : "";
        if (ranges) {
          const s = day.date == date()[0];
          const e = day.date == date()[1];
          if (s && !e) css += " wx-left";
          else if (e && !s) css += " wx-right";
          if (day.date > date()[0] && day.date < date()[1]) css += " wx-inrange";
        }
        css += isWeekEnd(d) ? " wx-weekend" : "";
        if (markers) {
          const mark = markers(d);
          if (mark) css += " " + mark;
        }
        days2.push({ ...day, css });
      }
      return days2;
    });
    $$renderer2.push(`<div><div class="wx-weekdays svelte-73ekxz"><!--[-->`);
    const each_array = ensure_array_like(weekdays);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let day = each_array[$$index];
      $$renderer2.push(`<div class="wx-weekday svelte-73ekxz">${escape_html(day)}</div>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="wx-days svelte-73ekxz"><!--[-->`);
    const each_array_1 = ensure_array_like(days());
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let day = each_array_1[$$index_1];
      $$renderer2.push(`<div${attr_class(`wx-day ${stringify(day.css)}`, "svelte-73ekxz", { "wx-out": !day.in })}${attr("data-id", day.date)}>${escape_html(day.day)}</div>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
    bind_props($$props, { current });
  });
}
function Year($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      value = void 0,
      current = void 0,
      part,
      oncancel,
      onchange,
      onshift
    } = $$props;
    const locale2 = getContext("wx-i18n").getRaw().calendar;
    const months = locale2.monthShort;
    const monthNum = derived(() => current.getMonth());
    function done() {
      const date = new Date(getPartValue(value, part) || current);
      date.setMonth(current.getMonth());
      date.setFullYear(current.getFullYear());
      onchange && onchange(date);
    }
    $$renderer2.push(`<div class="wx-months svelte-yb7e90"><!--[-->`);
    const each_array = ensure_array_like(months);
    for (let i = 0, $$length = each_array.length; i < $$length; i++) {
      let month = each_array[i];
      $$renderer2.push(`<div${attr_class("wx-month svelte-yb7e90", void 0, { "wx-current": monthNum() === i })}${attr("data-id", i)}>${escape_html(month)}</div>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="wx-buttons svelte-yb7e90">`);
    Button($$renderer2, {
      onclick: done,
      children: ($$renderer3) => {
        $$renderer3.push(`<!---->${escape_html(locale2.done)}`);
      }
    });
    $$renderer2.push(`<!----></div>`);
    bind_props($$props, { value, current });
  });
}
function Duodecade($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const _ = getContext("wx-i18n").getRaw().calendar;
    let {
      value = void 0,
      current = void 0,
      oncancel,
      onchange,
      onshift,
      part
    } = $$props;
    const year = derived(() => current.getFullYear());
    const years = derived(() => {
      const { start, end } = getDuodecade(year());
      const years2 = [];
      for (let y = start; y <= end; ++y) {
        years2.push(y);
      }
      return years2;
    });
    function done() {
      const date = new Date(getPartValue(value, part) || current);
      date.setFullYear(current.getFullYear());
      onchange && onchange(date);
    }
    $$renderer2.push(`<div class="wx-years svelte-1dy5bl9"><!--[-->`);
    const each_array = ensure_array_like(years());
    for (let i = 0, $$length = each_array.length; i < $$length; i++) {
      let y = each_array[i];
      $$renderer2.push(`<div${attr_class("wx-year svelte-1dy5bl9", void 0, {
        "wx-current": year() == y,
        "wx-prev-decade": i === 0,
        "wx-next-decade": i === 11
      })}${attr("data-id", y)}>${escape_html(y)}</div>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="wx-buttons svelte-1dy5bl9">`);
    Button($$renderer2, {
      onclick: done,
      children: ($$renderer3) => {
        $$renderer3.push(`<!---->${escape_html(_.done)}`);
      }
    });
    $$renderer2.push(`<!----></div>`);
    bind_props($$props, { value, current });
  });
}
const configs = {
  month: {
    component: Month,
    next: nextMonth,
    prev: prevMonth
  },
  year: {
    component: Year,
    next: nextYear,
    prev: prevYear
  },
  duodecade: {
    component: Duodecade,
    next: nextDuodecade,
    prev: prevDuodecade
  }
};
function prevMonth(current) {
  current = new Date(current);
  current.setMonth(current.getMonth() - 1);
  return current;
}
function nextMonth(current) {
  current = new Date(current);
  current.setMonth(current.getMonth() + 1);
  return current;
}
function prevYear(current) {
  current = new Date(current);
  current.setFullYear(current.getFullYear() - 1);
  return current;
}
function nextYear(current) {
  current = new Date(current);
  current.setFullYear(current.getFullYear() + 1);
  return current;
}
function prevDuodecade(current) {
  current = new Date(current);
  current.setFullYear(current.getFullYear() - 10);
  return current;
}
function nextDuodecade(current) {
  current = new Date(current);
  current.setFullYear(current.getFullYear() + 10);
  return current;
}
function getPartValue(value, part) {
  let date;
  if (part === "normal") date = value;
  else {
    const { start, end } = value;
    if (part === "left") date = start;
    else if (part == "right") date = end;
    else date = start ? end : start;
  }
  return date;
}
function Panel($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const _ = getContext("wx-i18n").getGroup("calendar");
    let {
      value,
      current = void 0,
      part = "normal",
      markers = null,
      buttons = ["clear", "today"],
      onshift: shift,
      onchange: change
    } = $$props;
    let type = "month";
    let buttonList = derived(() => {
      if (Array.isArray(buttons)) return buttons;
      return buttons ? ["clear", "today"] : [];
    });
    function selectDate(ev, date) {
      ev.preventDefault();
      change && change({ value: date });
    }
    function oncancel() {
      if (type === "duodecade") type = "year";
      else if (type === "year") type = "month";
    }
    function onshift(ev) {
      const { diff } = ev;
      if (diff === 0) {
        if (type === "month") type = "year";
        else if (type === "year") type = "duodecade";
        return;
      }
      if (diff) {
        const obj = configs[type];
        current = diff > 0 ? obj.next(current) : obj.prev(current);
      }
      shift && shift();
    }
    function onchange(value2) {
      type = "month";
      change && change({ select: true, value: value2 });
    }
    function getButtonValue(btn) {
      if (btn === "done") return -1;
      if (btn === "clear") return null;
      if (btn === "today") return /* @__PURE__ */ new Date();
    }
    const SvelteComponent = derived(() => configs[type].component);
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div${attr_class(`wx-calendar ${stringify(part !== "normal" && part !== "both" ? "wx-part" : "")}`, "svelte-rw2ltr")}><div class="wx-wrap svelte-rw2ltr">`);
      Header($$renderer3, { date: current, part, type });
      $$renderer3.push(`<!----> <div>`);
      if (SvelteComponent()) {
        $$renderer3.push("<!--[-->");
        SvelteComponent()($$renderer3, {
          value,
          part,
          markers,
          onchange,
          oncancel,
          onshift,
          get current() {
            return current;
          },
          set current($$value) {
            current = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push("<!--]-->");
      } else {
        $$renderer3.push("<!--[!-->");
        $$renderer3.push("<!--]-->");
      }
      $$renderer3.push(` `);
      if (type === "month" && buttonList().length > 0) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<div class="wx-buttons svelte-rw2ltr"><!--[-->`);
        const each_array = ensure_array_like(buttonList());
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let btn = each_array[$$index];
          $$renderer3.push(`<div class="wx-button-item svelte-rw2ltr">`);
          Button($$renderer3, {
            onclick: (e) => selectDate(e, getButtonValue(btn)),
            children: ($$renderer4) => {
              $$renderer4.push(`<!---->${escape_html(_(btn))}`);
            }
          });
          $$renderer3.push(`<!----></div>`);
        }
        $$renderer3.push(`<!--]--></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></div></div></div>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { current });
  });
}
function Locale($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { words = null, optional = false, children } = $$props;
    let l = getContext("wx-i18n");
    if (!l || words !== null) {
      if (!l) {
        l = locale(en);
      }
      l = l.extend(words, optional);
      setContext("wx-i18n", l);
    }
    children?.($$renderer2);
    $$renderer2.push(`<!---->`);
  });
}
function Calendar($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      value = void 0,
      current = void 0,
      markers = null,
      buttons = ["clear", "today"],
      onchange
    } = $$props;
    function fixCurrent(force) {
      if (!current || force) current = value ? new Date(value) : /* @__PURE__ */ new Date();
      current.setDate(1);
    }
    fixCurrent(value);
    function change(v) {
      const x = v.value;
      if (x) {
        value = new Date(x);
        fixCurrent(true);
      } else {
        value = null;
      }
      onchange && onchange({ value });
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      Locale($$renderer3, {
        children: ($$renderer4) => {
          Panel($$renderer4, {
            value,
            markers,
            buttons,
            onchange: change,
            get current() {
              return current;
            },
            set current($$value) {
              current = $$value;
              $$settled = false;
            }
          });
        }
      });
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { value, current });
  });
}
function toDateDropdown(dropdown) {
  if (!dropdown) dropdown = {};
  if (!dropdown.width) dropdown.width = "unset";
  return dropdown;
}
function DatePicker($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      value = void 0,
      id,
      disabled = false,
      error = false,
      placeholder = "",
      format = "",
      buttons = ["clear", "today"],
      css = "",
      title = "",
      editable = false,
      clear = false,
      onchange,
      dropdown = {}
    } = $$props;
    const { calendar: calendarLocale, formats } = (getContext("wx-i18n") || defaultLocale()).getRaw();
    const f = format || formats.dateFormat;
    let dateFormat = typeof f === "function" ? f : dateToString(f, calendarLocale);
    let popup = void 0;
    function oncancel() {
      popup = false;
    }
    function doChange(v) {
      const skipEvent = v === value || v && value && v.valueOf() === value.valueOf() || !v && !value;
      value = v;
      if (!skipEvent) {
        onchange && onchange({ value });
      }
      setTimeout(oncancel, 1);
    }
    const formattedValue = derived(() => value ? dateFormat(value) : "");
    function change({ value: v, input }) {
      if (!editable && !clear) return;
      if (input) return;
      let date = typeof editable === "function" ? editable(v) : v ? new Date(v) : null;
      date = isNaN(date) ? value || null : date || null;
      doChange(date);
    }
    $$renderer2.push(`<div class="wx-datepicker svelte-1tidbnk">`);
    Text$1($$renderer2, {
      css,
      title,
      value: formattedValue(),
      id,
      readonly: !editable,
      disabled,
      error,
      placeholder,
      oninput: oncancel,
      onchange: change,
      icon: "wxi-calendar",
      inputStyle: "cursor: pointer; width: 100%; padding-right: calc(var(--wx-input-icon-size) + var(--wx-input-icon-indent) * 2);",
      clear
    });
    $$renderer2.push(`<!----> `);
    if (popup && !disabled) {
      $$renderer2.push("<!--[0-->");
      Dropdown($$renderer2, spread_props([
        { oncancel },
        toDateDropdown(dropdown),
        {
          children: ($$renderer3) => {
            Calendar($$renderer3, { buttons, value, onchange: (e) => doChange(e.value) });
          },
          $$slots: { default: true }
        }
      ]));
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, { value });
  });
}
function RichSelect($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      value = "",
      options = [],
      textOptions = null,
      placeholder = "",
      disabled = false,
      error = false,
      title = "",
      textField = "label",
      clear = false,
      children: kids,
      onchange,
      dropdown = {}
    } = $$props;
    let navigate;
    function ready(ev) {
      navigate = ev.navigate;
      ev.keydown;
    }
    let selected = derived(() => value || value === 0 ? (textOptions || options).find((a) => a.id === value) : null);
    function select({ id }) {
      if (id || id === 0) {
        value = id;
        navigate(null);
        onchange && onchange({ value });
      }
    }
    $$renderer2.push(`<div${attr_class("wx-richselect svelte-2gmqts", void 0, {
      "wx-error": error,
      "wx-disabled": disabled,
      "wx-nowrap": !kids
    })}${attr("title", title)} tabindex="0"><div class="wx-label svelte-2gmqts">`);
    if (selected()) {
      $$renderer2.push("<!--[0-->");
      if (kids) {
        $$renderer2.push("<!--[0-->");
        kids($$renderer2, selected());
        $$renderer2.push(`<!---->`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`${escape_html(selected()[textField])}`);
      }
      $$renderer2.push(`<!--]-->`);
    } else if (placeholder) {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<span class="wx-placeholder svelte-2gmqts">${escape_html(placeholder)}</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(` `);
    }
    $$renderer2.push(`<!--]--></div> `);
    if (clear && !disabled && value) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<i class="wx-icon wxi-close svelte-2gmqts"></i>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<i class="wx-icon wxi-angle-down svelte-2gmqts"></i>`);
    }
    $$renderer2.push(`<!--]--> `);
    if (!disabled) {
      $$renderer2.push("<!--[0-->");
      {
        let children = function($$renderer3, { option }) {
          if (kids) {
            $$renderer3.push("<!--[0-->");
            kids($$renderer3, option);
            $$renderer3.push(`<!---->`);
          } else {
            $$renderer3.push("<!--[-1-->");
            $$renderer3.push(`${escape_html(option[textField])}`);
          }
          $$renderer3.push(`<!--]-->`);
        };
        SuggestDropdown($$renderer2, spread_props([
          { items: options, onready: ready, onselect: select },
          dropdown,
          { children, $$slots: { default: true } }
        ]));
      }
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, { value });
  });
}
function Portal($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { theme = "", target, children } = $$props;
    const mount = (h) => {
    };
    if (theme === "") theme = getContext("wx-theme");
    onDestroy(() => {
    });
    $$renderer2.push(`<div class="wx-portal svelte-17o2eio"><div${attr_class(`wx-${stringify(theme)}-theme`, "svelte-17o2eio")}>`);
    children?.($$renderer2, { mount });
    $$renderer2.push(`<!----></div></div>`);
    bind_props($$props, { theme, mount });
  });
}
function FontOpenSans($$renderer) {
  $$renderer.push(`${html(`<style>
@font-face {
font-family: 'Open Sans';
font-style: normal;
font-weight: 500;
src: local(''),
      url('https://cdn.svar.dev/fonts/open-sans/500.woff2') format('woff2'),
      url('https://cdn.svar.dev/fonts/open-sans/500.woff') format('woff');
}
@font-face {
font-family: 'Open Sans';
font-style: normal;
font-weight: 400;
src: local(''),
      url('https://cdn.svar.dev/fonts/open-sans/regular.woff2') format('woff2'),
      url('https://cdn.svar.dev/fonts/open-sans/regular.woff') format('woff');
}
@font-face {
font-family: 'Open Sans';
font-style: normal;
font-weight: 600;
src: local(''),
      url('https://cdn.svar.dev/fonts/open-sans/600.woff2') format('woff2'),
      url('https://cdn.svar.dev/fonts/open-sans/600.woff') format('woff');
}
@font-face {
font-family: 'Open Sans';
font-style: normal;
font-weight: 700;
src: local(''),
      url('https://cdn.svar.dev/fonts/open-sans/700.woff2') format('woff2'),
      url('https://cdn.svar.dev/fonts/open-sans/700.woff') format('woff');
}
  </style>`)}`);
}
function Willow($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { fonts = true, children } = $$props;
    setContext("wx-theme", "willow");
    head("1nkmr5q", $$renderer2, ($$renderer3) => {
      if (fonts) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<link rel="preconnect" href="https://cdn.svar.dev" crossorigin=""/> `);
        FontOpenSans($$renderer3);
        $$renderer3.push(`<!----> <link rel="stylesheet" href="https://cdn.svar.dev/fonts/wxi/wx-icons.css"/>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    });
    if (children) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="wx-theme wx-willow-theme" style="height:100%">`);
      children($$renderer2);
      $$renderer2.push(`<!----></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
setEnv(env);
function getStyle(width, flexgrow, fixed, left, right, height) {
  const w = width ? `width:${width}px;` : "";
  const mw = width ? `min-width:${width}px;` : "";
  const fl = flexgrow ? `flex-grow:${flexgrow};` : "";
  const h = height ? `height:${height}px;` : "";
  let fx = "";
  if (fixed) {
    if (fixed.left) fx = `position:sticky;left:${left}px;`;
    if (fixed.right) fx = `position:sticky;right:${right}px;`;
  }
  return `${mw}${w}${h}${fl}${fx}`;
}
function getCssName(column, cell, columnStyle) {
  let css = "";
  if (column.fixed) {
    for (const pos in column.fixed) {
      let isShadow = column.fixed[pos] === -1;
      if (!isShadow && column.fixed.leftSize && cell.colspan) {
        const spanIndex = cell.colspan + column._colindex - 1;
        isShadow = spanIndex === column.fixed.leftSize;
      }
      css += isShadow ? "wx-shadow " : "wx-fixed ";
    }
  }
  css += cell.rowspan > 1 ? "wx-rowspan " : "";
  css += cell.colspan > 1 ? "wx-colspan " : "";
  css += cell.vertical ? "wx-vertical " : "";
  css += columnStyle ? columnStyle(column) + " " : "";
  return css;
}
function Cell($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let {
      row,
      column,
      cellStyle = null,
      columnStyle = null,
      children,
      focusable
    } = $$props;
    let style = derived(() => getStyle(column.width, column.flexgrow, column.fixed, column.left, column.right));
    let css = derived(() => buildCellCss(columnStyle, cellStyle));
    const api = getContext("grid-store");
    const { focusCell, search, reorder } = api.getReactiveState();
    const shouldHighlight = derived(() => store_get($$store_subs ??= {}, "$search", search)?.rows[row.id] && store_get($$store_subs ??= {}, "$search", search).rows[row.id][column.id]);
    const isDraggable = derived(() => typeof column.draggable === "function" ? column.draggable(row, column) !== false : column.draggable);
    function buildCellCss(columnStyle2, cellStyle2) {
      let css2 = "wx-cell";
      css2 += column.fixed ? " " + (column.fixed === -1 ? "wx-shadow" : "wx-fixed") : "";
      css2 += columnStyle2 ? " " + columnStyle2(column) : "";
      css2 += cellStyle2 ? " " + cellStyle2(row, column) : "";
      css2 += column.treetoggle ? " wx-tree-cell" : "";
      return css2;
    }
    onDestroy(() => {
      if (focusable && store_get($$store_subs ??= {}, "$focusCell", focusCell)) {
        api.exec("focus-cell", { eventSource: "destroy" });
        focusable = false;
      }
    });
    function highlightText(text) {
      const regex = new RegExp(`(${store_get($$store_subs ??= {}, "$search", search).value.trim()})`, "gi");
      const parts = String(text).split(regex);
      return parts.map((text2) => ({ text: text2, highlight: regex.test(text2) }));
    }
    $$renderer2.push(`<div${attr_class(clsx(css()), "svelte-j0axpq", {
      "wx-shadow": column.fixed && column.fixed.left === -1 || column.fixed.right === -1,
      "wx-fixed-right": column.fixed && column.fixed.right
    })}${attr_style(style())}${attr("data-row-id", setID(row.id))}${attr("data-col-id", setID(column.id))}${attr("tabindex", focusable ? "0" : "-1")} role="gridcell"${attr("aria-colindex", column._colindex)}${attr("aria-readonly", !column.editor ? true : void 0)}>`);
    if (store_get($$store_subs ??= {}, "$reorder", reorder) && column.draggable) {
      $$renderer2.push("<!--[0-->");
      if (isDraggable()) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<i draggable-data="true" class="wx-draggable wxi-drag svelte-j0axpq"></i>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<i class="wx-draggable-stub svelte-j0axpq"></i>`);
      }
      $$renderer2.push(`<!--]-->`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (column.treetoggle) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span${attr_style(`margin-left:${stringify(row.$level * 28)}px;`)}></span> `);
      if (row.$count) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<i data-action="toggle-row"${attr_class(`wx-table-tree-toggle wxi-menu-${stringify(row.open !== false ? "down" : "right")}`, "svelte-j0axpq")}></i>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]-->`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (column.cell) {
      $$renderer2.push("<!--[0-->");
      if (column.cell) {
        $$renderer2.push("<!--[-->");
        column.cell($$renderer2, {
          api,
          row,
          column,
          onaction: ({ action, data }) => api.exec(action, data)
        });
        $$renderer2.push("<!--]-->");
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push("<!--]-->");
      }
    } else if (children) {
      $$renderer2.push("<!--[1-->");
      children($$renderer2);
      $$renderer2.push(`<!---->`);
    } else if (shouldHighlight()) {
      $$renderer2.push("<!--[2-->");
      $$renderer2.push(`<span><!--[-->`);
      const each_array = ensure_array_like(highlightText(getRenderValue(row, column)));
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let { highlight, text } = each_array[$$index];
        if (highlight) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<mark class="wx-search svelte-j0axpq">${escape_html(text)}</mark>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`${escape_html(text)}`);
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`${escape_html(getRenderValue(row, column))}`);
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function Text_1($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { filter, column, action, filterValue } = $$props;
    function filterRows({ value }) {
      action({ value, key: column.id });
    }
    Text$1($$renderer2, spread_props([
      filter.config ?? {},
      { value: filterValue, onchange: filterRows }
    ]));
  });
}
function Richselect$1($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { filter, column, action, filterValue } = $$props;
    const api = getContext("grid-store");
    const { flatData: data } = api.getReactiveState();
    let options = derived(() => filter?.config?.options || column.options || getOptions(store_get($$store_subs ??= {}, "$data", data)));
    let template = derived(() => filter?.config?.template);
    function getOptions() {
      const options2 = [];
      store_get($$store_subs ??= {}, "$data", data).forEach((d) => {
        const value = getValue(d, column);
        if (!options2.includes(value)) options2.push(value);
      });
      return options2.map((opt) => ({ id: opt, label: opt }));
    }
    function filterRows({ value }) {
      action({ value, key: column.id });
    }
    $$renderer2.push(`<div style="width:100%;">`);
    {
      let children = function($$renderer3, option) {
        if (template()) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`${escape_html(template()(option))}`);
        } else {
          $$renderer3.push("<!--[-1-->");
          $$renderer3.push(`${escape_html(option.label)}`);
        }
        $$renderer3.push(`<!--]-->`);
      };
      RichSelect($$renderer2, spread_props([
        { placeholder: "", clear: true },
        filter.config ?? {},
        {
          options: options(),
          value: filterValue,
          onchange: filterRows,
          children,
          $$slots: { default: true }
        }
      ]));
    }
    $$renderer2.push(`<!----></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function DatePicker_1($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { filter, column, action, filterValue } = $$props;
    function filterRows({ value }) {
      action({ value, key: column.id });
    }
    $$renderer2.push(`<div style="width:100%;">`);
    DatePicker($$renderer2, spread_props([
      { placeholder: "", clear: true },
      filter.config ?? {},
      { value: filterValue, onchange: filterRows }
    ]));
    $$renderer2.push(`<!----></div>`);
  });
}
const filters = {
  text: Text_1,
  richselect: Richselect$1,
  datepicker: DatePicker_1
};
function Filter($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { filter, column } = $$props;
    const api = getContext("grid-store");
    const { filterValues } = api.getReactiveState();
    function filterRows(data) {
      api.exec("filter-rows", data);
    }
    const SvelteComponent = derived(() => filters[filter.type]);
    if (SvelteComponent()) {
      $$renderer2.push("<!--[-->");
      SvelteComponent()($$renderer2, {
        filter,
        column,
        action: filterRows,
        filterValue: store_get($$store_subs ??= {}, "$filterValues", filterValues)[column.id]
      });
      $$renderer2.push("<!--]-->");
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push("<!--]-->");
    }
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function HeaderCell($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let {
      cell,
      column,
      row,
      lastRow,
      sortRow,
      columnStyle,
      bodyHeight,
      hasSplit
    } = $$props;
    const api = getContext("grid-store");
    const { sortMarks } = api.getReactiveState();
    let sortMark = derived(() => store_get($$store_subs ??= {}, "$sortMarks", sortMarks)[column.id]);
    let isCollapsed = derived(() => cell.collapsed && column.collapsed);
    let overlay = derived(() => isCollapsed() && !hasSplit && cell.collapsible !== "header");
    let collapsedTextStyle = derived(() => overlay() ? `top:-${bodyHeight / 2}px;position:absolute;` : "");
    let style = derived(() => getStyle(cell.width, cell.flexgrow, column.fixed, column.left, cell.right ?? column.right, cell.height + (isCollapsed() && overlay() ? bodyHeight : 0)));
    const css = derived(() => getCssName(column, cell, columnStyle));
    function getCell() {
      return Object.fromEntries(Object.entries(cell).filter(([key]) => key !== "cell"));
    }
    if (isCollapsed()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div${attr_class(`wx-cell ${stringify(css())} ${stringify(cell.css || "")} wx-collapsed`, "svelte-dl5wnl")}${attr_style(style())} role="button"${attr("aria-label", `Expand column ${cell.text || ""}`)}${attr("aria-expanded", !cell.collapsed)} tabindex="0"${attr("data-header-id", setID(column.id))}><div class="wx-text svelte-dl5wnl"${attr_style(collapsedTextStyle())}>${escape_html(cell.text || "")}</div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div${attr_class(`wx-cell ${stringify(css())} ${stringify(cell.css || "")}`, "svelte-dl5wnl", {
        "wx-filter": cell.filter,
        "wx-fixed-right": column.fixed && column.fixed.right
      })}${attr_style(style())}${attr("data-header-id", setID(column.id))}${attr("tabindex", !cell._hidden && column.sort && !cell.filter ? "0" : void 0)} role="columnheader"${attr("aria-colindex", cell._colindex)}${attr("aria-colspan", cell.colspan > 1 ? cell.colspan : void 0)}${attr("aria-rowspan", cell.rowspan > 1 ? cell.rowspan : void 0)}${attr("aria-sort", !sortMark()?.order || cell.filter ? "none" : sortMark()?.order === "asc" ? "ascending" : "descending")}>`);
      if (cell.collapsible) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="wx-collapse svelte-dl5wnl" role="button"${attr("aria-label", cell.collapsed ? "Expand column" : "Collapse column")}${attr("aria-expanded", !cell.collapsed)} tabindex="0"><i${attr_class(`wxi-angle-${stringify(cell.collapsed ? "down" : "right")}`, "svelte-dl5wnl")}></i></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (cell.cell) {
        $$renderer2.push("<!--[0-->");
        if (cell.cell) {
          $$renderer2.push("<!--[-->");
          cell.cell($$renderer2, {
            api,
            cell: getCell(),
            column,
            row,
            onaction: ({ action, data }) => api.exec(action, data)
          });
          $$renderer2.push("<!--]-->");
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push("<!--]-->");
        }
      } else if (cell.filter) {
        $$renderer2.push("<!--[1-->");
        Filter($$renderer2, { filter: cell.filter, column });
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<div class="wx-text svelte-dl5wnl">${escape_html(cell.text || "")}</div>`);
      }
      $$renderer2.push(`<!--]--> `);
      if (column.resize && lastRow && !cell._hidden) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="wx-grip svelte-dl5wnl" role="presentation" aria-label="Resize column"><div class="svelte-dl5wnl"></div></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (sortRow) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="wx-sort svelte-dl5wnl">`);
        if (sortMark()) {
          $$renderer2.push("<!--[0-->");
          if (typeof sortMark().index !== "undefined") {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<div class="wx-order svelte-dl5wnl">${escape_html(sortMark().index + 1)}</div>`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--> <i${attr_class(`wxi-arrow-${stringify(sortMark().order === "asc" ? "up" : "down")}`, "svelte-dl5wnl")}></i>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function FooterCell($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const api = getContext("grid-store");
    let { cell, column, row, columnStyle } = $$props;
    let style = derived(() => getStyle(cell.width, cell.flexgrow, column.fixed, column.left, cell.right ?? column.right, cell.height));
    let css = derived(() => getCssName(column, cell, columnStyle));
    function getCell() {
      return Object.fromEntries(Object.entries(cell).filter(([key]) => key !== "cell"));
    }
    $$renderer2.push(`<div${attr_class(`wx-cell ${stringify(css())} ${stringify(cell.css || "")}`, "svelte-1wm9xan", { "wx-fixed-right": column.fixed && column.fixed.right })}${attr_style(style())}>`);
    if (!column.collapsed && !cell.collapsed) {
      $$renderer2.push("<!--[0-->");
      if (cell.cell) {
        $$renderer2.push("<!--[0-->");
        if (cell.cell) {
          $$renderer2.push("<!--[-->");
          cell.cell($$renderer2, {
            api,
            cell: getCell(),
            column,
            row,
            onaction: ({ action, data }) => api.exec(action, data)
          });
          $$renderer2.push("<!--]-->");
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push("<!--]-->");
        }
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<div class="wx-text svelte-1wm9xan">${escape_html(cell.text || "")}</div>`);
      }
      $$renderer2.push(`<!--]-->`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
function HeaderFooter$1($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let {
      deltaLeft,
      contentWidth,
      columns,
      type = "header",
      columnStyle,
      bodyHeight
    } = $$props;
    const api = getContext("grid-store");
    const { _sizes: sizes, split } = api.getReactiveState();
    let rowHeights = derived(() => store_get($$store_subs ??= {}, "$sizes", sizes)[`${type}RowHeights`]);
    let renderedHeader = derived(() => {
      let res = [];
      if (columns.length) {
        const rowsCount = columns[0][type].length;
        for (let ri = 0; ri < rowsCount; ri++) {
          let inSpan = 0;
          res.push([]);
          columns.forEach((col, ci) => {
            const cell = { ...col[type][ri] };
            if (!inSpan) {
              res[ri].push(cell);
            }
            if (cell.colspan > 1) {
              inSpan = cell.colspan - 1;
              if (!isCommunity()) {
                if (col.right) {
                  let right = col.right;
                  for (let i = 1; i < cell.colspan; i++) {
                    right -= columns[ci + i].width;
                  }
                  cell.right = right;
                }
              }
            } else if (inSpan) inSpan--;
          });
        }
      }
      return res;
    });
    const hasSplit = derived(() => store_get($$store_subs ??= {}, "$split", split)?.left || store_get($$store_subs ??= {}, "$split", split)?.right);
    function getColumn(id) {
      return columns.find((c) => c.id === id);
    }
    function isLast(cell, ind) {
      if (cell.rowspan) ind += cell.rowspan - 1;
      return ind === renderedHeader().length - 1;
    }
    function isSort(cell, ind, column) {
      if (!column.sort) return false;
      for (let i = renderedHeader().length - 1; i >= 0; i--) {
        const cell2 = column.header[i];
        if (!cell2.filter && !cell2._hidden) return ind === i;
      }
      return isLast(cell, ind);
    }
    $$renderer2.push(`<div${attr_class(`wx-${type}`, "svelte-dt6ajs")}${attr_style(`padding-left:${stringify(deltaLeft)}px;width:${stringify(contentWidth)}px;`)} role="rowgroup"><!--[-->`);
    const each_array = ensure_array_like(renderedHeader());
    for (let i = 0, $$length = each_array.length; i < $$length; i++) {
      let row = each_array[i];
      $$renderer2.push(`<div${attr_class(clsx(type === "header" ? "wx-h-row" : "wx-f-row"))}${attr_style(`height:${stringify(rowHeights()[i])}px; display: flex`)} role="row"><!--[-->`);
      const each_array_1 = ensure_array_like(row);
      for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
        let cell = each_array_1[$$index];
        const column = getColumn(cell.id);
        if (type === "header") {
          $$renderer2.push("<!--[0-->");
          HeaderCell($$renderer2, {
            cell,
            columnStyle,
            column,
            row: i,
            lastRow: isLast(cell, i),
            bodyHeight,
            sortRow: isSort(cell, i, column),
            hasSplit: hasSplit()
          });
        } else {
          $$renderer2.push("<!--[-1-->");
          FooterCell($$renderer2, { cell, columnStyle, column: getColumn(cell.id), row: i });
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function Overlay($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { overlay } = $$props;
    const api = getContext("grid-store");
    function isComponent(prop) {
      return typeof prop === "function";
    }
    $$renderer2.push(`<div class="wx-overlay svelte-s5blua">`);
    if (isComponent(overlay)) {
      $$renderer2.push("<!--[0-->");
      const SvelteComponent = overlay;
      if (SvelteComponent) {
        $$renderer2.push("<!--[-->");
        SvelteComponent($$renderer2, { onaction: ({ action, data }) => api.exec(action, data) });
        $$renderer2.push("<!--]-->");
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push("<!--]-->");
      }
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`${escape_html(overlay)}`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
function Text($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { editor, onsave, onapply } = $$props;
    let value = editor.value || "";
    $$renderer2.push(`<input class="wx-text svelte-pv4azh" type="text"${attr("value", value)}/>`);
  });
}
function Combo($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { editor, onaction, onsave, onapply, oncancel } = $$props;
    let tmp = editor, value = tmp.value, text = tmp.renderedValue, filterOptions = tmp.options;
    let tmp_1 = editor?.config || {}, template = tmp_1.template, cell = tmp_1.cell, dropdown = fallback(tmp_1.dropdown, () => ({}), true);
    const dropdownOptions = derived(() => ({ trackScroll: true, ...dropdown }));
    let index = derived(() => filterOptions.findIndex((a) => a.id === value));
    function updateValue({ id }) {
      onapply(id);
      onsave();
    }
    let navigate;
    function ready(ev) {
      navigate = ev.navigate;
      ev.keydown;
      navigate(index());
    }
    $$renderer2.push(`<input class="wx-input svelte-1vxy55u"${attr("value", text)}/> `);
    {
      let children = function($$renderer3, { option }) {
        if (template) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`${escape_html(template(option))}`);
        } else if (cell) {
          $$renderer3.push("<!--[1-->");
          const SvelteComponent_1 = cell;
          if (SvelteComponent_1) {
            $$renderer3.push("<!--[-->");
            SvelteComponent_1($$renderer3, { data: option, onaction });
            $$renderer3.push("<!--]-->");
          } else {
            $$renderer3.push("<!--[!-->");
            $$renderer3.push("<!--]-->");
          }
        } else {
          $$renderer3.push("<!--[-1-->");
          $$renderer3.push(`${escape_html(option.label)}`);
        }
        $$renderer3.push(`<!--]-->`);
      };
      SuggestDropdown($$renderer2, spread_props([
        { items: filterOptions, onready: ready, onselect: updateValue },
        dropdownOptions(),
        { oncancel, children, $$slots: { default: true } }
      ]));
    }
    $$renderer2.push(`<!---->`);
  });
}
function Datepicker($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { editor, onaction, onsave, onapply, oncancel } = $$props;
    let value = editor.value || /* @__PURE__ */ new Date();
    let tmp = editor?.config || {}, template = tmp.template, cell = tmp.cell, dropdown = fallback(tmp.dropdown, () => ({}), true);
    const dropdownOptions = derived(() => ({ trackScroll: true, width: "auto", ...dropdown }));
    function updateValue({ value: value2 }) {
      onapply(value2);
      onsave();
    }
    $$renderer2.push(`<div class="wx-value svelte-n4ox9y" tabindex="0">`);
    if (template) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`${escape_html(template(value))}`);
    } else if (cell) {
      $$renderer2.push("<!--[1-->");
      const SvelteComponent = cell;
      if (SvelteComponent) {
        $$renderer2.push("<!--[-->");
        SvelteComponent($$renderer2, { data: editor.value, onaction });
        $$renderer2.push("<!--]-->");
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push("<!--]-->");
      }
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<span class="wx-text svelte-n4ox9y">${escape_html(editor.renderedValue)}</span>`);
    }
    $$renderer2.push(`<!--]--></div> `);
    Dropdown($$renderer2, spread_props([
      dropdownOptions(),
      {
        oncancel,
        children: ($$renderer3) => {
          $$renderer3.push(`<div>`);
          Calendar($$renderer3, {
            value,
            onchange: updateValue,
            buttons: editor.config?.buttons
          });
          $$renderer3.push(`<!----></div>`);
        },
        $$slots: { default: true }
      }
    ]));
    $$renderer2.push(`<!---->`);
  });
}
function Richselect($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { editor, onaction, onsave, onapply, oncancel } = $$props;
    let data = editor.options.find((opt) => opt.id === editor.value);
    let tmp = editor, value = tmp.value, options = tmp.options;
    let tmp_1 = editor?.config || {}, template = tmp_1.template, cell = tmp_1.cell, dropdown = fallback(tmp_1.dropdown, () => ({}), true);
    const dropdownOptions = derived(() => ({ trackScroll: true, ...dropdown }));
    let index = derived(() => options.findIndex((a) => a.id === value));
    function updateValue({ id }) {
      onapply(id);
      onsave();
    }
    let navigate;
    function ready(ev) {
      navigate = ev.navigate;
      ev.keydown;
      navigate(index());
    }
    $$renderer2.push(`<div class="wx-value svelte-yuk812" tabindex="0">`);
    if (template) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`${escape_html(template(data))}`);
    } else if (cell) {
      $$renderer2.push("<!--[1-->");
      const SvelteComponent = cell;
      if (SvelteComponent) {
        $$renderer2.push("<!--[-->");
        SvelteComponent($$renderer2, { data, onaction });
        $$renderer2.push("<!--]-->");
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push("<!--]-->");
      }
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<span class="wx-text svelte-yuk812">${escape_html(editor.renderedValue)}</span>`);
    }
    $$renderer2.push(`<!--]--></div> `);
    {
      let children = function($$renderer3, { option }) {
        if (template) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`${escape_html(template(option))}`);
        } else if (cell) {
          $$renderer3.push("<!--[1-->");
          const SvelteComponent_1 = cell;
          if (SvelteComponent_1) {
            $$renderer3.push("<!--[-->");
            SvelteComponent_1($$renderer3, { data: option, onaction });
            $$renderer3.push("<!--]-->");
          } else {
            $$renderer3.push("<!--[!-->");
            $$renderer3.push("<!--]-->");
          }
        } else {
          $$renderer3.push("<!--[-1-->");
          $$renderer3.push(`${escape_html(option.label)}`);
        }
        $$renderer3.push(`<!--]-->`);
      };
      SuggestDropdown($$renderer2, spread_props([
        { items: options, onready: ready, onselect: updateValue },
        dropdownOptions(),
        { oncancel, children, $$slots: { default: true } }
      ]));
    }
    $$renderer2.push(`<!---->`);
  });
}
function MultiSelect($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { editor, onaction, onsave, onapply } = $$props;
    let tmp = editor, config = tmp.config;
    const options = derived(() => editor?.options ?? []);
    let value = derived(() => editor?.value || []);
    let renderedValue = derived(() => editor?.renderedValue);
    let index = derived(() => {
      const firstSelected = options().find((opt) => value().includes(opt.id));
      return firstSelected ? options().indexOf(firstSelected) : -1;
    });
    const dropdownOptions = derived(() => {
      const dropdown = config?.dropdown || {};
      return { trackScroll: true, ...dropdown };
    });
    function updateValue({ id }) {
      onapply(id);
      node.focus();
    }
    let navigate;
    function ready(ev) {
      navigate = ev.navigate;
      ev.keydown;
      navigate(index());
    }
    let node = void 0;
    $$renderer2.push(`<div class="wx-value svelte-h7rvwt" tabindex="0">`);
    if (config?.template) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`${escape_html(config.template(value()?.map((id) => options().find((opt) => opt.id === id))))}`);
    } else if (config?.cell) {
      $$renderer2.push("<!--[1-->");
      const SvelteComponent = config.cell;
      if (SvelteComponent) {
        $$renderer2.push("<!--[-->");
        SvelteComponent($$renderer2, {
          data: value().map((id) => options().find((opt) => opt.id === id))
        });
        $$renderer2.push("<!--]-->");
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push("<!--]-->");
      }
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<span class="wx-text svelte-h7rvwt">${escape_html(renderedValue())}</span>`);
    }
    $$renderer2.push(`<!--]--></div> `);
    {
      let children = function($$renderer3, { option }) {
        $$renderer3.push(`<div class="wx-option svelte-h7rvwt">`);
        if (config?.template) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`${escape_html(config.template(option))}`);
        } else if (config?.cell) {
          $$renderer3.push("<!--[1-->");
          const SvelteComponent = config.cell;
          if (SvelteComponent) {
            $$renderer3.push("<!--[-->");
            SvelteComponent($$renderer3, { data: option, onaction });
            $$renderer3.push("<!--]-->");
          } else {
            $$renderer3.push("<!--[!-->");
            $$renderer3.push("<!--]-->");
          }
        } else {
          $$renderer3.push("<!--[-1-->");
          $$renderer3.push(`${escape_html(option.label)}`);
        }
        $$renderer3.push(`<!--]--></div>`);
      };
      SuggestDropdown($$renderer2, spread_props([
        {
          items: options(),
          onready: ready,
          onselect: updateValue,
          checkboxes: true,
          multiselect: true
        },
        dropdownOptions(),
        {
          oncancel: () => onsave(),
          value: value(),
          children,
          $$slots: { default: true }
        }
      ]));
    }
    $$renderer2.push(`<!---->`);
  });
}
const editors = {
  text: Text,
  combo: Combo,
  datepicker: Datepicker,
  richselect: Richselect,
  multiselect: MultiSelect
};
function Editor($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { column, row } = $$props;
    const api = getContext("grid-store");
    const { editor } = api.getReactiveState();
    function save(ignoreFocus) {
      const cell = ignoreFocus ? null : {
        row: store_get($$store_subs ??= {}, "$editor", editor).id,
        column: store_get($$store_subs ??= {}, "$editor", editor).column
      };
      closeEditor(false, cell);
    }
    function cancel() {
      closeEditor(true, {
        row: store_get($$store_subs ??= {}, "$editor", editor).id,
        column: store_get($$store_subs ??= {}, "$editor", editor).column
      });
    }
    function updateValue(value) {
      api.exec("editor", { value });
    }
    function closeEditor(ignore, cell) {
      api.exec("close-editor", { ignore });
      if (cell) {
        api.exec("focus-cell", { ...cell, eventSource: "click" });
      }
    }
    let style = derived(() => getStyle(column.width, column.flexgrow, column.fixed, column.left, column.right));
    const SvelteComponent = derived(() => {
      let editor2 = column.editor;
      if (typeof editor2 === "function") editor2 = editor2(row, column);
      let type = typeof editor2 === "string" ? editor2 : editor2.type;
      return editors[type];
    });
    $$renderer2.push(`<div class="wx-cell wx-editor svelte-1s22xmv"${attr_style(style())}${attr("role", typeof row.$parent !== "undefined" ? "gridcell" : "cell")}${attr("aria-readonly", typeof row.$parent !== "undefined" ? column.editor ? false : true : void 0)} tabindex="-1">`);
    if (SvelteComponent()) {
      $$renderer2.push("<!--[-->");
      SvelteComponent()($$renderer2, {
        editor: store_get($$store_subs ??= {}, "$editor", editor),
        onsave: save,
        onapply: updateValue,
        oncancel: cancel,
        onaction: ({ action, data }) => api.exec(action, data)
      });
      $$renderer2.push("<!--]-->");
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push("<!--]-->");
    }
    $$renderer2.push(`</div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function HeaderFooter($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { columns, type, columnStyle } = $$props;
    const api = getContext("grid-store");
    const { filterValues, _columns, _sizes: sizes } = api.getState();
    function getColumnCss(column) {
      return columnStyle ? " " + columnStyle(column) : "";
    }
    $$renderer2.push(`<!--[-->`);
    const each_array = ensure_array_like(columns);
    for (let i = 0, $$length = each_array.length; i < $$length; i++) {
      let row = each_array[i];
      $$renderer2.push(`<tr><!--[-->`);
      const each_array_1 = ensure_array_like(row);
      for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
        let cell = each_array_1[$$index];
        const column = _columns.find((c) => c.id === cell.id);
        $$renderer2.push(`<th${attr_style(getPrintCellStyle(cell, sizes.columnWidth))}${attr_class(`wx-print-cell-${stringify(type)} ${stringify(getColumnCss(column))}`, void 0, {
          "wx-print-cell-filter": cell.filter,
          "wx-vertical": cell.vertical
        })}${attr("rowspan", cell.rowspan)}${attr("colspan", cell.colspan)}>`);
        if (cell.cell) {
          $$renderer2.push("<!--[0-->");
          if (cell.cell) {
            $$renderer2.push("<!--[-->");
            cell.cell($$renderer2, {
              api,
              cell: Object.fromEntries(Object.entries(cell).filter(([key]) => key !== "cell")),
              column,
              row: i
            });
            $$renderer2.push("<!--]-->");
          } else {
            $$renderer2.push("<!--[!-->");
            $$renderer2.push("<!--]-->");
          }
        } else if (cell.filter) {
          $$renderer2.push("<!--[1-->");
          $$renderer2.push(`<div class="wx-print-filter">${escape_html(getPrintFilterValue(filterValues, _columns, cell))}</div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<div class="wx-text">${escape_html(cell.text ?? "")}</div>`);
        }
        $$renderer2.push(`<!--]--></th>`);
      }
      $$renderer2.push(`<!--]--></tr>`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function Grid$1($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      columns,
      rowStyle,
      columnStyle,
      cellStyle,
      header,
      footer,
      reorder
    } = $$props;
    const api = getContext("grid-store");
    const { flatData: data, _sizes: sizes } = api.getState();
    const headerColumns = header && getHeaderFooterPrintColumns(columns, "header", sizes.headerRowHeights);
    const footerColumns = footer && getHeaderFooterPrintColumns(columns, "footer", sizes.footerRowHeights);
    function buildCellCss(row, column) {
      let css = "";
      css += columnStyle ? " " + columnStyle(column) : "";
      css += cellStyle ? " " + cellStyle(row, column) : "";
      return css;
    }
    function isDraggableIcon(row, column) {
      return typeof column.draggable === "function" ? column.draggable(row, column) !== false : column.draggable;
    }
    $$renderer2.push(`<table${attr_class("wx-print-grid svelte-bya5aa", void 0, { "wx-flex-columns": columns.some((c) => c.flexgrow) })}>`);
    if (header) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<thead>`);
      HeaderFooter($$renderer2, { columns: headerColumns, type: "header", columnStyle });
      $$renderer2.push(`<!----></thead>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--><tbody><!--[-->`);
    const each_array = ensure_array_like(data);
    for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
      let row = each_array[$$index_1];
      $$renderer2.push(`<tr${attr_class("wx-row" + (rowStyle ? " " + rowStyle(row) : ""), "svelte-bya5aa")}${attr_style(`height:${row.rowHeight || sizes.rowHeight}px;`)}><!--[-->`);
      const each_array_1 = ensure_array_like(columns);
      for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
        let column = each_array_1[$$index];
        if (!column.collapsed) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<td${attr_class(`wx-print-cell wx-cell ${stringify(buildCellCss(row, column))}`, "svelte-bya5aa")}${attr_style(getPrintCellStyle(column, sizes.columnWidth))}>`);
          if (reorder && column.draggable) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<span class="wx-print-draggable">`);
            if (isDraggableIcon(row, column)) {
              $$renderer2.push("<!--[0-->");
              $$renderer2.push(`<i class="wxi-drag"></i>`);
            } else {
              $$renderer2.push("<!--[-1-->");
            }
            $$renderer2.push(`<!--]--></span>`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--> `);
          if (column.treetoggle) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<span${attr_style(`margin-left:${stringify(row.$level * 28)}px;`)}></span> `);
            if (row.$count) {
              $$renderer2.push("<!--[0-->");
              $$renderer2.push(`<i${attr_class(`wx-print-grid-tree-toggle wxi-menu-${stringify(row.open !== false ? "down" : "right")}`)}></i>`);
            } else {
              $$renderer2.push("<!--[-1-->");
            }
            $$renderer2.push(`<!--]-->`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--> `);
          if (column.cell) {
            $$renderer2.push("<!--[0-->");
            if (column.cell) {
              $$renderer2.push("<!--[-->");
              column.cell($$renderer2, { api, row, column });
              $$renderer2.push("<!--]-->");
            } else {
              $$renderer2.push("<!--[!-->");
              $$renderer2.push("<!--]-->");
            }
          } else {
            $$renderer2.push("<!--[-1-->");
            $$renderer2.push(`<span>${escape_html(getRenderValue(row, column))}</span>`);
          }
          $$renderer2.push(`<!--]--></td>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></tr>`);
    }
    $$renderer2.push(`<!--]--></tbody>`);
    if (footer) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<tfoot>`);
      HeaderFooter($$renderer2, { columns: footerColumns, type: "footer", columnStyle });
      $$renderer2.push(`<!----></tfoot>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></table>`);
  });
}
function Print($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { config, $$slots, $$events, ...restProps } = $$props;
    const api = getContext("grid-store");
    const { _skin: skin, _columns: columns } = api.getState();
    let grids = getPrintColumns(columns, config);
    $$renderer2.push(`<div${attr_class(`wx-${stringify(skin)}-theme wx-print-container`)}><!--[-->`);
    const each_array = ensure_array_like(grids);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let cols = each_array[$$index];
      $$renderer2.push(`<div class="wx-print-grid-wrapper">`);
      Grid$1($$renderer2, spread_props([{ columns: cols }, restProps]));
      $$renderer2.push(`<!----></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
function Layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let {
      header,
      footer,
      overlay,
      multiselect,
      rowStyle,
      columnStyle,
      cellStyle,
      autoRowHeight,
      clientWidth,
      clientHeight
    } = $$props;
    const api = getContext("grid-store");
    const {
      dynamic,
      _columns,
      flatData: data,
      split,
      _sizes,
      selectedRows,
      select,
      editor,
      scroll,
      tree,
      focusCell,
      _print,
      undo,
      reorder,
      _rowHeightFromData
    } = api.getReactiveState();
    let SCROLLSIZE = 0;
    let scrollLeft = 0;
    let scrollTop = 0;
    const hasAny = derived(() => {
      return store_get($$store_subs ??= {}, "$_columns", _columns).some((col) => !col.hidden && col.flexgrow);
    });
    const defaultRowHeight = derived(() => store_get($$store_subs ??= {}, "$_sizes", _sizes).rowHeight);
    let dragItem = null;
    const fullHeight = derived(() => {
      const count = store_get($$store_subs ??= {}, "$dynamic", dynamic) ? store_get($$store_subs ??= {}, "$dynamic", dynamic).rowCount : store_get($$store_subs ??= {}, "$data", data).length;
      if (autoRowHeight) {
        return renderedHeight + // $inspect(fullWidth, "fullWidth");
        // mark split left columns
        // mark split right columns
        // $inspect(leftColumns, "leftColumns");
        // get visible columns
        // header and footer cells correction depending on colSpans
        // include visible header/footer spans
        // $inspect(renderColumns, "renderColumns");
        // $inspect(contentWidth, "contentWidth");
        // set global width
        // if we have flexible columns
        // then ignore the fullWidth as it doesn't include flex columns and has no meaning in this context
        // $inspect(globalWidth, "globalWidth");
        // hom many rows visible
        // request data if necessary
        renderRows().d + (count - renderEnd) * defaultRowHeight();
      }
      if (!store_get($$store_subs ??= {}, "$_rowHeightFromData", _rowHeightFromData)) {
        return count * defaultRowHeight();
      }
      let totalHeight = 0;
      for (let i = 0; i < count; i++) totalHeight += store_get($$store_subs ??= {}, "$data", data)[i].rowHeight || defaultRowHeight();
      return totalHeight;
    });
    const fullWidth = derived(() => store_get($$store_subs ??= {}, "$_columns", _columns).reduce(
      (acc, col) => {
        if (!col.hidden) {
          acc += col.width;
        }
        return acc;
      },
      0
    ));
    const leftColumns = derived(() => {
      let columns = [];
      let width = 0;
      if (store_get($$store_subs ??= {}, "$split", split).left) {
        columns = store_get($$store_subs ??= {}, "$_columns", _columns).slice(0, store_get($$store_subs ??= {}, "$split", split).left).filter((c) => !c.hidden).map((a) => ({ ...a }));
        columns.forEach((a) => {
          a.fixed = {
            left: 1,
            leftSize: store_get($$store_subs ??= {}, "$split", split).left
          };
          a.left = width;
          width += a.width;
        });
        if (columns.length) columns[columns.length - 1].fixed.left = -1;
      }
      return { columns, width };
    });
    const rightColumns = derived(() => {
      let columns = [];
      let width = 0;
      if (store_get($$store_subs ??= {}, "$split", split).right) {
        columns = store_get($$store_subs ??= {}, "$_columns", _columns).slice(store_get($$store_subs ??= {}, "$split", split).right * -1).filter((c) => !c.hidden).map((a) => ({ ...a }));
        for (let i = columns.length - 1; i >= 0; i--) {
          const col = columns[i];
          col.fixed = { right: 1 };
          col.right = width;
          width += col.width;
        }
        if (columns.length) columns[0].fixed = { right: -1 };
      }
      return { columns, width };
    });
    const centerColumns = derived(() => {
      const center = store_get($$store_subs ??= {}, "$_columns", _columns).slice(store_get($$store_subs ??= {}, "$split", split).left, store_get($$store_subs ??= {}, "$_columns", _columns).length - (store_get($$store_subs ??= {}, "$split", split).right ?? 0)).filter((c) => !c.hidden);
      center.forEach((a) => {
        a.fixed = 0;
      });
      return center;
    });
    const EXTRACOLUMNS = 1;
    const renderColumns = derived(() => {
      let data2, header2, footer2;
      const left = scrollLeft;
      const right = scrollLeft + clientWidth;
      let start = 0;
      let end = 0;
      let sum = 0;
      let d = 0;
      centerColumns().forEach((col, index) => {
        if (left > sum) {
          start = index;
          d = sum;
        }
        sum = sum + col.width;
        if (right > sum) end = index + EXTRACOLUMNS;
      });
      const rightSpanDelta = { header: 0, footer: 0 };
      for (let i = end; i >= start; i--) {
        ["header", "footer"].forEach((key) => {
          if (centerColumns()[i]) centerColumns()[i][key].forEach((hCell) => {
            const colspan = hCell.colspan;
            if (colspan && colspan > 1) {
              const diff = colspan - (end - i + 1);
              if (diff > 0) {
                rightSpanDelta[key] = Math.max(rightSpanDelta[key], diff);
              }
            }
          });
        });
      }
      const headerPos = getHeaderPosition(start, d, "header");
      const footerPos = getHeaderPosition(start, d, "footer");
      const dh = headerPos.delta;
      const csH = headerPos.index;
      const df = footerPos.delta;
      const csF = footerPos.index;
      if (hasAny() && fullWidth() > clientWidth) {
        data2 = header2 = footer2 = [
          ...leftColumns().columns,
          ...centerColumns(),
          ...rightColumns().columns
        ];
      } else {
        data2 = [
          ...leftColumns().columns,
          ...centerColumns().slice(start, end + 1),
          ...rightColumns().columns
        ];
        header2 = [
          ...leftColumns().columns,
          ...centerColumns().slice(csH, end + rightSpanDelta.header + 1),
          ...rightColumns().columns
        ];
        footer2 = [
          ...leftColumns().columns,
          ...centerColumns().slice(csF, end + rightSpanDelta.footer + 1),
          ...rightColumns().columns
        ];
      }
      return { data: data2, header: header2, footer: footer2, d, df, dh };
    });
    const contentWidth = derived(() => hasAny() && fullWidth() <= clientWidth ? clientWidth - // $inspect(contentWidth, "contentWidth");
    (hasVScroll() ? SCROLLSIZE : 0) : fullWidth());
    const headerHeight = derived(() => header ? store_get($$store_subs ??= {}, "$_sizes", _sizes).headerHeight : 0);
    const footerHeight = derived(() => footer ? store_get($$store_subs ??= {}, "$_sizes", _sizes).footerHeight : 0);
    const hasVScroll = derived(() => clientWidth && clientHeight ? fullHeight() + headerHeight() + footerHeight() >= clientHeight - (fullWidth() >= clientWidth ? SCROLLSIZE : 0) : false);
    const hasHScroll = derived(() => clientWidth && clientHeight ? fullWidth() >= clientWidth : false);
    const globalWidth = derived(() => hasAny() && fullWidth() <= clientWidth ? clientWidth : contentWidth() < clientWidth ? fullWidth() + (hasVScroll() ? SCROLLSIZE : 0) : -1);
    const visibleRowsHeight = derived(() => clientHeight - headerHeight() - footerHeight() - (hasHScroll() ? SCROLLSIZE : 0));
    const visibleRows = derived(() => Math.ceil(visibleRowsHeight() / defaultRowHeight()) + 1);
    const EXTRAROWS = 2;
    const renderRows = derived(() => {
      let start = 0, deltaTop = 0;
      if (autoRowHeight) {
        let st = scrollTop;
        while (st > 0) {
          st -= rowHeights[start] || defaultRowHeight();
          start++;
        }
        deltaTop = scrollTop - st;
        for (let i = Math.max(0, start - EXTRAROWS - 1); i < start; i++) deltaTop -= rowHeights[start - i] || defaultRowHeight();
        start = Math.max(0, start - EXTRAROWS);
      } else {
        if (store_get($$store_subs ??= {}, "$_rowHeightFromData", _rowHeightFromData)) {
          let startInd = 0;
          let topHeight = 0;
          for (let i = 0; i < store_get($$store_subs ??= {}, "$data", data).length; i++) {
            const height = store_get($$store_subs ??= {}, "$data", data)[i].rowHeight || defaultRowHeight();
            if (topHeight + height > scrollTop) {
              startInd = i;
              break;
            }
            topHeight += height;
          }
          start = Math.max(0, startInd - EXTRAROWS);
          for (let i = 0; i < start; i++) {
            deltaTop += store_get($$store_subs ??= {}, "$data", data)[i].rowHeight || defaultRowHeight();
          }
          let visibleRowsCount = 0;
          let currentHeight = 0;
          for (let i = startInd + 1; i < store_get($$store_subs ??= {}, "$data", data).length; i++) {
            const height = store_get($$store_subs ??= {}, "$data", data)[i].rowHeight || defaultRowHeight();
            visibleRowsCount++;
            if (currentHeight + height > visibleRowsHeight()) {
              break;
            }
            currentHeight += height;
          }
          const end2 = Math.min(
            store_get($$store_subs ??= {}, "$dynamic", dynamic) ? store_get($$store_subs ??= {}, "$dynamic", dynamic).rowCount : store_get($$store_subs ??= {}, "$data", data).length,
            startInd + visibleRowsCount + EXTRAROWS
          );
          return { d: deltaTop, start, end: end2 };
        }
        start = Math.floor(scrollTop / defaultRowHeight());
        start = Math.max(0, start - EXTRAROWS);
        deltaTop = start * defaultRowHeight();
      }
      const end = Math.min(
        store_get($$store_subs ??= {}, "$dynamic", dynamic) ? store_get($$store_subs ??= {}, "$dynamic", dynamic).rowCount : store_get($$store_subs ??= {}, "$data", data).length,
        start + visibleRows() + EXTRAROWS
      );
      return { d: deltaTop, start, end };
    });
    const dataRows = derived(() => {
      if (store_get($$store_subs ??= {}, "$dynamic", dynamic)) return store_get($$store_subs ??= {}, "$data", data);
      else {
        return store_get($$store_subs ??= {}, "$data", data).slice(renderRows().start, renderRows().end);
      }
    });
    let renderEnd = void 0;
    function getHeaderPosition(start, deltaLeft, type) {
      let delta = deltaLeft;
      let index = start;
      if (centerColumns().length) {
        let spanStartInd = centerColumns().length;
        for (let i = start; i >= 0; i--) {
          const colHeader = centerColumns()[i][type];
          colHeader.forEach((h) => {
            if (h.colspan > 1 && i > start - h.colspan && i < spanStartInd) {
              spanStartInd = i;
            }
          });
        }
        if (spanStartInd !== centerColumns().length && spanStartInd < start) {
          for (let i = spanStartInd; i < start; i++) {
            delta -= centerColumns()[i].width;
          }
          index = spanStartInd;
        }
      }
      return { index, delta };
    }
    const style = derived(() => globalWidth() > 0 ? `width:${globalWidth()}px;` : "");
    let rowHeights = [];
    let renderedHeight = 0;
    let focus = void 0;
    $$renderer2.push(`<div${attr_class(`wx-grid ${""}`, "svelte-8dfq38")}${attr_style(`--header-height:${stringify(headerHeight())}px; --footer-height:${stringify(footerHeight())}px;--split-left-width:${stringify(leftColumns().width)}px; --split-right-width:${stringify(rightColumns().width)}px;`)}><div class="wx-table-box svelte-8dfq38"${attr_style(style())}${attr("role", store_get($$store_subs ??= {}, "$tree", tree) ? "treegrid" : "grid")}${attr("aria-colcount", renderColumns().data.length)}${attr("aria-rowcount", dataRows().length)}${attr("aria-multiselectable", store_get($$store_subs ??= {}, "$tree", tree) && multiselect ? true : void 0)}><div class="wx-scroll svelte-8dfq38"${attr_style(`overflow-x:${stringify(hasHScroll() ? "scroll" : "hidden")};overflow-y:${stringify(hasVScroll() ? "scroll" : "hidden")};`)}>`);
    if (header) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="wx-header-wrapper svelte-8dfq38">`);
      HeaderFooter$1($$renderer2, {
        contentWidth: contentWidth(),
        deltaLeft: renderColumns().dh,
        columns: renderColumns().header,
        columnStyle,
        bodyHeight: visibleRowsHeight() - +footer
      });
      $$renderer2.push(`<!----></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="wx-body svelte-8dfq38"${attr_style(`width:${stringify(contentWidth())}px;height:${stringify(fullHeight())}px;`)}>`);
    if (overlay) {
      $$renderer2.push("<!--[0-->");
      Overlay($$renderer2, { overlay });
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="wx-data svelte-8dfq38"${attr_style(`padding-top:${stringify(renderRows().d)}px;padding-left:${stringify(renderColumns().d)}px;`)}><!--[-->`);
    const each_array = ensure_array_like(dataRows());
    for (let rIndex = 0, $$length = each_array.length; rIndex < $$length; rIndex++) {
      let row = each_array[rIndex];
      const isSelected = store_get($$store_subs ??= {}, "$selectedRows", selectedRows).indexOf(row.id) !== -1;
      $$renderer2.push(`<div${attr_class("wx-row" + (rowStyle ? " " + rowStyle(row) : ""), "svelte-8dfq38", {
        "wx-autoheight": autoRowHeight,
        "wx-selected": isSelected,
        "wx-inactive": dragItem === row.id
      })}${attr("data-id", setID(row.id))}${attr("data-context-id", setID(row.id))}${attr_style(`${autoRowHeight ? "min-height" : "height"}:${row.rowHeight || defaultRowHeight()}px;`)} role="row"${attr("aria-rowindex", rIndex)}${attr("aria-expanded", row.open)}${attr("aria-level", store_get($$store_subs ??= {}, "$tree", tree) ? row.$level + 1 : void 0)}${attr("aria-selected", store_get($$store_subs ??= {}, "$tree", tree) ? isSelected : void 0)} tabindex="-1"><!--[-->`);
      const each_array_1 = ensure_array_like(renderColumns().data);
      for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
        let column = each_array_1[$$index];
        if (column.collapsed) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div class="wx-cell wx-collapsed svelte-8dfq38"></div>`);
        } else if (store_get($$store_subs ??= {}, "$editor", editor)?.id === row.id && store_get($$store_subs ??= {}, "$editor", editor).column === column.id) {
          $$renderer2.push("<!--[1-->");
          Editor($$renderer2, { row, column });
        } else {
          $$renderer2.push("<!--[-1-->");
          Cell($$renderer2, {
            row,
            column,
            columnStyle,
            cellStyle,
            focusable: focus?.row === row.id && focus?.column === column.id
          });
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div></div> `);
    if (footer && store_get($$store_subs ??= {}, "$data", data).length) {
      $$renderer2.push("<!--[0-->");
      HeaderFooter$1($$renderer2, {
        type: "footer",
        contentWidth: contentWidth(),
        deltaLeft: renderColumns().df,
        columns: renderColumns().footer,
        columnStyle
      });
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div></div> `);
    if (store_get($$store_subs ??= {}, "$_print", _print)) {
      $$renderer2.push("<!--[0-->");
      Print($$renderer2, {
        config: store_get($$store_subs ??= {}, "$_print", _print),
        rowStyle,
        columnStyle,
        cellStyle,
        header,
        footer,
        reorder
      });
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function Grid($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      data = [],
      columns = [],
      rowStyle = null,
      columnStyle = null,
      cellStyle = null,
      selectedRows = [],
      select = true,
      multiselect = false,
      header = true,
      footer = false,
      dynamic = null,
      overlay = null,
      reorder = false,
      onreorder = null,
      autoRowHeight = false,
      sizes = {},
      split = { left: 0 },
      tree = false,
      autoConfig = false,
      init = null,
      responsive = null,
      sortMarks = {},
      undo = false,
      hotkeys = null,
      filterValues = {},
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    let clientWidth = 0;
    let clientHeight = 0;
    const dataStore = new DataStore(writable);
    let firstInRoute = dataStore.in;
    const dash = /-/g;
    let lastInRoute = new EventBusRouter((a, b) => {
      const name = "on" + a.replace(dash, "");
      if (restProps[name]) {
        restProps[name](b);
      }
    });
    firstInRoute.setNext(lastInRoute);
    const getState = dataStore.getState.bind(dataStore);
    const getReactiveState = dataStore.getReactive.bind(dataStore);
    const getStores = () => ({ data: dataStore });
    const exec = firstInRoute.exec;
    const setNext = (ev) => lastInRoute = lastInRoute.setNext(ev);
    const intercept = firstInRoute.intercept.bind(firstInRoute);
    const on = firstInRoute.on.bind(firstInRoute);
    const detach = firstInRoute.detach.bind(firstInRoute);
    const getRow = (id) => dataStore.getRow(id);
    const getColumn = (id) => dataStore.getColumn(id);
    const api = {
      exec,
      setNext,
      intercept,
      on,
      detach,
      getRow,
      getColumn,
      getState,
      getReactiveState,
      getStores
    };
    setContext("grid-store", {
      getState: dataStore.getState.bind(dataStore),
      getReactiveState: dataStore.getReactive.bind(dataStore),
      exec: firstInRoute.exec.bind(firstInRoute),
      getRow: dataStore.getRow.bind(dataStore),
      getRowIndex: dataStore.getRowIndex.bind(dataStore)
    });
    const finalColumns = derived(() => {
      if (autoConfig && !columns.length && data.length) {
        const test = data[0];
        const autoCols = [];
        for (let key in test) {
          if (key !== "id" && key[0] !== "$") {
            let col = { id: key, header: key[0].toUpperCase() + key.slice(1) };
            if (typeof autoConfig === "object") {
              col = { ...col, ...autoConfig };
            }
            autoCols.push(col);
          }
        }
        return autoCols;
      }
      return columns;
    });
    const finalSizes = derived(() => sizes);
    let _skin = derived(() => getContext("wx-theme"));
    let init_once = true;
    const reinitStore = () => {
      dataStore.init({
        data,
        columns: finalColumns(),
        split,
        sizes: finalSizes(),
        selectedRows,
        dynamic,
        tree,
        sortMarks,
        filterValues,
        select,
        undo,
        reorder,
        _skin: _skin()
      });
      if (init_once && init) {
        init(api);
        init_once = false;
      }
    };
    reinitStore();
    Locale($$renderer2, {
      words: en$1,
      optional: true,
      children: ($$renderer3) => {
        Layout($$renderer3, {
          header,
          footer,
          overlay,
          rowStyle,
          columnStyle,
          cellStyle,
          multiselect,
          autoRowHeight,
          clientWidth,
          clientHeight
        });
      }
    });
    bind_props($$props, {
      getState,
      getReactiveState,
      getStores,
      exec,
      setNext,
      intercept,
      on,
      detach,
      getRow,
      getColumn
    });
  });
}
const handlers = {};
function registerToolbarItem(type, handler) {
  handlers[type] = handler;
}
function Separator($$renderer, $$props) {
  let { menu = false } = $$props;
  $$renderer.push(`<div${attr_class(`wx-separator${stringify(menu ? "-menu" : "")}`, "svelte-w50src")}> </div>`);
}
function Spacer($$renderer) {
  $$renderer.push(`<div class="wx-spacer svelte-1r1sef1"></div>`);
}
function Button_1($$renderer, $$props) {
  let { icon, text = "", css, type, disabled, menu, onclick } = $$props;
  if (menu) {
    $$renderer.push("<!--[0-->");
    $$renderer.push(`<div class="wx-item svelte-1vxsn1"><i${attr_class(`${stringify(icon || "wxi-empty")} ${stringify(css || "")}`, "svelte-1vxsn1")}></i> ${escape_html(text)}</div>`);
  } else {
    $$renderer.push("<!--[-1-->");
    Button$1($$renderer, { icon, type, css, text, disabled, onclick });
  }
  $$renderer.push(`<!--]-->`);
}
function Label($$renderer, $$props) {
  const { text, value, children } = $$props;
  if (children) {
    $$renderer.push("<!--[0-->");
    $$renderer.push(`<div class="wx-label svelte-d406cr">`);
    children($$renderer);
    $$renderer.push(`<!----></div>`);
  } else {
    $$renderer.push("<!--[-1-->");
    $$renderer.push(`<div class="wx-label svelte-d406cr">${escape_html(value || text)}</div>`);
  }
  $$renderer.push(`<!--]-->`);
}
function Icon($$renderer, $$props) {
  let { icon, text, css, type, disabled, menu, onclick } = $$props;
  if (menu) {
    $$renderer.push("<!--[0-->");
    $$renderer.push(`<div class="wx-item svelte-6wnwmw">`);
    if (icon) {
      $$renderer.push("<!--[0-->");
      $$renderer.push(`<i${attr_class(`${stringify(icon)} ${stringify(css)}`, "svelte-6wnwmw")}></i>`);
    } else {
      $$renderer.push("<!--[-1-->");
    }
    $$renderer.push(`<!--]--> ${escape_html(text)}</div>`);
  } else {
    $$renderer.push("<!--[-1-->");
    Button$1($$renderer, { icon, type, css, title: text, disabled, onclick });
  }
  $$renderer.push(`<!--]-->`);
}
function Item($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { id = "", text = "", css = "", icon = "", onclick } = $$props;
    $$renderer2.push(`<div${attr_class(`wx-label ${stringify(css)}`, "svelte-1bmfqx2")}>`);
    if (icon) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<i${attr_class(clsx(icon), "svelte-1bmfqx2")}></i>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> ${escape_html(text)}</div>`);
  });
}
registerToolbarItem("button", Button_1);
registerToolbarItem("separator", Separator);
registerToolbarItem("spacer", Spacer);
registerToolbarItem("label", Label);
registerToolbarItem("item", Item);
registerToolbarItem("icon", Icon);
function Willow_1($$renderer, $$props) {
  let { fonts = true, children } = $$props;
  if (children) {
    $$renderer.push("<!--[0-->");
    Willow($$renderer, {
      fonts,
      children: ($$renderer2) => {
        children($$renderer2);
        $$renderer2.push(`<!---->`);
      }
    });
  } else {
    $$renderer.push("<!--[-1-->");
    Willow($$renderer, { fonts });
  }
  $$renderer.push(`<!--]-->`);
}
setEnv(env);
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let rows = scorecards;
    let searchTerm = "";
    let bandFilter = "";
    let sectorFilter = "";
    let sizeFilter = "";
    const bandOptions = [
      { value: "", label: "All bands" },
      { value: "low", label: "Low" },
      { value: "borderline", label: "Borderline" },
      { value: "medium", label: "Medium" },
      { value: "high", label: "High" }
    ];
    const sectors = derived(() => Array.from(new Set(scorecards.map((r) => r.sector))).sort());
    const sizeOptions = [
      { value: "", label: "All sizes" },
      { value: "micro", label: "Micro" },
      { value: "small", label: "Small" },
      { value: "medium", label: "Medium" },
      { value: "large", label: "Large" },
      { value: "enterprise", label: "Enterprise" }
    ];
    const columns = [
      {
        id: "organizationName",
        header: "Organization",
        flexgrow: 1,
        sort: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        template: (value, row) => `<a href="/report/${row.id}" class="text-blue-600 hover:underline">${value}</a>`
      },
      { id: "sector", header: "Sector", width: 140, sort: true },
      { id: "sizeBand", header: "Size", width: 110, sort: true },
      {
        id: "respondentName",
        header: "Respondent",
        width: 180,
        sort: true
      },
      { id: "assessmentDate", header: "Date", width: 110, sort: true },
      {
        id: "scoreTotal",
        header: "Score",
        width: 90,
        sort: true,
        template: (v) => `${v} / 16`
      },
      {
        id: "manifestoSubtotal",
        header: "Mfst",
        width: 80,
        sort: true,
        template: (v) => `${v} / 4`
      },
      {
        id: "principlesSubtotal",
        header: "Prin",
        width: 80,
        sort: true,
        template: (v) => `${v} / 12`
      },
      { id: "computedBand", header: "Band", width: 110, sort: true },
      { id: "flagsCount", header: "Flags", width: 80, sort: true },
      {
        id: "recommendation",
        header: "Recommendation",
        flexgrow: 1,
        sort: true
      }
    ];
    const annotated = derived(() => rows.map((r) => ({
      ...r,
      flagsCount: r.flags.length,
      recommendation: bandToRecommendation(r.computedBand)
    })));
    function init(api) {
      api.exec("sort-rows", { key: "scoreTotal", order: "desc" });
    }
    $$renderer2.push(`<main class="max-w-7xl mx-auto px-4 py-6"><header class="flex items-baseline justify-between gap-3"><div><h1 class="text-2xl font-bold text-slate-800">Agile Consulting Scorecard — Reviewer Dashboard</h1> <p class="text-sm text-slate-600 mt-1">Aggregate view of submitted scorecards. Filter and sort to identify organizations ready
				to engage external agile consultants and those that should do their homework first.</p></div> <a href="/import" class="text-sm text-blue-600 whitespace-nowrap">Bulk import →</a></header> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="bg-white border border-slate-300 rounded p-3 mt-4 flex flex-wrap gap-3 items-end"><label class="flex flex-col text-xs text-slate-600">Band `);
    $$renderer2.select(
      {
        class: "mt-1 p-1.5 rounded border border-slate-300 text-sm",
        value: bandFilter
      },
      ($$renderer3) => {
        $$renderer3.push(`<!--[-->`);
        const each_array = ensure_array_like(bandOptions);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let opt = each_array[$$index];
          $$renderer3.option({ value: opt.value }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(opt.label)}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      }
    );
    $$renderer2.push(`</label> <label class="flex flex-col text-xs text-slate-600">Sector `);
    $$renderer2.select(
      {
        class: "mt-1 p-1.5 rounded border border-slate-300 text-sm",
        value: sectorFilter
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "" }, ($$renderer4) => {
          $$renderer4.push(`All sectors`);
        });
        $$renderer3.push(`<!--[-->`);
        const each_array_1 = ensure_array_like(sectors());
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let s = each_array_1[$$index_1];
          $$renderer3.option({ value: s }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(s)}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      }
    );
    $$renderer2.push(`</label> <label class="flex flex-col text-xs text-slate-600">Size `);
    $$renderer2.select(
      {
        class: "mt-1 p-1.5 rounded border border-slate-300 text-sm",
        value: sizeFilter
      },
      ($$renderer3) => {
        $$renderer3.push(`<!--[-->`);
        const each_array_2 = ensure_array_like(sizeOptions);
        for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
          let opt = each_array_2[$$index_2];
          $$renderer3.option({ value: opt.value }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(opt.label)}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      }
    );
    $$renderer2.push(`</label> <label class="flex flex-col text-xs text-slate-600">Search <input type="search" class="mt-1 p-1.5 rounded border border-slate-300 text-sm" placeholder="organization or respondent"${attr("value", searchTerm)}/></label> <button type="button" class="ml-auto px-3 py-1.5 rounded border border-slate-300 bg-white text-slate-700 text-sm">Reset</button></div> `);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-sm text-slate-500 mt-3">Loading from API… (showing bundled sample data)</p>`);
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="mt-4 bg-white rounded border border-slate-300 overflow-hidden">`);
    Willow_1($$renderer2, {
      children: ($$renderer3) => {
        Grid($$renderer3, { data: annotated(), columns, init });
      }
    });
    $$renderer2.push(`<!----></div></main>`);
  });
}
export {
  _page as default
};

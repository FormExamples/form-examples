# Range Fieldset

RangeFieldset is a two-thumb range: a span of values chosen with two sliders on one track, such as a price band, an age range or the hours a clinic is open. It renders a `<fieldset>` with a visible `<legend>` and two native `<input type="range">`, one for the minimum and one for the maximum. The thumbs cannot cross, each value is its own form field, and a form reset puts both back.

**Status:** experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow.

## Implementation Notes

- Renders `<fieldset class="range-fieldset">` with `<legend class="range-fieldset-legend">`, then `<input type="range" class="range-fieldset-minimum">` and `<input type="range" class="range-fieldset-maximum">`
- Both inputs have the same `min`, `max` and `step`, so a thumb's position means the same value on either input and the consumer's CSS can stack them over one track
- A thumb moved past the other stops where the other is: the lower value never exceeds the upper one
- Clamping, rather than changing each input's `min` and `max` as the other moves, keeps the two inputs on one scale; with different limits the same value would sit at different places on the two tracks
- Each input submits its own field (`minimumName`, `maximumName`); a form reset returns both to their first values
- HTML and Nunjucks render the markup; the clamp is the consumer's script, and without script the server takes the lower of the two as the minimum

## Props

- `legend`: string (required) — the visible name of the whole range ("Price")
- `minimumLabel`: string (required) — the lower thumb's name ("Lowest price")
- `maximumLabel`: string (required) — the upper thumb's name ("Highest price")
- `minimum`: number (default: `min`) — the lower value; two-way
- `maximum`: number (default: `max`) — the upper value; two-way
- `min`: number (default: 0) — the lowest value either thumb can take
- `max`: number (default: 100) — the highest value either thumb can take
- `step`: number (default: 1) — the increment of both thumbs
- `minimumName`: string (optional) — the form field name of the lower value
- `maximumName`: string (optional) — the form field name of the upper value
- `disabled`: boolean (default: false) — disables both thumbs
- `onchange`: (minimum, maximum) => void (optional) — called when either value changes
- `...restProps`: any — additional HTML attributes spread onto the `<fieldset>`

## Usage

Price filter:

```html
<RangeFieldset
  legend="Price"
  minimumLabel="Lowest price"
  maximumLabel="Highest price"
  minimum="{20}"
  maximum="{80}"
  minimumName="price-min"
  maximumName="price-max"
/>
```

Age range in a search form:

```html
<RangeFieldset
  legend="Age"
  minimumLabel="Youngest age"
  maximumLabel="Oldest age"
  min="{0}"
  max="{120}"
  minimum="{18}"
  maximum="{65}"
/>
```

## Keyboard Interactions

| Key                     | Action                                                                         |
| ----------------------- | ------------------------------------------------------------------------------ |
| Tab                     | Moves from the lower thumb to the upper thumb                                  |
| Left Arrow / Down Arrow | Decreases the focused thumb by one step                                        |
| Right Arrow / Up Arrow  | Increases the focused thumb by one step                                        |
| Home                    | Moves the focused thumb to its lowest value; the upper stops at the lower one  |
| End                     | Moves the focused thumb to its highest value; the lower stops at the upper one |
| Page Up / Page Down     | Moves the focused thumb by a larger step                                       |

## ARIA

- The `<legend>` names the group, announced with each thumb
- `aria-label` names each thumb in the consumer's words
- The native range inputs carry the slider role and announce their values; no ARIA slider is hand-built

## When to Use

- Use for a span of values with a known lowest and highest: a price band, an age range, a dose range, opening hours.
- Use when an approximate span is enough and a person benefits from seeing it on a track.
- Use as a search or filter control that submits both ends.

## When Not to Use

- Do not use for one value — use `range-input` or `slider`.
- Do not use for exact numbers a person already knows — use two `number-input` fields in a `fieldset`, which can be typed.
- Do not use for a span of dates — use `date-range` or the `calendar-range-picker`.

## Headless

This headless component ships zero CSS and decides nothing visual. The consumer provides all styling targeting the `.range-fieldset` class hook and its parts, and every word. Drawing the two inputs over one track, and the filled span between the thumbs, is the theme's or the consumer's CSS.

## Styles

`.range-fieldset`, `.range-fieldset-legend`, `.range-fieldset-minimum`, `.range-fieldset-maximum`.

## Testing

- The fieldset is named by its legend and holds two range inputs on one scale
- The lower thumb stops at the upper one, and the upper at the lower one
- Both values submit as their own form fields, and a form reset restores both

## Advice

- Show both values as text beside the track, in the consumer's number format, so nobody has to read them from the thumbs.
- Name each thumb for what it limits ("Lowest price"), not "Minimum", so a screen reader announces something useful out of context.
- Keep `step` coarse enough to reach every value by keyboard in a few presses; use Page Up and Page Down for large ranges.

## Related components

- `range-input` — one value on a track
- `slider` — one value, with a custom track
- `date-range` — a start and an end date
- `fieldset` — a group of related fields with a legend

## References

- WAI-ARIA APG, Multi-Thumb Slider: https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/
- MDN input type="range": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range
- Spec: spec/lessons/retool/index.md

---

Lily™ and Lily Design System™ are trademarks.

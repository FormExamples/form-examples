# UnitedStatesSocialSecurityNumberView

A headless read-only display component for showing a United States Social Security Number (SSN). Renders an inline `<span>` element with an accessible label and no built-in styling, so consumers provide all CSS. It is the View counterpart of `UnitedStatesSocialSecurityNumberInput` in the Input/View pattern.

## What it is

A passive, semantic display element for a US SSN value. It emits a `<span>` element whose accessible name is supplied by the consumer via `aria-label`. The component performs no formatting, masking, or validation — the consumer must pass a pre-formatted string such as `"123-45-6789"`.

## What it does

- Renders the SSN value as plain text inside an inline `<span>`.
- Sets `aria-label` from the `label` prop so screen readers announce the purpose.
- Applies the `united-states-social-security-number-view` base class plus any consumer `class` for styling hooks.
- Spreads any additional HTML attributes onto the `<span>`.

## When to use it

- Showing a stored SSN on an account summary, confirmation screen, or profile page.
- Displaying the SSN in a `SummaryList` key/value layout.
- Rendering the SSN as read-only output of an admin record view.

## When not to use it

- Collecting or editing an SSN — use `UnitedStatesSocialSecurityNumberInput` instead.
- Displaying an SSN in unmasked form without a legitimate authorized context — consumers should mask the value first (for example, `"***-**-6789"`).
- Displaying non-US identifiers — use the country-specific View component.

## How to use it

Import the component and pass the formatted `value` and an accessible `label`. Provide your own CSS and, where appropriate, your own redaction/masking of the value string before handing it in.

## Props

| Prop        | Type     | Default | Description                                                      |
| ----------- | -------- | ------- | ---------------------------------------------------------------- |
| `class`     | `string` | `""`    | Additional CSS class appended to the base class name.            |
| `label`     | `string` | —       | Required. Accessible name set on `aria-label`.                   |
| `value`     | `string` | `""`    | The SSN string to display (e.g., `"123-45-6789"`).               |
| `...rest`   | —        | —       | Any additional HTML attributes, spread onto the `<span>`.        |

## Usage

```svelte
<script lang="ts">
    import UnitedStatesSocialSecurityNumberView from "./UnitedStatesSocialSecurityNumberView.svelte";

    let ssn = $state("123-45-6789");
</script>

<UnitedStatesSocialSecurityNumberView
    label="Social Security Number"
    value={ssn}
/>
```

```svelte
<script lang="ts">
    import UnitedStatesSocialSecurityNumberView from "./UnitedStatesSocialSecurityNumberView.svelte";

    // Masked except last 4 digits for display.
    let stored = "123-45-6789";
    let masked = $derived(`***-**-${stored.slice(-4)}`);
</script>

<UnitedStatesSocialSecurityNumberView
    label="SSN (last 4 digits)"
    value={masked}
/>
```

```svelte
<script lang="ts">
    import UnitedStatesSocialSecurityNumberView from "./UnitedStatesSocialSecurityNumberView.svelte";
</script>

<dl>
    <dt>SSN</dt>
    <dd>
        <UnitedStatesSocialSecurityNumberView
            label="Social Security Number"
            value="123-45-6789"
        />
    </dd>
</dl>
```

```svelte
<script lang="ts">
    import UnitedStatesSocialSecurityNumberView from "./UnitedStatesSocialSecurityNumberView.svelte";
</script>

<UnitedStatesSocialSecurityNumberView
    class="ssn"
    label="SSN"
    value="123-45-6789"
    data-testid="ssn-view"
/>
```

## Accessibility

- Uses a semantic inline `<span>` that carries `aria-label` so assistive technologies announce the purpose of the value.
- Text content is the full value; consumers are responsible for masking or redacting sensitive digits before supplying `value`.
- No interactive behavior — this component does not take focus.
- Consumer CSS should maintain WCAG 2.2 AAA color contrast (7:1 for normal text).

## Related components

- `UnitedStatesSocialSecurityNumberInput` — the editable Input counterpart in the Input/View pattern.
- `EspanaTarjetaSanitariaIndividualView` — equivalent view for a Spain TSI identifier.
- `FranceNumeroDIdentificationAuRepertoireView` — equivalent view for a France NIR identifier.
- `IrelandIndividualHealthIdentifierView` — equivalent view for an Ireland IHI identifier.
- `UnitedKingdomNationalHealthServiceNumberView` — equivalent view for a UK NHS number.
- `SummaryList` / `SummaryListItem` — often used to group identifier views with labels.

---

Lily™ and Lily Design System™ are trademarks.

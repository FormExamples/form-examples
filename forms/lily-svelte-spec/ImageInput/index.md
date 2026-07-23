# ImageInput

A headless image submit button using the native HTML `<input type="image">` element. Displays an image that, when clicked inside a form, submits the form along with the click coordinates.

## What it is

A Svelte 5 thin wrapper around `<input type="image">` with required `src` and `alt`, plus optional `width`, `height`, and `disabled`. The `<input type="image">` element has an implicit button role and submits its enclosing form on activation.

## What it does

- Renders `<input class="image-input ..." type="image" src={src} alt={alt}>`.
- Passes through optional `width`, `height`, and `disabled`.
- Spreads any additional HTML attributes onto the `<input>`.

## When to use it

- Graphical submit buttons that must retain `<input type="image">` semantics (e.g. when the server depends on the `x`/`y` coordinates of the click).
- Image-based form controls where `<input type="submit">` styled with CSS is insufficient.
- Legacy image-map style form submission.

## When not to use it

- For normal form submission. Use `SubmitInput` or a `<button type="submit">`.
- For an image that is not a submit button. Use `Image`.
- For a file input that selects image files. Use `ImageFileInput`.
- For a button that copies text to clipboard. Use `ClipboardCopyButton`.

## How to use it

Place inside a `<form>`. Pass `src` and `alt`. Optionally set `width`, `height`, or `disabled`.

## Props

- `class` (string, optional) - CSS class appended after the base `image-input` class.
- `src` (string, required) - Image URL.
- `alt` (string, required) - Alternative text and accessible name.
- `width` (number, optional) - Image width in pixels.
- `height` (number, optional) - Image height in pixels.
- `disabled` (boolean, default `false`) - Whether the input is disabled.
- `...restProps` - Additional HTML attributes spread onto the `<input>`.

## Usage

```svelte
<script lang="ts">
    import ImageInput from "./ImageInput.svelte";
</script>

<form method="post">
    <ImageInput src="/submit.png" alt="Submit form" />
</form>
```

```svelte
<script lang="ts">
    import ImageInput from "./ImageInput.svelte";
</script>

<form>
    <ImageInput
        src="/icons/go.png"
        alt="Go"
        width={32}
        height={32}
    />
</form>
```

```svelte
<script lang="ts">
    import ImageInput from "./ImageInput.svelte";
    let formValid = $state(false);
</script>

<form>
    <label>Email <input type="email" oninput={(e) => (formValid = (e.target as HTMLInputElement).checkValidity())} /></label>
    <ImageInput src="/submit.png" alt="Submit" disabled={!formValid} />
</form>
```

```svelte
<script lang="ts">
    import Form from "../Form/Form.svelte";
    import ImageInput from "./ImageInput.svelte";
</script>

<Form label="Vote" onsubmit={() => console.log("voted")}>
    <input type="hidden" name="candidate" value="A" />
    <ImageInput
        src="/vote.png"
        alt="Cast vote"
        width={120}
        height={48}
    />
</Form>
```

```svelte
<script lang="ts">
    import ImageInput from "./ImageInput.svelte";
</script>

<form>
    <ImageInput
        src="/submit.svg"
        alt="Search"
        class="custom-submit"
        data-testid="search-submit"
        formmethod="get"
        formaction="/search"
    />
</form>
```

## Accessibility

- `alt` is the accessible name (required).
- The native `<input type="image">` has an implicit button role and supports Enter/Space activation via browser behaviour.
- `disabled` removes it from the Tab sequence and prevents activation.
- No extra ARIA attributes needed.

## Related components

- `SubmitInput` - `<input type="submit">` text-only submit button.
- `ButtonInput` - `<input type="button">` generic button input.
- `ResetInput` - `<input type="reset">` form reset button.
- `Button` - generic `<button>` component.
- `Image` - display-only image.
- `ImageFileInput` - file input restricted to images.

---

Lily™ and Lily Design System™ are trademarks.

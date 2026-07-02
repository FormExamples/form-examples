# AvatarText

The initials/text fallback inside an `Avatar`. Renders a `<span>` marked `aria-hidden="true"` — the parent `Avatar`'s `aria-label` is the single accessible name.

## What it is

A headless Svelte 5 component that outputs a single `<span>` tag. Category: identity-primitive child, must be used inside `Avatar`.

## What it does

- Renders `<span class="avatar-text {className}" aria-hidden="true">{children}</span>`.
- Displays short text (typically 1–3 initials) representing the user when no image is available.
- Spreads additional HTML attributes onto the `<span>`.

## When to use it

- Inside `Avatar` as a fallback when no profile photo exists.
- Inside `Avatar` alongside `AvatarImage` as a fallback when the image fails to load.
- For decorative short text representations of identity (emoji, glyph).

## When not to use it

- Outside `Avatar` — use a plain `<span>` or `Flair`.
- For decorative single characters — use `Character`.
- For a keyword label — use `Tag`.
- For a count or status pill — use `Badge`.

## How to use it

Import `AvatarText` from `./AvatarText.svelte`. Place inside an `Avatar`. Pass initials or short text via children.

## Props

- `class` — string, default `""`. CSS class appended to `avatar-text`.
- `children` — `Snippet`, required. Initials or short text (e.g. `"JD"`).
- `...restProps` — additional HTML attributes spread onto the `<span>`.

## Usage

### Initials

```svelte
<script lang="ts">
  import Avatar from '../Avatar/Avatar.svelte';
  import AvatarText from './AvatarText.svelte';
</script>

<Avatar alt="Jane Doe">
  <AvatarText>JD</AvatarText>
</Avatar>
```

### Single-character avatar

```svelte
<script lang="ts">
  import Avatar from '../Avatar/Avatar.svelte';
  import AvatarText from './AvatarText.svelte';
</script>

<Avatar alt="Anon">
  <AvatarText>A</AvatarText>
</Avatar>
```

### Emoji avatar

```svelte
<script lang="ts">
  import Avatar from '../Avatar/Avatar.svelte';
  import AvatarText from './AvatarText.svelte';
</script>

<Avatar alt="Support bot">
  <AvatarText>🤖</AvatarText>
</Avatar>
```

### Image with text fallback

```svelte
<script lang="ts">
  import Avatar from '../Avatar/Avatar.svelte';
  import AvatarImage from '../AvatarImage/AvatarImage.svelte';
  import AvatarText from './AvatarText.svelte';
</script>

<Avatar alt="Jane Doe">
  <AvatarImage src="/photos/jane.jpg" alt="Jane Doe" />
  <AvatarText>JD</AvatarText>
</Avatar>
```

### Dynamic initials from a name

```svelte
<script lang="ts">
  import Avatar from '../Avatar/Avatar.svelte';
  import AvatarText from './AvatarText.svelte';

  let name = $state('Ada Lovelace');
  let initials = $derived(
    name.split(' ').map((n) => n[0]).join('').toUpperCase()
  );
</script>

<Avatar alt={name}>
  <AvatarText>{initials}</AvatarText>
</Avatar>
```

## Accessibility

- Marked `aria-hidden="true"` to avoid duplicate announcements.
- The parent `Avatar`'s `aria-label` supplies the accessible name.
- Not interactive.

## Related components

- `Avatar` — required parent.
- `AvatarImage` — image sibling.
- `AvatarGroup` — stacked avatars.
- `Character`, `Flair` — small display-only text primitives.

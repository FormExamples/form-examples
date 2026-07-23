# AvatarImage

The image element inside an `Avatar` container. Renders a native `<img>` marked `aria-hidden="true"` so the parent `Avatar`'s `aria-label` provides the single accessible name.

## What it is

A headless Svelte 5 component that outputs a single `<img>` tag. Category: identity-primitive child, must be used inside `Avatar`.

## What it does

- Renders `<img class="avatar-image {className}" src alt aria-hidden="true">`.
- Defers accessible naming to the parent `Avatar` (which has `aria-label`).
- Spreads additional HTML attributes onto the `<img>`.

## When to use it

- Inside `Avatar` when you have a profile photo.
- As the primary visual inside the avatar; optionally paired with `AvatarText` as fallback.

## When not to use it

- Standalone outside `Avatar` — use `Image` or a plain `<img>` element.
- As a decorative icon — use `Icon`.
- For a feature photo with captioning/lazy loading — use `FeaturePhoto`.

## How to use it

Import `AvatarImage` from `./AvatarImage.svelte`. Always pass both `src` and `alt`. Place inside an `Avatar`.

## Props

- `class` — string, default `""`. CSS class appended to `avatar-image`.
- `src` — string, required. Image URL.
- `alt` — string, required. Alt text (kept for non-ARIA fallbacks and indexing, though the rendered `<img>` is `aria-hidden="true"`).
- `...restProps` — additional HTML attributes spread onto the `<img>`.

## Usage

### Basic avatar image

```svelte
<script lang="ts">
  import Avatar from '../Avatar/Avatar.svelte';
  import AvatarImage from './AvatarImage.svelte';
</script>

<Avatar alt="Jane Doe">
  <AvatarImage src="/photos/jane.jpg" alt="Jane Doe" />
</Avatar>
```

### With size attributes

```svelte
<script lang="ts">
  import Avatar from '../Avatar/Avatar.svelte';
  import AvatarImage from './AvatarImage.svelte';
</script>

<Avatar alt="Ada Lovelace">
  <AvatarImage src="/photos/ada.jpg" alt="Ada Lovelace" width="48" height="48" />
</Avatar>
```

### Lazy-loaded image

```svelte
<script lang="ts">
  import Avatar from '../Avatar/Avatar.svelte';
  import AvatarImage from './AvatarImage.svelte';
</script>

<Avatar alt="Team member">
  <AvatarImage src="/team/member.jpg" alt="Team member" loading="lazy" decoding="async" />
</Avatar>
```

### Fallback with AvatarText

```svelte
<script lang="ts">
  import Avatar from '../Avatar/Avatar.svelte';
  import AvatarImage from './AvatarImage.svelte';
  import AvatarText from '../AvatarText/AvatarText.svelte';
</script>

<Avatar alt="Jane Doe">
  <AvatarImage src="/photos/jane.jpg" alt="Jane Doe" />
  <AvatarText>JD</AvatarText>
</Avatar>
```

### Reactive src

```svelte
<script lang="ts">
  import Avatar from '../Avatar/Avatar.svelte';
  import AvatarImage from './AvatarImage.svelte';

  let src = $state('/photos/jane.jpg');
</script>

<Avatar alt="Jane Doe">
  <AvatarImage {src} alt="Jane Doe" />
</Avatar>
<button onclick={() => (src = '/photos/jane-alt.jpg')}>Swap photo</button>
```

## Accessibility

- Marked `aria-hidden="true"` to prevent duplicate announcements; the parent `Avatar` owns the accessible name.
- `alt` still passed for browsers, indexers, and situations where the image fails to load.
- No keyboard interaction.

## Related components

- `Avatar` — required parent.
- `AvatarText` — text/initials alternative or fallback.
- `AvatarGroup` — stacked avatars.
- `Image`, `FeaturePhoto` — standalone image components.

---

Lily™ and Lily Design System™ are trademarks.

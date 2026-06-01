# Avatar

A container that represents a person's identity as an image, initials, or both. Renders a `<span role="img">` with a required `aria-label`, inside which the consumer places `AvatarImage` and/or `AvatarText` children.

## What it is

A headless Svelte 5 compound component. Category: identity / person primitive, forming a small group with `AvatarImage`, `AvatarText`, and `AvatarGroup`. Related to `Person` as a higher-level semantic wrapper.

## What it does

- Renders `<span class="avatar {className}" role="img" aria-label={alt}>`.
- Treats the whole avatar as a single image for assistive tech (so child `AvatarImage`/`AvatarText` elements are marked `aria-hidden="true"`).
- Spreads additional HTML attributes onto the outer `<span>`.

## When to use it

- To display a user in a profile, comment, message, or contact list.
- When you need a compact identity indicator with image-fallback-to-initials.
- As a child of `AvatarGroup` for stacked-avatar UIs.

## When not to use it

- For a full person card with name and details — use `Person`.
- For a decorative image only — use `Image` or `FeaturePhoto`.
- For a single keyword or status label — use `Badge` or `Tag`.

## How to use it

Import `Avatar` from `./Avatar.svelte`. Always pass `alt` (the person's name). Place `AvatarImage`, `AvatarText`, or both as children.

## Props

- `class` — string, default `""`. CSS class appended to `avatar`.
- `alt` — string, required. Accessible name applied via `aria-label`.
- `children` — `Snippet`, required. `AvatarImage` and/or `AvatarText`.
- `...restProps` — additional HTML attributes spread onto the outer `<span>`.

## Usage

### Image avatar

```svelte
<script lang="ts">
  import Avatar from './Avatar.svelte';
  import AvatarImage from '../AvatarImage/AvatarImage.svelte';
</script>

<Avatar alt="Jane Doe">
  <AvatarImage src="/photos/jane.jpg" alt="Jane Doe" />
</Avatar>
```

### Initials avatar

```svelte
<script lang="ts">
  import Avatar from './Avatar.svelte';
  import AvatarText from '../AvatarText/AvatarText.svelte';
</script>

<Avatar alt="Jane Doe">
  <AvatarText>JD</AvatarText>
</Avatar>
```

### Image with initials fallback

```svelte
<script lang="ts">
  import Avatar from './Avatar.svelte';
  import AvatarImage from '../AvatarImage/AvatarImage.svelte';
  import AvatarText from '../AvatarText/AvatarText.svelte';
</script>

<Avatar alt="Jane Doe">
  <AvatarImage src="/photos/jane.jpg" alt="Jane Doe" />
  <AvatarText>JD</AvatarText>
</Avatar>
```

### List of avatars

```svelte
<script lang="ts">
  import Avatar from './Avatar.svelte';
  import AvatarImage from '../AvatarImage/AvatarImage.svelte';

  const users = [
    { name: 'Jane Doe', src: '/photos/jane.jpg' },
    { name: 'Ada Lovelace', src: '/photos/ada.jpg' }
  ];
</script>

<ul>
  {#each users as user}
    <li>
      <Avatar alt={user.name}>
        <AvatarImage src={user.src} alt={user.name} />
      </Avatar>
    </li>
  {/each}
</ul>
```

### As a link to a profile

```svelte
<script lang="ts">
  import Avatar from './Avatar.svelte';
  import AvatarText from '../AvatarText/AvatarText.svelte';
</script>

<a href="/users/jane">
  <Avatar alt="Jane Doe"><AvatarText>JD</AvatarText></Avatar>
</a>
```

## Accessibility

- `role="img"` consolidates children into a single announcement.
- `aria-label` supplies the accessible name.
- Children (`AvatarImage`, `AvatarText`) are `aria-hidden="true"` to avoid duplicate announcements.
- Not interactive; wrap in a link or button if it should be activatable.

## Related components

- `AvatarImage` — `<img>` child.
- `AvatarText` — initials/text `<span>` child.
- `AvatarGroup` — visually stacked group.
- `Person` — richer identity container.
- `Image`, `FeaturePhoto` — generic images.

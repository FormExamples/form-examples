<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TileMap from './TileMap.svelte';

  const { Story } = defineMeta({
    title: 'Headless/TileMap',
    component: TileMap,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{
    label: "Geographic tile map"
  }}
>
  <div role="img" aria-label="Tile map placeholder">[tile map goes here]</div>
</Story>

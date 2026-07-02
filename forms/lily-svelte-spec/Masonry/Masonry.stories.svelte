<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Masonry from './Masonry.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Masonry',
    component: Masonry,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{ columns: 3, gap: '1rem' }}
>
  <div>One</div>
  <div>Two</div>
  <div>Three</div>
  <div>Four</div>
</Story>

<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Grid from './Grid.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Grid',
    component: Grid,
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
</Story>

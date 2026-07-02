<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Pictogram from './Pictogram.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Pictogram',
    component: Pictogram,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{
    heading: 'Privacy',
    description: 'Your data stays yours.',
    layout: 'centered',
  }}
>
  {#snippet icon()}
    <span aria-hidden="true">🔒</span>
  {/snippet}
</Story>

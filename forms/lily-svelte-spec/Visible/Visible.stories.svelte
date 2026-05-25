<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Visible from './Visible.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Visible',
    component: Visible,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{}}
>
  {#snippet children(isVisible)}
    <p>Visible: {isVisible}</p>
  {/snippet}
</Story>

<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Framer from './Framer.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Framer',
    component: Framer,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{
    label: "Framed content"
  }}
>
  <p>Decorative framed content.</p>
</Story>

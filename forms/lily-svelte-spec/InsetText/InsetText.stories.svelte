<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import InsetText from './InsetText.svelte';

  const { Story } = defineMeta({
    title: 'Headless/InsetText',
    component: InsetText,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <p>Inset text content</p>
</Story>

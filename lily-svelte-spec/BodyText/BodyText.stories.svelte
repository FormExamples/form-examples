<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import BodyText from './BodyText.svelte';

  const { Story } = defineMeta({
    title: 'Headless/BodyText',
    component: BodyText,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{}}
>
  <p>A short paragraph of body text rendered inside the content-width container.</p>
</Story>

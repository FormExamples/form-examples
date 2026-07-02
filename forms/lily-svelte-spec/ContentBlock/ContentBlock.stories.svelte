<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ContentBlock from './ContentBlock.svelte';

  const { Story } = defineMeta({
    title: 'Headless/ContentBlock',
    component: ContentBlock,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{
    width: "normal"
  }}
>
  <p>A content-width container that constrains its children to a named column width.</p>
</Story>

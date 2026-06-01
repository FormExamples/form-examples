<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ArticleLayout from './ArticleLayout.svelte';

  const { Story } = defineMeta({
    title: 'Headless/ArticleLayout',
    component: ArticleLayout,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{
    label: "Article"
  }}
>
  <p>An article wrapper sets CSS custom properties for content column widths.</p>
</Story>

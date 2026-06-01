<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import DocumentListItem from './DocumentListItem.svelte';

  const { Story } = defineMeta({
    title: 'Headless/DocumentListItem',
    component: DocumentListItem,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'DocumentListItem'}}
>
  <span>DocumentListItem</span>
</Story>

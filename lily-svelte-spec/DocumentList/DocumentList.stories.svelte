<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import DocumentList from './DocumentList.svelte';

  const { Story } = defineMeta({
    title: 'Headless/DocumentList',
    component: DocumentList,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'DocumentList'}}
>
  <span>DocumentList</span>
</Story>

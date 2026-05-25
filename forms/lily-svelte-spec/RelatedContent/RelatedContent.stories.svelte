<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import RelatedContent from './RelatedContent.svelte';

  const { Story } = defineMeta({
    title: 'Headless/RelatedContent',
    component: RelatedContent,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'RelatedContent'}}
>
  <span>RelatedContent</span>
</Story>

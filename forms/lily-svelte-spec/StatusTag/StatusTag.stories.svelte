<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import StatusTag from './StatusTag.svelte';

  const { Story } = defineMeta({
    title: 'Headless/StatusTag',
    component: StatusTag,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'StatusTag'}}
>
  <span>StatusTag</span>
</Story>

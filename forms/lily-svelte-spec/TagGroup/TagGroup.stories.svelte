<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TagGroup from './TagGroup.svelte';

  const { Story } = defineMeta({
    title: 'Headless/TagGroup',
    component: TagGroup,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Tag Group'}}
>
  <span>Tag</span>
</Story>

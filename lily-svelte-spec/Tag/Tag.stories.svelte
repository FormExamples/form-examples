<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Tag from './Tag.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Tag',
    component: Tag,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Tag'}}
>
  <span>Tag</span>
</Story>

<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SectionListItem from './SectionListItem.svelte';

  const { Story } = defineMeta({
    title: 'Headless/SectionListItem',
    component: SectionListItem,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'SectionListItem'}}
>
  <span>SectionListItem</span>
</Story>

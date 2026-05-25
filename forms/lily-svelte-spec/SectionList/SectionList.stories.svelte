<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SectionList from './SectionList.svelte';

  const { Story } = defineMeta({
    title: 'Headless/SectionList',
    component: SectionList,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'SectionList'}}
>
  <span>SectionList</span>
</Story>

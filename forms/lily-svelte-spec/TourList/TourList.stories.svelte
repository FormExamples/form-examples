<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TourList from './TourList.svelte';

  const { Story } = defineMeta({
    title: 'Headless/TourList',
    component: TourList,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Tour List'}}
>
  <li>Item 1</li><li>Item 2</li>
</Story>

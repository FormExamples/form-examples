<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import DontList from './DontList.svelte';

  const { Story } = defineMeta({
    title: 'Headless/DontList',
    component: DontList,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Dont List'}}
>
  <li>Item 1</li><li>Item 2</li>
</Story>

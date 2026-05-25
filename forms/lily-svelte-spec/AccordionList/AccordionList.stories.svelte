<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import AccordionList from './AccordionList.svelte';

  const { Story } = defineMeta({
    title: 'Headless/AccordionList',
    component: AccordionList,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Accordion List'}}
>
  <li>Item 1</li><li>Item 2</li>
</Story>

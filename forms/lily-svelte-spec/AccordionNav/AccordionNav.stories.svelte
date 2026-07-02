<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import AccordionNav from './AccordionNav.svelte';

  const { Story } = defineMeta({
    title: 'Headless/AccordionNav',
    component: AccordionNav,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Accordion Nav'}}
>
  <ul><li><a href="#">Item 1</a></li><li><a href="#">Item 2</a></li></ul>
</Story>

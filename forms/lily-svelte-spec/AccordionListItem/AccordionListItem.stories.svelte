<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import AccordionListItem from './AccordionListItem.svelte';

  const { Story } = defineMeta({
    title: 'Headless/AccordionListItem',
    component: AccordionListItem,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <p>Accordion item content</p>
</Story>

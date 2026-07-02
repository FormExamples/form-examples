<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SummaryListItem from './SummaryListItem.svelte';

  const { Story } = defineMeta({
    title: 'Headless/SummaryListItem',
    component: SummaryListItem,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <span>List item</span>
</Story>

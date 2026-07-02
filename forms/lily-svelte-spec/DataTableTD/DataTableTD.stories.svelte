<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import DataTableTD from './DataTableTD.svelte';

  const { Story } = defineMeta({
    title: 'Headless/DataTableTD',
    component: DataTableTD,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <span>Cell data</span>
</Story>

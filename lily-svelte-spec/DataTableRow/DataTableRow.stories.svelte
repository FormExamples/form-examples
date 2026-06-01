<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import DataTableRow from './DataTableRow.svelte';

  const { Story } = defineMeta({
    title: 'Headless/DataTableRow',
    component: DataTableRow,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <span>Cell data</span>
</Story>

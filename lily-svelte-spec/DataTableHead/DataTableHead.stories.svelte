<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import DataTableHead from './DataTableHead.svelte';

  const { Story } = defineMeta({
    title: 'Headless/DataTableHead',
    component: DataTableHead,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <span>Cell data</span>
</Story>

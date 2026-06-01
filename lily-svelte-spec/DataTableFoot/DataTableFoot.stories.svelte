<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import DataTableFoot from './DataTableFoot.svelte';

  const { Story } = defineMeta({
    title: 'Headless/DataTableFoot',
    component: DataTableFoot,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <span>Cell data</span>
</Story>

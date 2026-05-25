<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import CalendarTableRow from './CalendarTableRow.svelte';

  const { Story } = defineMeta({
    title: 'Headless/CalendarTableRow',
    component: CalendarTableRow,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <td>Row data</td>
</Story>

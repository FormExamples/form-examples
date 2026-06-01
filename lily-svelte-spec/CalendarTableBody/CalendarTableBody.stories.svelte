<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import CalendarTableBody from './CalendarTableBody.svelte';

  const { Story } = defineMeta({
    title: 'Headless/CalendarTableBody',
    component: CalendarTableBody,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <tr><td>Data</td></tr>
</Story>

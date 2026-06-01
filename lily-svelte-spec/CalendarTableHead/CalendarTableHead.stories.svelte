<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import CalendarTableHead from './CalendarTableHead.svelte';

  const { Story } = defineMeta({
    title: 'Headless/CalendarTableHead',
    component: CalendarTableHead,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <tr><th>Header</th></tr>
</Story>

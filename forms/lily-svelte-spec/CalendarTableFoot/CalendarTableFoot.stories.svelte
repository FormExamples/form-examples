<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import CalendarTableFoot from './CalendarTableFoot.svelte';

  const { Story } = defineMeta({
    title: 'Headless/CalendarTableFoot',
    component: CalendarTableFoot,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <tr><td>Footer</td></tr>
</Story>

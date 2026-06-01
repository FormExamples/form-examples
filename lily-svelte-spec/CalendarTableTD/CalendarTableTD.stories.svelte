<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import CalendarTableTD from './CalendarTableTD.svelte';

  const { Story } = defineMeta({
    title: 'Headless/CalendarTableTD',
    component: CalendarTableTD,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <span>Cell data</span>
</Story>

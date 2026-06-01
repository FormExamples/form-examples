<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SummaryBox from './SummaryBox.svelte';

  const { Story } = defineMeta({
    title: 'Headless/SummaryBox',
    component: SummaryBox,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{ heading: 'Key information' }}
>
  <ul>
    <li>Apply by April 30</li>
    <li>Bring photo ID</li>
  </ul>
</Story>

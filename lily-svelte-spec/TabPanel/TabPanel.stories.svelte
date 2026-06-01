<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TabPanel from './TabPanel.svelte';

  const { Story } = defineMeta({
    title: 'Headless/TabPanel',
    component: TabPanel,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{ label: 'Details', selected: true }}
>
  <p>Tab panel content.</p>
</Story>

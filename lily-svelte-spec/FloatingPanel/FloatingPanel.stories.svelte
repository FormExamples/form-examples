<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import FloatingPanel from './FloatingPanel.svelte';

  const { Story } = defineMeta({
    title: 'Headless/FloatingPanel',
    component: FloatingPanel,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Floating Panel'}}
>
  <p>Panel content</p>
</Story>

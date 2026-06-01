<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Panel from './Panel.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Panel',
    component: Panel,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Panel'}}
>
  <p>Panel content</p>
</Story>

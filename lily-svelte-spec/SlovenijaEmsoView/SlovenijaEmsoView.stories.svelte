<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SlovenijaEmsoView from './SlovenijaEmsoView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/SlovenijaEmsoView',
    component: SlovenijaEmsoView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Slovenija Emso View'}}
/>

<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import PolskaPeselView from './PolskaPeselView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/PolskaPeselView',
    component: PolskaPeselView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Polska Pesel View'}}
/>

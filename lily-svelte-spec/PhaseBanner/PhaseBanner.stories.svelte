<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import PhaseBanner from './PhaseBanner.svelte';

  const { Story } = defineMeta({
    title: 'Headless/PhaseBanner',
    component: PhaseBanner,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'PhaseBanner'}}
>
  <span>PhaseBanner</span>
</Story>

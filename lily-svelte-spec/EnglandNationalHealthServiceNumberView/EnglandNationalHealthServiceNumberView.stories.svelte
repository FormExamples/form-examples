<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import EnglandNationalHealthServiceNumberView from './EnglandNationalHealthServiceNumberView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/EnglandNationalHealthServiceNumberView',
    component: EnglandNationalHealthServiceNumberView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'England National Health Service Number View'}}
/>

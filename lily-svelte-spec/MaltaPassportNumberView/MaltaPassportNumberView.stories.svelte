<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import MaltaPassportNumberView from './MaltaPassportNumberView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/MaltaPassportNumberView',
    component: MaltaPassportNumberView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Malta Passport Number View'}}
/>

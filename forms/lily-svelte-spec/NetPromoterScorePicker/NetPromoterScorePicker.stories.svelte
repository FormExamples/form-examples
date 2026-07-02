<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import NetPromoterScorePicker from './NetPromoterScorePicker.svelte';

  const { Story } = defineMeta({
    title: 'Headless/NetPromoterScorePicker',
    component: NetPromoterScorePicker,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Net Promoter Score Picker'}}
/>

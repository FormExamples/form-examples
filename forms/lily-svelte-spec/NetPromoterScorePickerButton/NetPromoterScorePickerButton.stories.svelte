<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import NetPromoterScorePickerButton from './NetPromoterScorePickerButton.svelte';

  const { Story } = defineMeta({
    title: 'Headless/NetPromoterScorePickerButton',
    component: NetPromoterScorePickerButton,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Net Promoter Score Picker Button'}}
/>

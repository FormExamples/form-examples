<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import RangeInput from './RangeInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/RangeInput',
    component: RangeInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Range Input'}}
/>

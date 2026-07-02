<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SlovenijaEmsoInput from './SlovenijaEmsoInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/SlovenijaEmsoInput',
    component: SlovenijaEmsoInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Slovenija Emso Input'}}
/>

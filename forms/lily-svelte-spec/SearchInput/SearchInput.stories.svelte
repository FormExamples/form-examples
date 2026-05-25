<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SearchInput from './SearchInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/SearchInput',
    component: SearchInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Search Input'}}
/>

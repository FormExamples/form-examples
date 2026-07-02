<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TextInputWithSearch from './TextInputWithSearch.svelte';

  const { Story } = defineMeta({
    title: 'Headless/TextInputWithSearch',
    component: TextInputWithSearch,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Text Input With Search'}}
/>

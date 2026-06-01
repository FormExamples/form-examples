<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import UrlInput from './UrlInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/UrlInput',
    component: UrlInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Url Input'}}
/>

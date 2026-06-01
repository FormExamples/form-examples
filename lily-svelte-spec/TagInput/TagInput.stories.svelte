<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TagInput from './TagInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/TagInput',
    component: TagInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Tag Input'}}
/>

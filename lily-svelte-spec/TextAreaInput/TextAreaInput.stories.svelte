<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TextAreaInput from './TextAreaInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/TextAreaInput',
    component: TextAreaInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'TextAreaInput'}}
/>

<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TextAreaInputWithCharacterCounter from './TextAreaInputWithCharacterCounter.svelte';

  const { Story } = defineMeta({
    title: 'Headless/TextAreaInputWithCharacterCounter',
    component: TextAreaInputWithCharacterCounter,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Text Area With Character Counter'}}
/>

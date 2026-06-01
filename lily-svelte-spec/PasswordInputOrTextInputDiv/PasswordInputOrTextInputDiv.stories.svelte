<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import PasswordInputOrTextInputDiv from './PasswordInputOrTextInputDiv.svelte';

  const { Story } = defineMeta({
    title: 'Headless/PasswordInputOrTextInputDiv',
    component: PasswordInputOrTextInputDiv,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Password Input Or Text Input Div'}}
/>

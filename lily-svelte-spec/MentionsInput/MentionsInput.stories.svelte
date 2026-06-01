<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import MentionsInput from './MentionsInput.svelte';

  const { Story } = defineMeta({
    title: 'Headless/MentionsInput',
    component: MentionsInput,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{ label: 'Comment', placeholder: 'Type @ to mention', triggerChar: '@', expanded: false }}
>
  <ul role="listbox"><li role="option">@alice</li></ul>
</Story>

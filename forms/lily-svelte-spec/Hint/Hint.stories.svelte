<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Hint from './Hint.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Hint',
    component: Hint,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <span>Hint text</span>
</Story>

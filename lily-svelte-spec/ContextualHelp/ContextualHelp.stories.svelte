<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ContextualHelp from './ContextualHelp.svelte';

  const { Story } = defineMeta({
    title: 'Headless/ContextualHelp',
    component: ContextualHelp,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{ label: 'Help', expanded: true }}
>
  <p>Help content explaining the related field.</p>
</Story>

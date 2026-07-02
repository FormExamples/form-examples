<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ActionGroup from './ActionGroup.svelte';

  const { Story } = defineMeta({
    title: 'Headless/ActionGroup',
    component: ActionGroup,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{ label: 'Editing actions' }}
>
  <button type="button">Cut</button>
  <button type="button">Copy</button>
  <button type="button">Paste</button>
</Story>

<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ActionBarButton from './ActionBarButton.svelte';

  const { Story } = defineMeta({
    title: 'Headless/ActionBarButton',
    component: ActionBarButton,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{ label: 'Delete' }}
>
  Delete
</Story>

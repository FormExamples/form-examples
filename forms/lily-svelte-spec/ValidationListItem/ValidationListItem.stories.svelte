<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ValidationListItem from './ValidationListItem.svelte';

  const { Story } = defineMeta({
    title: 'Headless/ValidationListItem',
    component: ValidationListItem,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{ status: 'pending' }}
>
  At least 8 characters
</Story>

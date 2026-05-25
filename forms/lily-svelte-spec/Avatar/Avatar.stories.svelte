<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Avatar from './Avatar.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Avatar',
    component: Avatar,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <span>Avatar</span>
</Story>

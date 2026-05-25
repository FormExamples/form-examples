<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import IconListItem from './IconListItem.svelte';

  const { Story } = defineMeta({
    title: 'Headless/IconListItem',
    component: IconListItem,
  });
</script>

<Story name="Default" tags={['autodocs', '!dev']}>
  Fast
</Story>

<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import MenuGroup from './MenuGroup.svelte';

  const { Story } = defineMeta({
    title: 'Headless/MenuGroup',
    component: MenuGroup,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{ label: 'File' }}
>
  <ul role="menu">
    <li role="menuitem">Open…</li>
    <li role="menuitem">Save</li>
  </ul>
</Story>

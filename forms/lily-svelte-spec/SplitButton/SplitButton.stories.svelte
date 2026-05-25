<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SplitButton from './SplitButton.svelte';

  const { Story } = defineMeta({
    title: 'Headless/SplitButton',
    component: SplitButton,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{
    label: 'Save options',
    primaryLabel: 'Save',
    menuLabel: 'More save options',
    menuOpen: false,
  }}
>
  <ul role="menu">
    <li role="menuitem">Save as draft</li>
    <li role="menuitem">Save and close</li>
  </ul>
</Story>

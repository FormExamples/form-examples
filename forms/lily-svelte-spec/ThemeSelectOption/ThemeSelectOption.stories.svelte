<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ThemeSelectOption from './ThemeSelectOption.svelte';

  const { Story } = defineMeta({
    title: 'Headless/ThemeSelectOption',
    component: ThemeSelectOption,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <span>Option text</span>
</Story>

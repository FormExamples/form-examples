<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ToggleGroup from './ToggleGroup.svelte';

  const { Story } = defineMeta({
    title: 'Headless/ToggleGroup',
    component: ToggleGroup,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Toggle Group'}}
>
  <span>Toggle</span>
</Story>

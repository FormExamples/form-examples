<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Label from './Label.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Label',
    component: Label,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <span>Label text</span>
</Story>

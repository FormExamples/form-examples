<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Option from './Option.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Option',
    component: Option,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <span>Option text</span>
</Story>

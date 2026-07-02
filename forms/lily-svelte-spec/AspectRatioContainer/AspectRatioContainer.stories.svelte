<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import AspectRatioContainer from './AspectRatioContainer.svelte';

  const { Story } = defineMeta({
    title: 'Headless/AspectRatioContainer',
    component: AspectRatioContainer,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <p>Aspect Ratio Container content</p>
</Story>

<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ContainerWithFluidWidth from './ContainerWithFluidWidth.svelte';

  const { Story } = defineMeta({
    title: 'Headless/ContainerWithFluidWidth',
    component: ContainerWithFluidWidth,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{ paddingInline: '1rem' }}
>
  <span>Full-width content with horizontal padding.</span>
</Story>

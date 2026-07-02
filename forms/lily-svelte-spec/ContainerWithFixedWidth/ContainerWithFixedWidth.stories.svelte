<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ContainerWithFixedWidth from './ContainerWithFixedWidth.svelte';

  const { Story } = defineMeta({
    title: 'Headless/ContainerWithFixedWidth',
    component: ContainerWithFixedWidth,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{ maxWidth: '1200px' }}
>
  <span>Centered content with fixed max width.</span>
</Story>

<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import OverlayContainer from './OverlayContainer.svelte';

  const { Story } = defineMeta({
    title: 'Headless/OverlayContainer',
    component: OverlayContainer,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{ open: true, label: 'Modal backdrop' }}
>
  <div role="dialog" aria-modal="true" aria-label="Example dialog">Dialog content</div>
</Story>

<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import FloatButton from './FloatButton.svelte';

  const { Story } = defineMeta({
    title: 'Headless/FloatButton',
    component: FloatButton,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{ label: 'Help', position: 'bottom-right' }}
>
  <span aria-hidden="true">?</span>
</Story>

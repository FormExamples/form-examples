<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Footer from './Footer.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Footer',
    component: Footer,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Footer'}}
>
  <p>Footer content</p>
</Story>

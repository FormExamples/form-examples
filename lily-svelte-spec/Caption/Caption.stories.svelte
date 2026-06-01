<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Caption from './Caption.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Caption',
    component: Caption,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'caption':'Caption Caption'}}
>
  <span>Caption text</span>
</Story>

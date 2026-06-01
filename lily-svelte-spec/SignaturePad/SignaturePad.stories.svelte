<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SignaturePad from './SignaturePad.svelte';

  const { Story } = defineMeta({
    title: 'Headless/SignaturePad',
    component: SignaturePad,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Signature Pad'}}
>
  <p>Sign here</p>
</Story>

<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import MedicalBannerBoxForDanger from './MedicalBannerBoxForDanger.svelte';

  const { Story } = defineMeta({
    title: 'Headless/MedicalBannerBoxForDanger',
    component: MedicalBannerBoxForDanger,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Medical Banner Box For Danger'}}
>
  <p>Banner message</p>
</Story>

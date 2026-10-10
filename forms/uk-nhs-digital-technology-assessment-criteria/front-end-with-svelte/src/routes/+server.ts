import { redirect } from "@sveltejs/kit";

export function GET() {
  redirect(307, "/uk-nhs-digital-technology-assessment-criteria/");
}

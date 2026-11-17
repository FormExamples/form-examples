# X-Ray Test Result — doc/

Clinical and regulatory reference documentation grounding the result form's
interpretation grade, structured-reporting category, and critical-result
alerting. See [`clinical-references.md`](clinical-references.md).

## Specification Driven Development

**The `spec/` directory is the source of truth.** 
- Before doing anything read all files inside the `spec/` directory using your file-reading tools.
- Treat all files inside `spec/` as strict requirements. Where any file disagrees with the spec, the spec wins: fix the file, or change the spec on purpose and bring the other files into line in the same commit. 
- Do not improvise structure, style, or citation practice.

# Rule and flag catalogue

| Rule or flag | Engine function | Basis |
| --- | --- | --- |
| Principal under 18 (F-HCPOA-006) | `principalMinor` | Adult-capacity requirement of each state statute |
| Capacity or voluntariness denied (F-HCPOA-001) | `capacityDenied` | Common-law capacity and undue influence |
| Agent under 18 (F-HCPOA-002) | `agentUnderAge` | State statutes require an adult agent |
| Agent is provider or facility staff (F-HCPOA-002) | `agentProviderConflict`, `agentFacilityConflict` | Cal. Prob. Code 4659; N.Y. Pub. Health Law 2981; Tex. Health & Safety Code 166.152 |
| Barred witness (F-HCPOA-003) | `witnessBars` | See state-rules.md |
| Witness count and notary (F-HCPOA-004) | `executionDefects` | See state-rules.md |
| Skilled-nursing ombudsman (F-HCPOA-005) | `executionDefects` | Cal. Prob. Code 4675 |
| Required fields (F-HCPOA-019) | `missingRequired` | Spec section 4 |
| No successor (F-HCPOA-007) | `hasSuccessor` | Best practice; most statutes let a successor act |
| HIPAA release missing (F-HCPOA-008) | flag | 45 CFR 164.508 |
| Conflicting wishes (F-HCPOA-009) | flag | Clarity for providers |
| POLST distinction (F-HCPOA-010) | flag | polst.org |
| Organ donation (F-HCPOA-011) | flag | Revised UAGA (2006) |
| Unknown state (F-HCPOA-012) | `isKnownState` | Uniform default applied |
| Copies (F-HCPOA-013) | flag | 42 U.S.C. 1395cc(f) |
| Prior directive remains (F-HCPOA-014) | flag | Revocation rules in state statutes |

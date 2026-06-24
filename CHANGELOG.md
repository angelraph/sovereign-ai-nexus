# Changelog

All notable changes to **Sovereign AI Nexus** will be documented in this file.

## [1.0.1] - 2026-06-19

### Fixed
- Resolved Vercel deployment warning flags by fixing a `class` instead of `className` attribute in `src/App.tsx`.
- Removed unused imports (`Lock`, `Unlock`, `Plus`, `RefreshCw`, `ExternalLink`) that failed strict TypeScript compiler builds.
- Refactored `opponentAgent` to static state reference, resolving the unused state setter warning (`setOpponentAgent`).

---

## [1.0.0] - 2026-06-19

### Added
- Initial commit of the Sovereign AI Nexus console interface.
- **Confidential Agent Vault:** Intel TDX/SGX TEE Enclave processing simulator with cryptographic attestation proofs and 0G storage encryption triggers.
- **Nexus Knowledge Graph:** Interactive dynamic physics visualization mapping document partitioning and chunking node distribution.
- **Agent Tournament Arena:** Autonomous multi-agent matchmaking debates with EVM state receipt logging to 0G Layer 1.
- Initialized TypeScript development stack using React, Vite, and TailwindCSS.

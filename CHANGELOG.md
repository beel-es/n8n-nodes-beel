# Changelog

## 0.1.2

Clears the last of n8n's verification checks: `execute` no longer rethrows the
caught error, it always throws a failure carrying the node and the item index.

## 0.1.1

Everything n8n's verification checks asked for, so the node can be submitted to
the Creator Portal. No change to what any operation does.

- `NodeConnectionTypes.Main` instead of the `'main'` literal
- Errors leaving the node are always a `NodeApiError` or `NodeOperationError`,
  never a bare one without the node attached
- The credential icon has a light and a dark variant
- A failed webhook unsubscribe is logged instead of vanishing
- `usableAsTool` declared on the trigger
- Defaults the linter can see, in the generated property builder
- Publishing moved to `publish.yml`, the filename npm's Trusted Publisher setup
  expects, and `@n8n/node-cli` added as a dev dependency

## 0.1.0

First release.

### BeeL node

60 operations over the BeeL Public API, generated from its OpenAPI contract:
invoices with their full lifecycle, recurring invoices, customers, products,
numbering series, companies with the VeriFactu representation flow, tax
configuration and NIF validation.

- Field constraints (`pattern`, lengths, bounds, decimals, formats) come from the
  contract and are checked before the request is sent, so mistakes surface in the
  editor rather than as a `422`
- Tax percentage dropdowns follow the chosen tax type
- Multi-NIF: a company picker per node, a default on the credential, sent as
  `Beel-Active-Company`
- Every `POST` carries an `Idempotency-Key`, which the workflow can supply
- Invoice PDFs download to a binary field; the signed representation uploads
  from one

### BeeL Trigger

Registers and removes its own webhook subscription, and verifies every delivery:
HMAC-SHA256 over the raw body, constant-time comparison, and a replay window.

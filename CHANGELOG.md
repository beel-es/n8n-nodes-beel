# Changelog

## 0.1.3

Every string the n8n editor shows is English, as the node review requires. The
contract's Spanish `example`/`default` for two address fields no longer reaches
the UI:

- Address Country: empty default and a `Spain` placeholder. The API expects the
  country name in Spanish, so that is now said in the field description instead
  of pre-filling `España`
- Address Floor: `2nd floor, Apt A` instead of `2º A`

Fixed in `scripts/config.ts` (new `FIELD_UI_OVERRIDES`) rather than in the
generated file, so regenerating from the contract keeps the English text.

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

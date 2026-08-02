# Changelog

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

# n8n-nodes-beel

[![npm version](https://img.shields.io/npm/v/n8n-nodes-beel.svg)](https://www.npmjs.com/package/n8n-nodes-beel)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

n8n community node for [BeeL](https://beel.es) — invoicing for self-employed professionals and companies in Spain, with VeriFactu compliance.

Issue invoices, keep customers and products in sync, and react to AEAT events, without writing a single HTTP request.

- **BeeL** — 50 operations across invoices, customers, products, series, recurring invoices, configuration and NIF validation
- **BeeL Trigger** — starts a workflow on `invoice.emitted`, `invoice.email.sent`, `invoice.cancelled` and `verifactu.status.updated`, with HMAC-SHA256 signature verification
- Multi-NIF aware, idempotent by default, and validated against the API contract before a request is sent

## Installation

**n8n Cloud / self-hosted UI** — Settings → Community Nodes → Install → `n8n-nodes-beel`.

**Self-hosted CLI**

```bash
cd ~/.n8n
npm install n8n-nodes-beel
```

Restart n8n afterwards. Requires n8n 1.60+ and Node.js 20.15+.

## Credentials

Create an API key in your BeeL dashboard, then add a **BeeL API** credential in n8n:

| Field | Notes |
| --- | --- |
| **API Key** | `beel_sk_test_…` targets the sandbox (no quota consumed, VeriFactu in test mode). `beel_sk_live_…` targets production. |
| **Default Company ID** | Optional. Only for multi-NIF accounts using an account-wide key — see below. |
| **Base URL** | `https://app.beel.es/api` unless you were told otherwise. |

The credential test calls `GET /v1/configuration/series`, so a green check means the key is valid and can read your account.

### Multi-NIF accounts

An account can bill under several NIFs (companies). The node resolves the company in this order:

1. The **Company** field on the node — set it to bill a specific NIF, per item if you use an expression
2. The **Default Company ID** on the credential
3. Whatever the API key is already scoped to — a company-scoped key needs neither of the above

Under the hood this is the `Beel-Active-Company` header. The **Company** dropdown is populated from `GET /v1/companies`, and the series and customer dropdowns follow the company you pick, so you never see another NIF's data by accident.

## Operations

### Invoice

`Create`, `Get`, `Get Many`, `Update`, `Delete`, `Create Corrective`, `Issue`, `Duplicate`, `Send by Email`, `Mark as Paid`, `Mark as Sent`, `Revert to Issued`, `Void`, `Schedule`, `Unschedule`, `Reschedule`, `Download PDF`

Invoice lines are a repeatable collection with description, quantity, unit price, discount, tax (IVA/IGIC/IPSI/other with its regime key), IRPF and equivalence surcharge — including the exemption reasons from Ley 37/1992.

The recipient is either an existing customer picked from a dropdown, or filled inline for a one-off.

Under **Additional Fields → Options** you decide what happens on creation: leave it as a draft, `Issue Directly` to get a definitive number and trigger the VeriFactu submission, `Wait For PDF`, and `Send Automatically` to email it.

`Download PDF` puts the file in a binary field. Issued invoices are fetched through the pre-signed URL the API returns; enable **Draft Preview** for drafts, which have no final PDF yet.

### Idempotency

Every `POST` carries an `Idempotency-Key`, and the API returns the resource created the first time instead of creating a second one. By default the key is a fresh UUID per request, which makes a network-level retry safe but still creates a new invoice if the workflow runs again.

Set the **Idempotency Key** field from your own data — `{{ $json.order_id }}` — and re-running the workflow, or n8n retrying the node, returns the invoice that order already produced.

### Customer, Product, Series, Recurring Invoice, Configuration, NIF

Full CRUD on customers, products and numbering series; recurring templates can be created, paused, resumed, previewed, skipped and generated on demand; the configuration resource exposes tax settings, tax types and VeriFactu status; and `NIF → Validate` checks a Spanish tax ID against the AEAT registry.

## Trigger

Add a **BeeL Trigger**, pick your events, and activate the workflow — the node registers the subscription with BeeL and stores the signing secret. Deactivating deletes the subscription.

Every delivery is verified before it reaches your workflow:

- The `BeeL-Signature` header is recomputed as `HMAC-SHA256(secret, "<timestamp>.<raw body>")` over the exact bytes received and compared in constant time
- Deliveries older than the tolerance (5 minutes by default) are rejected, which blocks replays
- Anything that fails gets a `401` and never starts the workflow

Enable **Include Delivery Headers** to receive `BeeL-Event-Id` and `BeeL-Delivery-Id` alongside the payload — the event ID is stable across retries, so it is what you deduplicate on.

BeeL only delivers to HTTPS endpoints. While developing locally, run `n8n start --tunnel`.

## How this node is built

The node is generated from BeeL's OpenAPI contract, which is vendored at [`openapi/public-api.yaml`](openapi/public-api.yaml).

```
openapi/public-api.yaml
    │  npm run generate
    ▼
nodes/Beel/descriptions/generated/operations.generated.ts
    │  propertyBuilder.ts → n8n properties
    │  genericExecutor.ts → HTTP request
    ▼
BeeL node
```

`scripts/generate.ts` derives operations, labels, required fields, pagination, list shapes and **every field constraint** (`pattern`, `minLength`, `maxLength`, `minimum`, `maximum`, `multipleOf`, `format`) straight from the contract. `scripts/config.ts` holds only what the contract cannot express: which endpoints are worth exposing and what they are called in the UI.

Those constraints are enforced in `validation.ts` before the request goes out, so a nine-character NIF or a four-decimal unit price fails in the editor with a message pointing at the field, instead of a `422` that already consumed an API call.

Two operations are hand-written because they return a file rather than JSON: the invoice PDF and its draft preview.

### Working on it

```bash
npm install
npm run generate      # regenerate from the contract
npm run build         # compile to dist/
npm test              # description consistency + contract drift
npm run lint          # eslint-plugin-n8n-nodes-base
```

`npm test` fails when the generated file is stale, and when the contract grows an endpoint that is neither generated, hand-written nor explicitly excluded — so a new BeeL endpoint cannot be silently missed.

To try it in a local n8n:

```bash
npm run build && npm link
cd ~/.n8n && npm link n8n-nodes-beel && n8n start
```

## Compatibility

Tested against n8n 1.6x and BeeL Public API 1.0.1. No runtime dependencies.

## Resources

- [BeeL API documentation](https://docs.beel.es)
- [BeeL Node.js SDK](https://www.npmjs.com/package/@beel_es/sdk)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)

## License

[MIT](LICENSE)

<p align="center">
  <a href="https://beel.es">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/beel-es/n8n-nodes-beel/main/assets/beel-wordmark-white.png">
      <img src="https://raw.githubusercontent.com/beel-es/n8n-nodes-beel/main/assets/beel-wordmark-blue.png" alt="BeeL" width="220">
    </picture>
  </a>
</p>

<h1 align="center">n8n-nodes-beel</h1>

<p align="center">
  Issue invoices from n8n, with VeriFactu compliance.<br>
  <a href="https://beel.es">beel.es</a> · <a href="https://docs.beel.es">API docs</a> · <a href="https://www.npmjs.com/package/n8n-nodes-beel">npm</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/n8n-nodes-beel"><img src="https://img.shields.io/npm/v/n8n-nodes-beel.svg" alt="npm version"></a>
  <a href="https://github.com/beel-es/n8n-nodes-beel/actions/workflows/ci.yml"><img src="https://github.com/beel-es/n8n-nodes-beel/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"></a>
</p>

n8n community node for [BeeL](https://beel.es) — invoicing for self-employed professionals and companies in Spain, with VeriFactu compliance.

Issue invoices, keep customers and products in sync, onboard new NIFs, and react to AEAT decisions, without writing a single HTTP request.

- **BeeL** — 60 operations across invoices, recurring invoices, customers, products, series, companies, configuration and NIF validation
- **BeeL Trigger** — starts a workflow when BeeL emits an event, with the delivery's HMAC-SHA256 signature verified before anything runs
- Every field constraint comes from BeeL's OpenAPI contract and is checked before the request leaves n8n
- Multi-NIF aware, idempotent, no runtime dependencies

---

## Installation

**n8n Cloud, or self-hosted with the UI** — *Settings → Community Nodes → Install*, then enter `n8n-nodes-beel`.

**Self-hosted, from the CLI**

```bash
cd ~/.n8n
npm install n8n-nodes-beel
```

Restart n8n afterwards. Requires n8n 1.60 or newer and Node.js 20.15+.

---

## Credentials

Create an API key in your BeeL dashboard, then add a **BeeL API** credential:

| Field | Notes |
| --- | --- |
| **API Key** | `beel_sk_test_…` targets the sandbox — no quota consumed, VeriFactu in test mode. `beel_sk_live_…` targets production. |
| **Default Company ID** | Optional, multi-NIF accounts only. See below. |
| **Base URL** | `https://app.beel.es/api` unless you were told otherwise. |

The credential test calls `GET /v1/configuration/series`, so a green tick means the key is valid and can read your account.

### Multi-NIF accounts

An account can bill under several NIFs. The node picks the company in this order:

1. The **Company** field on the node — set it per item with an expression if one workflow serves several NIFs
2. The **Default Company ID** on the credential
3. Whatever the key already resolves to, if your account has a single NIF

Under the hood this is the `Beel-Active-Company` header. The **Company** dropdown is filled from `GET /v1/companies`, and the series and customer dropdowns follow whichever company you pick, so you never see another NIF's data by accident.

Some write operations refuse to guess: on a multi-NIF account, creating an invoice without a company returns `403 ACTIVE_COMPANY_REQUIRED`. Set the field.

---

## Operations

### Invoice

| | |
| --- | --- |
| **Lifecycle** | Create · Get · Get Many · Update · Delete · Issue · Void · Create Corrective · Revert to Issued |
| **Delivery** | Send by Email · Mark as Paid · Mark as Sent · Download PDF |
| **Scheduling** | Schedule · Reschedule · Unschedule · Duplicate |

**Lines** are a repeatable collection: description, quantity, unit, unit price, discount, tax, IRPF, equivalence surcharge and the exemption reasons from Ley 37/1992. The tax percentage dropdown follows the tax type — IVA offers 0/4/10/21, IGIC 0/3/5/7/9.5/15/20, IPSI 0.5/1/2/4/8/10, and only `OTHER` accepts a free value.

**Recipient** is either an existing customer picked from a dropdown, or filled inline for a one-off. Pick a customer and the address fields stay out of the request entirely.

**Options** decide what happens on creation: leave it a draft, `Issue Directly` for a definitive number and a VeriFactu submission, `Wait For PDF`, `Send Automatically` to email it.

**Download PDF** puts the file in a binary field. Issued invoices come through the pre-signed URL the API returns; enable **Draft Preview** for drafts, which have no final PDF yet.

### Company

Onboard a NIF without leaving the workflow: Create · Get · Get Many · Update · Delete, plus the VeriFactu registration flow.

```
Create ──▶ Generate Representation ──▶ Download Representation
                                                │
                                       the holder signs the PDF
                                                │
        Get Representation Status ◀── Submit Representation
```

**Submit Representation** is the one endpoint that takes a file: point **Input Binary Field** at the item holding the signed PDF and it goes up as `multipart/form-data`. **Cancel Representation** aborts a process in flight, and the trigger tells you when the AEAT answers.

### Recurring Invoice

Create · Create From Invoice · Get · Get Many · Update · Delete · Pause · Resume · Generate Now · Skip Next · Preview · Get History.

### Customer, Product, Series, Configuration, NIF

Full CRUD on customers, products and numbering series, plus product Search and series Set Default. Configuration exposes the tax settings, the tax type catalogue, VeriFactu status and invoice customisation options. `NIF → Validate` checks a Spanish tax ID against the AEAT registry.

---

## Trigger

Drop in a **BeeL Trigger**, choose your events, activate the workflow — the node registers the subscription with BeeL and stores the signing secret. Deactivating deletes it. If the URL or the event list drifts, the next activation realigns the subscription without losing the secret.

Events: `invoice.emitted`, `invoice.email.sent`, `invoice.cancelled`, `verifactu.status.updated`.

Every delivery is verified before it reaches your workflow:

- `BeeL-Signature` is recomputed as `HMAC-SHA256(secret, "<timestamp>.<raw body>")` over the exact bytes received, and compared in constant time
- Deliveries older than the tolerance (5 minutes by default) are rejected, which blocks replays
- Anything that fails gets a `401` and never starts the workflow

Turn on **Include Delivery Headers** to receive `BeeL-Event-Id` and `BeeL-Delivery-Id` next to the payload. The event ID is stable across retries, so that is the one to deduplicate on.

BeeL only delivers to HTTPS endpoints. While developing locally, run `n8n start --tunnel`.

---

## Idempotency

Every `POST` carries an `Idempotency-Key`, and BeeL returns the resource created the first time rather than making a second one.

By default the key is a fresh UUID per request: that makes a network-level retry safe, but a workflow that runs twice still issues two invoices. Set the **Idempotency Key** field from your own data and re-runs become safe too:

```
Idempotency Key:  {{ $json.order_id }}
```

One order, one invoice, however many times the workflow fires.

---

## Examples

**Invoice each paid order, and file the PDF**

```
Webhook (your shop)
  └─▶ BeeL · Customer → Create          (or look one up)
        └─▶ BeeL · Invoice → Create     Issue Directly ✓ · Idempotency Key {{ $json.order_id }}
              └─▶ BeeL · Invoice → Download PDF
                    └─▶ Google Drive / S3 / email
```

**Act on the AEAT's answer**

```
BeeL Trigger · verifactu.status.updated
  └─▶ IF  {{ $json.data.new_status === 'REJECTED' }}
        ├─ true  ─▶ Slack: "Invoice {{ $json.data.invoice_number }} rejected — {{ $json.data.error_message }}"
        └─ false ─▶ Postgres: store {{ $json.data.qr_url }}
```

**Onboard a NIF on your platform**

```
BeeL · Company → Create
  └─▶ BeeL · Company → Generate Representation
        └─▶ BeeL · Company → Download Representation   → send it out for signature
              ⋯ the signed PDF comes back ⋯
              └─▶ BeeL · Company → Submit Representation
                    └─▶ BeeL Trigger · verifactu.status.updated
```

**Bill several NIFs from one workflow** — set **Company** to `{{ $json.company_id }}` and the same node serves every NIF, one item each.

---

## How this node is built

The node is generated from BeeL's OpenAPI contract, vendored at [`openapi/public-api.yaml`](openapi/public-api.yaml).

```
openapi/public-api.yaml
    │   npm run generate
    ▼
descriptions/generated/operations.generated.ts    metadata: paths, fields, constraints
    │
    ├── propertyBuilder.ts  ──▶  n8n form controls
    ├── validation.ts       ──▶  constraints enforced before the request
    └── genericExecutor.ts  ──▶  the HTTP request
```

`scripts/generate.ts` derives the operations, their labels and descriptions, which fields are required, how each endpoint paginates and shapes its list, and **every field constraint** — `pattern`, `minLength`, `maxLength`, `minimum`, `maximum`, `multipleOf`, `format`. `scripts/config.ts` holds only what the contract cannot express in its schema: which endpoints are worth exposing, what they are called in the UI, and the handful of cross-field rules it documents in prose (which VAT rates each tax type accepts).

Those constraints are checked in `validation.ts` before anything is sent, so a nine-character NIF or a four-decimal unit price fails in the editor with a message pointing at the field, instead of a `422` that already spent an API call and an idempotency key.

Two operations are hand-written, because they move a file rather than JSON: the invoice PDF and the signed representation upload.

### Tests

```bash
npm test              # 83 tests
npm run test:watch
npm run test:coverage
```

They cover the request the executor builds for each operation, the contract constraints and where they fire, pagination and the response shapes, the PDF download and the multipart upload, the node description's internal consistency, and — the security-critical part — the trigger: signature verification, tampered bodies, wrong secrets, the replay window, and the subscription lifecycle.

One test runs the generator in `--check` mode, so the suite fails when the committed metadata is stale, or when the contract grows an endpoint that is neither generated, hand-written nor explicitly excluded. A new BeeL endpoint cannot slip by unnoticed.

### Working on it

```bash
npm install
npm run generate      # regenerate from the contract
npm run build         # compile to dist/
npm test
npm run lint          # eslint-plugin-n8n-nodes-base
```

To try it in a local n8n:

```bash
npm run build
mkdir -p ~/.n8n/nodes && cd ~/.n8n/nodes
npm install /path/to/n8n-nodes-beel
n8n start
```

---

## Compatibility

Tested against n8n 2.32 and BeeL Public API 1.0.1. No runtime dependencies.

## Resources

- [BeeL API documentation](https://docs.beel.es)
- [BeeL Node.js SDK](https://www.npmjs.com/package/@beel_es/sdk)
- [n8n community nodes](https://docs.n8n.io/integrations/community-nodes/)

## License

[MIT](LICENSE) © Honey Solutions S.L.

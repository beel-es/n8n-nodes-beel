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

- **BeeL** — 75 operations across invoices, recurring invoices, customers, products, series, companies, accounts, payment connections, configuration and NIF validation
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

The credential test calls `GET /v1/me/identity`, so a green tick means the key is valid — it needs no company, so it does not depend on how the account is set up.

### Multi-NIF accounts

An account can bill under several NIFs, and BeeL scopes its resources by company: invoices, customers, products and series all live under one. The node picks that company in this order:

1. The **Company** field on the node — set it per item with an expression if one workflow serves several NIFs
2. The **Default Company ID** on the credential

There is no third option. The company travels in the URL — `/v1/companies/{company_id}/invoices` — so a request without one cannot be sent, and the node says so instead of guessing. (Earlier versions passed a `Beel-Active-Company` header; the API retired it, and a header the server ignores would have silently billed under the wrong NIF.)

The **Company** dropdown is filled from `/v1/accounts/{account_id}/companies`, with the account resolved once per credential from `/v1/me/identity`. The series, customer and product dropdowns follow whichever company you pick, so you never see another NIF's data by accident.

The **BeeL Trigger** is the exception: webhook subscriptions belong to the account, not to a company, so one trigger receives the events of every NIF. Filter on the payload if you only want one.

### Provisioners (gestorías, platforms)

If your key provisioned accounts for other people, the **Account** field picks which one an operation acts on — the contract allows `account_id` to be "your own account or an account you provisioned". Leave it empty and it resolves to the account the key belongs to, which is what you want on an ordinary key. The **Company** dropdown follows whichever account you pick, so onboarding a client's NIF and then operating on it is one workflow.

---

## Operations

### Invoice

| | |
| --- | --- |
| **Lifecycle** | Create · Get · Get Many · Update · Delete · Issue · Void · Create Corrective · Convert Proforma |
| **Delivery** | Send by Email · Set Status · Download PDF |
| **Scheduling** | Get Schedule · Schedule · Unschedule · Duplicate |

**Lines** are a repeatable collection: description, quantity, unit, unit price, discount, tax, IRPF, equivalence surcharge and the exemption reasons from Ley 37/1992. The tax percentage dropdown follows the tax type — IVA offers 0/4/10/21, IGIC 0/3/5/7/9.5/15/20, IPSI 0.5/1/2/4/8/10, and only `OTHER` accepts a free value.

**Recipient** is either an existing customer picked from a dropdown, or filled inline for a one-off. Pick a customer and the address fields stay out of the request entirely.

**Options** decide what happens on creation: leave it a draft, `Issue Directly` for a definitive number and a VeriFactu submission, `Wait For PDF`, `Send Automatically` to email it.

**Set Status** covers what used to be three operations — Mark as Paid, Mark as Sent and Revert to Issued are now values of one commercial status, which is how the API models it. Issuing and voiding stay separate: they are fiscal acts, not statuses. **Schedule** both schedules and reschedules, so there is nothing to undo before moving a date.

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

**Submit Representation** is the one endpoint that takes a file: point **Input Binary Field** at the item holding the signed PDF and it goes up as `multipart/form-data`. It acts on the company selected in the **Company** field, like every other company-scoped operation. **Cancel Representation** aborts a process in flight, and the trigger tells you when the AEAT answers.

### Recurring Invoice

Create · Create From Invoice · Get · Get Many · Update · Delete · Set Status · Generate Now · Skip Next · Get Next Occurrence · Get History.

Pausing and resuming are **Set Status** (`PAUSED` / `ACTIVE`), matching invoices. `COMPLETED` is reached on its own when the schedule runs out and cannot be set.

### Account

For platforms that onboard clients: Provision · Get · Get Many · Get Usage · Create Claim Token.

`Provision` is **idempotent by `external_ref`**, so pointing it at your own tenant ID makes a re-run safe. It returns a one-time `claim_token` the holder uses to take ownership — and those **expire after 30 days**, with a new one invalidating the previous, which is exactly the sort of thing a scheduled workflow should re-issue rather than a person remember.

### Payment Connection, Payment Event

`Payment Connection → Initiate` opens a white-label authorization so a managed NIF's holder can connect Stripe; from then on BeeL auto-invoices every charge.

`Payment Event` is the other half, and the reason it is here: automatic invoicing sometimes fails, **there is no webhook for it**, and the list takes no server-side filter. A charge that took money without producing an invoice is only visible by sweeping this collection and sifting on `needs_action`. Each event carries `failure_category` and `failure_reason`, plus `retry_available` and `draft_available` telling you which recovery it accepts — `Retry` when the cause was transient (a missing default series, say), `Generate Draft` when it needs a human to look before issuing.

### Customer, Product, Series, Configuration, NIF

Full CRUD on customers, products and numbering series, plus series Set Default, Get Defaults and Ensure Defaults. Product search is the `Search Query` filter on **Get Many** — the API withdrew its separate search endpoint and `?q=` on the list returns at least the same results, paginated. Configuration exposes the company's tax settings and VeriFactu status, plus the account-wide tax type and invoice customisation catalogues. `NIF → Validate` checks a Spanish tax ID against the AEAT registry.

---

## Trigger

Drop in a **BeeL Trigger**, choose your events, activate the workflow — the node registers the subscription with BeeL and stores the signing secret. Deactivating deletes it. If the URL or the event list drifts, the next activation realigns the subscription without losing the secret.

Events: `invoice.issued`, `invoice.email.sent`, `invoice.voided`, `verifactu.status.updated`, `recurring_invoice.paused`, `account.claimed`, `company.created`, `representation.signed`.

A subscription belongs to the account, not to a company, so on a multi-NIF account one trigger receives the events of every NIF — filter on the payload if you only want one.

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

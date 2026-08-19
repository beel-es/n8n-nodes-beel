# Changelog

## 0.2.0

Migration to the company-scoped API. **Breaking**: BeeL retired the flat routes
and the `Beel-Active-Company` header, so every request now carries the company
in its path. Workflows keep working, but a company is no longer optional and a
few operations were merged to match the contract.

### The scope moved into the path

The API used to take the active company in a `Beel-Active-Company` header. The
contract retired it — `{company_id}` in the path is now the only source of
context, and the account that owns it is derived from it. The whole flat
surface (`/v1/invoices`, `/v1/customers`, `/v1/products`,
`/v1/configuration/*`, `/v1/webhooks`) is marked `deprecated: true`.

The node was still calling all of it, sending a header the server no longer
reads. Nothing failed loudly: requests simply resolved to whichever company the
key defaulted to, which on a multi-NIF account is the wrong NIF.

- Every operation now targets `/v1/companies/{company_id}/…`, filled in from the
  node's **Company** field or the credential's **Default Company ID**.
- Account-level resources (the company list, webhook subscriptions) target
  `/v1/accounts/{account_id}/…`, with the account resolved once per credential
  from `/v1/me/identity`.
- **A company is now required.** A request that would have gone out unscoped
  fails in n8n with what to set, instead of billing under the wrong NIF.

### Operations that changed shape

- **Invoice → Set Status** replaces *Mark as Paid*, *Mark as Sent* and *Revert to
  Issued*: one `PUT .../status`, as the contract models it. Issuing and voiding
  stay separate — they are fiscal acts, not statuses.
- **Invoice → Schedule** both schedules and reschedules; *Reschedule* is gone.
  *Unschedule* is the `DELETE` on the same sub-resource.
- **Recurring Invoice → Set Status** replaces *Pause* and *Resume*.
- **Recurring Invoice → Get Next Occurrence** replaces *Preview*.
- **Product → Search** is gone: search is the `Search Query` filter on *Get Many*,
  which returns at least the same results in the paginated envelope.
- **Series** gains *Get Defaults* and *Ensure Defaults*.
- **Invoice → Convert Proforma** and the exemption reasons `EXENTA_ART_21`,
  `EXENTA_ART_22`, `EXENTA_ART_24` and `NO_SUJETA_LOCALIZACION` are new; the old
  `EXENTA_ART_21_24` was split into one member per article.
- **Trigger**: the Company field is gone. Webhook subscriptions belong to the
  account, so one trigger receives the events of every NIF — filter on the
  payload if you only want one. The previous field would have silently done
  nothing.
- **Credential test** now calls `/v1/me/identity` instead of a company-scoped
  resource, so a valid key no longer fails the test over an unset company.

### Operations for platforms

The first cut of this migration exposed only what a self-employed user does for
their own invoicing, and pushed account provisioning and payment integrations
to "that is the dashboard". For a gestoría, a SaaS or a marketplace invoicing on
behalf of others, the dashboard is precisely what does not scale: they do these
things hundreds of times, by API. Fifteen operations come back:

- **Account** — Provision (idempotent by `external_ref`), Get, Get Many, Get
  Usage, Create Claim Token. Claim tokens expire after 30 days and re-issuing
  invalidates the previous one, so re-sending them belongs in a schedule.
- **Payment Connection** — Get Many, Initiate (the white-label authorization a
  managed NIF's holder completes to connect Stripe), Disconnect.
- **Payment Event** — Get Many, Get, Retry, Generate Draft. BeeL emits **no
  webhook** when automatic invoicing fails and the list takes no server-side
  filter, so a charge that produced no invoice is only findable by sweeping this
  collection for `needs_action`. That is a compliance hole a workflow can close
  and a dashboard cannot.
- **Company** — Get Issuing Readiness (whether the NIF can issue right now and
  what is missing if not, the gate an onboarding flow checks), Get Stats,
  Get Fiscal Summary.

Still out, now on a stated criterion — expose what a platform repeats by API,
keep out genuine one-off configuration: branding and template customisation,
team members and invitations, request/email logs, and ending or re-levelling the
management of a provisioned account (destructive over someone else's fiscal
data, and rare).

### New: the Account field

`{account_id}` used to resolve only from the API key, which quietly made every
account-scoped operation unable to reach anything but your own account — and the
contract is explicit that it "may be your own account or an account you
provisioned". There is now an **Account** field beside **Company**, with the same
rule: what the node names wins, empty falls back to the key's own account. The
Company dropdown follows whichever account is selected.

### So this cannot happen again

The node ran on deprecated routes for a whole release and nothing said so. The
generator now fails the build when it does:

- `npm run generate` and `generate:check` **reject any endpoint the contract
  marks `deprecated: true`**, naming the ones to migrate.
- Deprecated endpoints are excluded from the coverage check by that same flag,
  instead of ~90 identifiers listed by hand that would go stale at sunset.
- Stale entries in `EXCLUDED_OPERATION_IDS` are reported, so the list self-cleans.
- Paths used by hand-written code (dropdowns, identity, the Trigger's
  subscription, the file operations) are emitted from the contract into
  `CONTRACT_PATHS`. No URL is typed into a `.ts` file any more, so a retired
  route breaks generation rather than 404ing at runtime.
- The scoping rule lives in one module (`nodes/Beel/scope.ts`) read by both the
  generator and the request helper, with a test asserting every placeholder is
  either a rendered field or a scope.

## 0.1.5

Fixes against the current API contract (multi-NIF migration) and n8n's
verification scanner:

- **Company dropdown fixed**: the flat `GET /v1/companies` was retired from the
  contract, so the selector showed "Error fetching options from BeeL". It now
  resolves the credential's `account_id` via `/v1/me/identity` (memoized per
  credential) and lists `/v1/accounts/{account_id}/companies`.
- **Trigger events fixed**: `invoice.emitted` and `invoice.cancelled` no longer
  exist — the API rejected them and the trigger could not activate. The catalog
  now mirrors the current enum and adds the new events (`invoice.issued`,
  `invoice.voided`, `recurring_invoice.paused`, `account.claimed`,
  `company.created`, `representation.signed`).
- **Rate limits respected**: 429 responses are retried honouring `Retry-After`
  (up to 3 attempts), so a long "Return All" no longer dies mid-pagination.
- **n8n verification**: removed `usableAsTool` from the trigger node
  (`@n8n/community-nodes/node-usable-as-tool` fails the published package).


## 0.1.4

The rest of the Spanish that reached the editor, and a check so it cannot come
back:

- Address Street: `123 Main Street` instead of `Calle Mayor, 123`
- Legal Name: `My Company Ltd` instead of `Mi Empresa SL`
- Exemption Reason: all 15 options relabelled in English, keeping the statute
  they cite — `OTRO` now reads `Other`, `EXENTA_ART_20` reads
  `Exempt — Art. 20 LIVA`. The values sent to the API are unchanged.

UI copy now lives in one module, `scripts/ui-text.ts`, which also holds
`assertEnglishUiText`: generation fails, in CI too, if any string shown in the
editor is not English. The contract is vendored from BeeL's API repo and its
examples are legitimately Spanish, so a re-sync would otherwise quietly undo
these fixes.

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

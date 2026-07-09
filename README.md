# Mammaly

A Next.js web app that emulates a mobile pet-care application in the browser.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
```

Static files are exported to the `out/` directory for Cloudflare Pages.

## Auto-deploy (GitHub Actions)

Every push to `main` triggers a deploy to Cloudflare Pages via `.github/workflows/deploy.yml`.

### Required GitHub secrets

| Secret | Description |
|---|---|
| `CLOUDFLARE_API_TOKEN` | API token with **Account → Cloudflare Pages → Edit** |
| `CLOUDFLARE_ACCOUNT_ID` | Account ID from **Workers & Pages → Overview** |

### Create the Pages project (first time only)

Before the first workflow run, create the project in Cloudflare:

```bash
npx wrangler pages project create mammaly --production-branch=main
```

Or run `terraform apply` in the `terraform/` directory.

## Terraform

Infrastructure config for Cloudflare Pages lives in `terraform/`. See `terraform/terraform.tfvars.example`.

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# fill in values, then:
terraform init
terraform apply
```

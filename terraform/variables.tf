variable "cloudflare_api_token" {
  description = "Cloudflare API token with Pages permissions (and DNS if using a custom domain)"
  type        = string
  sensitive   = true
}

variable "cloudflare_account_id" {
  description = "Account ID from Cloudflare Dashboard → Workers & Pages → Overview"
  type        = string
}

variable "project_name" {
  description = "Cloudflare Pages project name"
  type        = string
  default     = "mammaly"
}

variable "production_branch" {
  description = "Branch used for production deployments"
  type        = string
  default     = "main"
}

variable "node_version" {
  description = "Node.js version for Cloudflare Pages builds"
  type        = string
  default     = "20"
}

# --- Git integration (optional) ---

variable "enable_git_source" {
  description = "Connect a GitHub repository for deploy-on-push via Cloudflare Pages"
  type        = bool
  default     = true
}

variable "github_owner" {
  description = "GitHub organization or username (e.g. my-org)"
  type        = string
  default     = ""
}

variable "github_repo_name" {
  description = "Repository name (e.g. mammaly-hackaton-2)"
  type        = string
  default     = ""
}

# --- Custom domain (optional) ---

variable "custom_domain" {
  description = "Custom domain for Pages (e.g. app.example.com). Leave empty to use *.pages.dev only"
  type        = string
  default     = ""
}

variable "zone_id" {
  description = "Cloudflare zone ID (required for custom domain DNS record)"
  type        = string
  default     = ""
}

variable "dns_record_name" {
  description = "CNAME record name (subdomain). E.g. app for app.example.com"
  type        = string
  default     = ""
}

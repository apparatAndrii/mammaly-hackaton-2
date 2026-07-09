variable "cloudflare_api_token" {
  description = "Cloudflare API Token с правами на Pages (и DNS, если подключаете свой домен)"
  type        = string
  sensitive   = true
}

variable "cloudflare_account_id" {
  description = "Account ID из Cloudflare Dashboard → Workers & Pages → Overview"
  type        = string
}

variable "project_name" {
  description = "Имя проекта в Cloudflare Pages"
  type        = string
  default     = "mammaly"
}

variable "production_branch" {
  description = "Ветка для production-деплоев"
  type        = string
  default     = "main"
}

variable "node_version" {
  description = "Версия Node.js для сборки на Cloudflare Pages"
  type        = string
  default     = "20"
}

# --- Git-интеграция (опционально) ---

variable "enable_git_source" {
  description = "Подключить GitHub-репозиторий для автодеплоя при push"
  type        = bool
  default     = true
}

variable "github_owner" {
  description = "GitHub org или username (например: my-org)"
  type        = string
  default     = ""
}

variable "github_repo_name" {
  description = "Имя репозитория (например: mammaly-hackaton-2)"
  type        = string
  default     = ""
}

# --- Кастомный домен (опционально) ---

variable "custom_domain" {
  description = "Кастомный домен для Pages (например: app.example.com). Пусто — только *.pages.dev"
  type        = string
  default     = ""
}

variable "zone_id" {
  description = "Zone ID домена в Cloudflare (нужен для DNS-записи кастомного домена)"
  type        = string
  default     = ""
}

variable "dns_record_name" {
  description = "Имя CNAME-записи (поддомен). Например: app для app.example.com"
  type        = string
  default     = ""
}

output "pages_project_name" {
  description = "Имя проекта Cloudflare Pages"
  value       = cloudflare_pages_project.mammaly.name
}

output "pages_url" {
  description = "URL production-деплоя на *.pages.dev"
  value       = "https://${cloudflare_pages_project.mammaly.subdomain}.pages.dev"
}

output "pages_subdomain" {
  description = "Поддомен Cloudflare Pages (для CNAME)"
  value       = cloudflare_pages_project.mammaly.subdomain
}

output "custom_domain" {
  description = "Кастомный домен (если задан)"
  value       = var.custom_domain != "" ? "https://${var.custom_domain}" : null
}

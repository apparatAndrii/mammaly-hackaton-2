output "pages_project_name" {
  description = "Cloudflare Pages project name"
  value       = cloudflare_pages_project.mammaly.name
}

output "pages_url" {
  description = "Production deployment URL on *.pages.dev"
  value       = "https://${cloudflare_pages_project.mammaly.subdomain}.pages.dev"
}

output "pages_subdomain" {
  description = "Cloudflare Pages subdomain (for CNAME)"
  value       = cloudflare_pages_project.mammaly.subdomain
}

output "custom_domain" {
  description = "Custom domain URL (if configured)"
  value       = var.custom_domain != "" ? "https://${var.custom_domain}" : null
}

locals {
  git_source_enabled = var.enable_git_source && var.github_owner != "" && var.github_repo_name != ""
}

resource "cloudflare_pages_project" "mammaly" {
  account_id        = var.cloudflare_account_id
  name              = var.project_name
  production_branch = var.production_branch

  build_config = {
    build_command   = "npm ci && npm run build"
    destination_dir = "out"
    root_dir        = ""
    build_caching   = true
  }

  deployment_configs = {
    production = {
      compatibility_date  = "2026-01-01"
      compatibility_flags = ["nodejs_compat"]
      env_vars = {
        NODE_VERSION = {
          type  = "plain_text"
          value = var.node_version
        }
      }
    }
    preview = {
      compatibility_date = "2026-01-01"
      env_vars = {
        NODE_VERSION = {
          type  = "plain_text"
          value = var.node_version
        }
      }
    }
  }

  source = local.git_source_enabled ? {
    type = "github"
    config = {
      owner                          = var.github_owner
      repo_name                      = var.github_repo_name
      production_branch              = var.production_branch
      production_deployments_enabled = true
      preview_deployment_setting     = "all"
      deployments_enabled            = true
      pr_comments_enabled            = true
    }
  } : null
}

resource "cloudflare_pages_domain" "custom" {
  count = var.custom_domain != "" ? 1 : 0

  account_id   = var.cloudflare_account_id
  project_name = cloudflare_pages_project.mammaly.name
  name         = var.custom_domain
}

resource "cloudflare_dns_record" "pages_cname" {
  count = var.custom_domain != "" && var.zone_id != "" && var.dns_record_name != "" ? 1 : 0

  zone_id = var.zone_id
  name    = var.dns_record_name
  content = "${cloudflare_pages_project.mammaly.subdomain}.pages.dev"
  type    = "CNAME"
  proxied = true
  ttl     = 1
}

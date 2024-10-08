import configuration from "@/config/configuration.json";

export const ACCEPT_JSON = {
  accept: 'application/json',
}

export const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const PROXIED_API_URL = SITE_URL + '/api/bff';
export const SESSION_AGE = configuration.session_age
export const ORG_COOKIE_NAME = configuration.org_cookie_key
export const PROJECT_COOKIE_NAME = configuration.project_cookie_key

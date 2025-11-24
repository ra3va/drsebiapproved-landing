-- Make refresh_token nullable temporarily to handle Zoho's OAuth quirk
-- Zoho sometimes doesn't return refresh token on subsequent authorizations
ALTER TABLE zoho_oauth_tokens 
ALTER COLUMN refresh_token DROP NOT NULL;

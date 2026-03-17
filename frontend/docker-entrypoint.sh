#!/bin/sh
set -e

# Inject runtime config into the served frontend
# REACT_APP_API_URL is set by Aspire at container start time
# Upgrade http to https for Azure Container Apps
API_URL="${REACT_APP_API_URL:-}"
API_URL=$(echo "$API_URL" | sed 's|^http://|https://|')

cat <<EOF > /usr/share/nginx/html/runtime-config.js
window.__RUNTIME_CONFIG__ = {
  API_URL: "${API_URL}"
};
EOF

exec "$@"

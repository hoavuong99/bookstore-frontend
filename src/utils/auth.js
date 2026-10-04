const decodeBase64Url = (value) => {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(base64 + padding);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));

  return new TextDecoder().decode(bytes);
};

export const getTokenPayload = (token) => {
  if (typeof token !== "string") {
    return null;
  }

  const [, payload, signature] = token.split(".");
  if (!payload || !signature) {
    return null;
  }

  try {
    const decodedPayload = JSON.parse(decodeBase64Url(payload));
    return typeof decodedPayload === "object" && decodedPayload !== null
      ? decodedPayload
      : null;
  } catch {
    return null;
  }
};

export const isTokenExpired = (payload) =>
  typeof payload?.exp === "number" && payload.exp * 1000 <= Date.now();

export const isAuthenticatedToken = (token) => {
  const payload = getTokenPayload(token);
  return payload !== null && !isTokenExpired(payload);
};

export const isAdminToken = (token) => {
  const payload = getTokenPayload(token);
  return !isTokenExpired(payload) && payload?.role === "ROLE_ADMIN";
};

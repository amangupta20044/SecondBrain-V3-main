const rawHost = import.meta.env.VITE_API_BASE_URL || "https://secondbrain-v3-main.onrender.com";

// Strip trailing slash if present
const host = rawHost.trim().replace(/\/+$/, "");

export const ApiRoutes = {
  signup: `${host}/api/v1/user/signup`,
  signin: `${host}/api/v1/user/signin`,
  contents: `${host}/api/v1/user/contents`,
  alltags: `${host}/api/v1/tag/alltags`,
  createtag: `${host}/api/v1/tag/createtag`,
  create: `${host}/api/v1/content/create`,
  remove: `${host}/api/v1/content/remove`,
  share: `${host}/api/v1/brain/share`,
  shareHexVal: `${host}/api/v1/brain/share/user`,
  summary: `${host}/api/v1/content/summarize`,
  search: `${host}/api/v1/content/search`,
};
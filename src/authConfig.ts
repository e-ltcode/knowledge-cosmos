import { Configuration, PopupRequest, RedirectRequest } from "@azure/msal-browser";

// MSAL configuration
export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.REACT_APP_CLIENT_ID || "your-client-id-here", // Replace with your client ID
    authority: process.env.REACT_APP_AUTHORITY || "https://login.microsoftonline.com/common",
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

// API base URL - configured via environment variables
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || process.env.REACT_APP_API_URL || "https://localhost:7001/api";

// Protected resources configuration
export const protectedResources = {
  KnowledgeAPI: {
    // Traditional endpoints
    endpointCategory: `${API_BASE_URL}/Category`,
    endpointCategoryRow: `${API_BASE_URL}/CategoryRow`, 
    endpointQuestion: `${API_BASE_URL}/Question`,
    endpointQuestionAnswer: `${API_BASE_URL}/QuestionAnswer`,
    endpointGroup: `${API_BASE_URL}/Group`,
    endpointShortGroup: `${API_BASE_URL}/ShortGroup`,
    endpointAnswer: `${API_BASE_URL}/Answer`,
    endpointHistory: `${API_BASE_URL}/History`,
    endpointHistoryFilter: `${API_BASE_URL}/HistoryFilter`,
    
    // Vector search endpoints
    endpointVectorSearch: `${API_BASE_URL}/search/hybrid`,
    endpointSearchSuggestions: `${API_BASE_URL}/search/suggestions`,
    endpointSearchFeedback: `${API_BASE_URL}/search/feedback`,
    endpointVectorStats: `${API_BASE_URL}/vectorsearch/stats`,
    endpointVectorHealth: `${API_BASE_URL}/vectorsearch/health`,
    
    scopes: {
      read: [process.env.REACT_APP_API_SCOPE || "api://your-api-scope/read"],
      write: [process.env.REACT_APP_API_SCOPE || "api://your-api-scope/write"],
    },
  },
};

// Login request configuration
export const loginRequest: RedirectRequest | PopupRequest = {
  scopes: protectedResources.KnowledgeAPI.scopes.read,
};
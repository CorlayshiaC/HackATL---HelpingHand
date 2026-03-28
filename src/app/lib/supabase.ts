import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '/utils/supabase/info';

const supabaseUrl = `https://${projectId}.supabase.co`;

export const supabase = createClient(supabaseUrl, publicAnonKey);

export const apiUrl = `${supabaseUrl}/functions/v1`;

// For endpoints that don't require authentication (viewing campaigns, quiz matching)
export async function fetchPublic(endpoint: string, options: RequestInit = {}) {
  const fullUrl = `${apiUrl}/make-server-0f0fb175${endpoint}`;
  console.log('Fetching (public):', fullUrl);
  
  const response = await fetch(fullUrl, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Request failed:', response.status, errorText);
    let errorMessage = 'Request failed';
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.error || errorMessage;
    } catch (e) {
      errorMessage = errorText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

// For endpoints that require authentication (donations, user actions)
export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError || !session?.access_token) {
    console.error('No valid session found for authenticated request');
    throw new Error('Authentication required. Please sign in.');
  }
  
  const token = session.access_token;
  
  const fullUrl = `${apiUrl}/make-server-0f0fb175${endpoint}`;
  console.log('Fetching (authenticated):', fullUrl);
  
  const response = await fetch(fullUrl, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Authenticated request failed:', response.status, errorText);
    let errorMessage = 'Request failed';
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.error || errorMessage;
    } catch (e) {
      errorMessage = errorText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}
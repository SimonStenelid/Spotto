export interface CredentialResponse {
  credential: string;
  select_by: string;
  client_id: string;
}

export interface GoogleAccountsId {
  initialize: (config: {
    client_id: string;
    callback: (response: CredentialResponse) => void;
    auto_select?: boolean;
    cancel_on_tap_outside?: boolean;
  }) => void;
  prompt: () => void;
  renderButton: (
    element: HTMLElement,
    config: {
      type?: string;
      theme?: string;
      size?: string;
      text?: string;
      shape?: string;
    }
  ) => void;
}

export interface Google {
  accounts: {
    id: GoogleAccountsId;
  };
}

declare global {
  interface Window {
    google: Google;
  }
} 
interface CredentialResponse {
  credential: string;
  select_by: string;
}

interface GsiButtonConfiguration {
  type: 'standard' | 'icon';
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  size?: 'large' | 'medium' | 'small';
  text?: string;
  shape?: 'rectangular' | 'pill' | 'circle' | 'square';
  logo_alignment?: 'left' | 'center';
  width?: string;
  local?: string;
}

interface PromptMomentNotification {
  isDisplayMoment: () => boolean;
  isDisplayed: () => boolean;
  isNotDisplayed: () => boolean;
  getNotDisplayedReason: () => string;
  isSkippedMoment: () => boolean;
  isDismissedMoment: () => boolean;
  getMomentType: () => string;
}

interface GoogleAccountsId {
  initialize: (config: {
    client_id: string;
    callback: (response: CredentialResponse) => void;
    nonce?: string;
    context?: string;
    prompt_parent_id?: string;
    use_fedcm_for_prompt?: boolean;
  }) => void;
  prompt: (notification?: (notification: PromptMomentNotification) => void) => void;
  renderButton: (
    parent: HTMLElement,
    config: GsiButtonConfiguration,
    clickHandler?: () => void
  ) => void;
  disableAutoSelect: () => void;
  storeCredential: (credential: { id: string; password: string }, callback: () => void) => void;
  cancel: () => void;
  onGoogleLibraryLoad: () => void;
}

interface GoogleAccounts {
  id: GoogleAccountsId;
}

interface Google {
  accounts: GoogleAccounts;
}

declare global {
  interface Window {
    google: Google;
  }
} 
import { CredentialResponse } from './google-one-tap';

interface Window {
  google: {
    accounts: {
      id: {
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
      };
    };
  };
} 
// src/utils/deeplinkhandler.ts
import * as Linking from 'expo-linking';
import { auth, functions } from '../firebaseConfig';
import { httpsCallable } from 'firebase/functions';
export interface DeepLinkParams {
  uid?: string;
  amount?: string;
  receiver?: string;
  action?: string;
}
export const parseDeepLink = (url: string): DeepLinkParams | null => {
  try {
    const parsed = Linking.parse(url) as any;
    if (!parsed) return null;
    if (parsed.scheme === 'moneyapp' || parsed.scheme === 'goldappblock') {
      if (parsed.path === 'verify-transaction') {
        return {
          uid: parsed.params?.uid,
          amount: parsed.params?.amount,
          receiver: parsed.params?.receiver,
          action: 'verify-transaction'
        };
      }
    }
    if (parsed.hostname === 'money-vault.firebaseapp.com') {
      return {
        uid: parsed.queryParams?.uid,
        amount: parsed.queryParams?.amount,
        receiver: parsed.queryParams?.receiver,
        action: 'verify-transaction'
      };
    }

    return null;
  } catch (error) {
    console.error('Error parsing deep link:', error);
    return null;
  }
};
export const handleMagicLinkVerification = async (params: DeepLinkParams) => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User context not authenticated inside application execution.');
    }

    if (!params.uid || !params.amount || !params.receiver) {
      throw new Error('Invalid verification parameters captured from url link.');
    }

    if (!functions) {
      throw new Error('Firebase functions instances are not initialized properly.');
    }
    const verifyMagicLink = httpsCallable(functions, 'verifyMagicLink');
    
    const response = await verifyMagicLink({
      uid: params.uid,
      amount: parseFloat(params.amount),
      receiver: params.receiver
    });
    return {
      success: true,
      data: response.data,
      message: 'Transaction successfully processed via magic link action!'
    };
  } catch (error: any) {
    console.error('Magic link verification runtime error:', error);
    return {
      success: false,
      error: error?.message || 'Verification pipeline process failed.'
    };
  }
};

/**
 * Setup deep link background state listeners for the application navigation router
 */
export const setupDeepLinkListener = (navigation: any) => {
  const handleDeepLink = ({ url }: { url: string }) => {
    const params = parseDeepLink(url);
    
    if (params && params.action === 'verify-transaction') {
      navigation.navigate('TransactionVerify', {
        receiverName: params.receiver || 'User Transaction Target',
        amount: params.amount || '0.00',
        deepLinkParams: params,
        fromMagicLink: true
      });
    }
  };

  const unsubscribe = Linking.addEventListener('url', handleDeepLink);

  Linking.getInitialURL().then((url) => {
    if (url != null) {
      handleDeepLink({ url });
    }
  });

  return unsubscribe;
};

export default {
  parseDeepLink,
  handleMagicLinkVerification,
  setupDeepLinkListener
};
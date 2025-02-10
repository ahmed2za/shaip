import { loadStripe } from '@stripe/stripe-js';
import axios from './axios';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export const createSubscriptionCheckout = async (priceId: string) => {
  try {
    const { data: session } = await axios.post('/api/subscribe', { priceId });
    
    const stripe = await stripePromise;
    if (!stripe) throw new Error('Stripe failed to initialize');

    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      throw new Error(result.error.message);
    }
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
};

export const getSubscriptionStatus = async (subscriptionId: string) => {
  try {
    const { data } = await axios.get(`/api/subscriptions/${subscriptionId}`);
    return data;
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    throw error;
  }
};

import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { priceId } = req.body;

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email! },
      include: { company: true },
    });

    if (!user?.company) {
      return res.status(400).json({ error: 'Company profile not found' });
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXTAUTH_URL}/dashboard/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/subscription/canceled`,
      customer_email: user.email,
      metadata: {
        companyId: user.company.id,
        userId: user.id,
      },
    });

    return res.status(200).json({ id: checkoutSession.id });
  } catch (error) {
    console.error('Subscription error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

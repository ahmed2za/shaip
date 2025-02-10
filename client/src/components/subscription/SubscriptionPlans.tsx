import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { createSubscriptionCheckout } from '@/utils/stripe';
import { useSession } from 'next-auth/react';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  priceId: string;
  features: PlanFeature[];
  isPopular?: boolean;
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'الباقة المجانية',
    price: 0,
    priceId: '',
    features: [
      { text: 'إضافة شركة واحدة', included: true },
      { text: 'عرض محدود للإعلانات', included: true },
      { text: 'دعم أساسي', included: true },
      { text: 'تحليلات محدودة', included: false },
      { text: 'ميزات متقدمة', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'الباقة الاحترافية',
    price: 299,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID!,
    features: [
      { text: 'إضافة شركات غير محدودة', included: true },
      { text: 'عرض غير محدود للإعلانات', included: true },
      { text: 'دعم متميز على مدار الساعة', included: true },
      { text: 'تحليلات متقدمة', included: true },
      { text: 'جميع الميزات المتقدمة', included: true },
    ],
    isPopular: true,
  },
];

export const SubscriptionPlans: React.FC = () => {
  const { data: session } = useSession();

  const handleSubscribe = async (priceId: string) => {
    if (!session) {
      // Redirect to login
      window.location.href = '/auth/login';
      return;
    }

    try {
      await createSubscriptionCheckout(priceId);
    } catch (error) {
      console.error('Subscription error:', error);
      // Handle error (show notification, etc.)
    }
  };

  return (
    <Grid container spacing={4} justifyContent="center" sx={{ py: 4 }}>
      {plans.map((plan) => (
        <Grid item xs={12} md={6} lg={4} key={plan.id}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              ...(plan.isPopular && {
                borderColor: 'primary.main',
                borderWidth: 2,
                borderStyle: 'solid',
              }),
            }}
          >
            {plan.isPopular && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  px: 2,
                  py: 0.5,
                  borderRadius: 1,
                }}
              >
                الأكثر شعبية
              </Box>
            )}
            <CardHeader
              title={plan.name}
              titleTypographyProps={{ align: 'center', variant: 'h5' }}
              sx={{ pb: 0 }}
            />
            <CardContent sx={{ pt: 0, flexGrow: 1 }}>
              <Box sx={{ textAlign: 'center', my: 2 }}>
                <Typography component="h2" variant="h3">
                  {plan.price === 0 ? 'مجاناً' : `${plan.price} ر.س`}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  /شهرياً
                </Typography>
              </Box>
              <List sx={{ mb: 2 }}>
                {plan.features.map((feature, index) => (
                  <ListItem key={index} sx={{ py: 1 }}>
                    <ListItemIcon>
                      <CheckCircleOutlineIcon
                        color={feature.included ? 'primary' : 'disabled'}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={feature.text}
                      sx={{
                        opacity: feature.included ? 1 : 0.5,
                      }}
                    />
                  </ListItem>
                ))}
              </List>
              <Button
                fullWidth
                variant={plan.isPopular ? 'contained' : 'outlined'}
                onClick={() => plan.priceId && handleSubscribe(plan.priceId)}
                disabled={!plan.priceId}
              >
                {plan.price === 0 ? 'ابدأ الآن' : 'اشترك الآن'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default SubscriptionPlans;

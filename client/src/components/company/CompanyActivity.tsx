import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, Paper } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import RateReviewIcon from '@mui/icons-material/RateReview';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MergeTypeIcon from '@mui/icons-material/MergeType';

interface CompanyActivityProps {
  verified: boolean;
  responseRate: number;
  responsesWithin24h: boolean;
  premiumFeatures: boolean;
  profileMerged: boolean;
}

export default function CompanyActivity({ 
  verified,
  responseRate,
  responsesWithin24h,
  premiumFeatures,
  profileMerged
}: CompanyActivityProps) {
  return (
    <Paper elevation={0} sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        نشاط الشركة
      </Typography>
      
      <List sx={{ width: '100%' }}>
        {verified && (
          <ListItem>
            <ListItemIcon>
              <VerifiedIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="حساب موثق"
              sx={{ '& .MuiListItemText-primary': { textAlign: 'right' } }}
            />
          </ListItem>
        )}

        <ListItem>
          <ListItemIcon>
            <RateReviewIcon />
          </ListItemIcon>
          <ListItemText 
            primary="يطلب التقييمات - إيجابية وسلبية"
            sx={{ '& .MuiListItemText-primary': { textAlign: 'right' } }}
          />
        </ListItem>

        {premiumFeatures && (
          <ListItem>
            <ListItemIcon>
              <WorkspacePremiumIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="يدفع مقابل الميزات الإضافية"
              sx={{ '& .MuiListItemText-primary': { textAlign: 'right' } }}
            />
          </ListItem>
        )}

        <ListItem>
          <ListItemIcon>
            <QuestionAnswerIcon />
          </ListItemIcon>
          <ListItemText 
            primary={`يرد على ${responseRate}% من التقييمات السلبية`}
            sx={{ '& .MuiListItemText-primary': { textAlign: 'right' } }}
          />
        </ListItem>

        {responsesWithin24h && (
          <ListItem>
            <ListItemIcon>
              <AccessTimeIcon />
            </ListItemIcon>
            <ListItemText 
              primary="يرد على التقييمات السلبية خلال 24 ساعة"
              sx={{ '& .MuiListItemText-primary': { textAlign: 'right' } }}
            />
          </ListItem>
        )}

        {profileMerged && (
          <ListItem>
            <ListItemIcon>
              <MergeTypeIcon />
            </ListItemIcon>
            <ListItemText 
              primary="تم دمج الملف الشخصي والتقييمات"
              sx={{ '& .MuiListItemText-primary': { textAlign: 'right' } }}
            />
          </ListItem>
        )}
      </List>
    </Paper>
  );
}

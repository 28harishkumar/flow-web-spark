import WelcomeMessage from "./WelcomeMessage";
import SpecialOffer from "./SpecialOffer";
import FeatureAnnouncement from "./FeatureAnnouncement";
import FeedbackCampaign from "./FeedbackCampaign";
import SurveyCampaign from "./SurveyCampaign";
import NewsletterCampaign from "./NewsletterCampaign";
import SocialSharingCampaign from "./SocialSharingCampaign";
import CountdownCampaign from "./CountdownCampaign";

export const templates = {
  welcome_campaign: WelcomeMessage,
  promotional_campaign: SpecialOffer,
  product_announcement: FeatureAnnouncement,
  feedback_campaign: FeedbackCampaign,
  survey_campaign: SurveyCampaign,
  newsletter_campaign: NewsletterCampaign,
  social_sharing_campaign: SocialSharingCampaign,
  countdown_campaign: CountdownCampaign,
};

export {
  WelcomeMessage,
  SpecialOffer,
  FeatureAnnouncement,
  FeedbackCampaign,
  SurveyCampaign,
  NewsletterCampaign,
  SocialSharingCampaign,
  CountdownCampaign,
};

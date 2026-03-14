import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
}

const SEO: React.FC<SEOProps> = ({ title, description }) => {
  const location = useLocation();
  const baseTitle = "BidsnBuy | Nigeria's Premier Auction & E-commerce Platform";
  const baseDescription = "Bid, Win, and Buy Now on BidsnBuy. Nigeria's most trusted auction house for premium electronics, luxury items, and warehouse deals.";

  useEffect(() => {
    // Update Title
    document.title = title ? `${title} | BidsnBuy` : baseTitle;

    // Update Meta Description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description || baseDescription);
    }

    // Update Open Graph Title
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title ? `${title} | BidsnBuy` : baseTitle);
    }

    // Update Open Graph Description
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', description || baseDescription);
    }

    // Update Twitter Title
    const twitterTitle = document.querySelector('meta[property="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', title ? `${title} | BidsnBuy` : baseTitle);
    }

    // Update Twitter Description
    const twitterDescription = document.querySelector('meta[property="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute('content', description || baseDescription);
    }

  }, [title, description, location.pathname]);

  return null;
};

export default SEO;

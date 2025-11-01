export const formatSalary = (min: number | null, max: number | null, currency: string = 'INR'): string => {
  if (!min && !max) return 'Not disclosed';

  const currencySymbol = currency === 'INR' ? '₹' : '$';

  const formatAmount = (amount: number): string => {
    if (amount >= 10000000) {
      return `${(amount / 10000000).toFixed(1)}Cr`;
    }
    if (amount >= 100000) {
      return `${(amount / 100000).toFixed(1)}L`;
    }
    return amount.toLocaleString();
  };

  if (min && max) {
    return `${currencySymbol}${formatAmount(min)} - ${currencySymbol}${formatAmount(max)}`;
  }

  if (min) {
    return `${currencySymbol}${formatAmount(min)}+`;
  }

  return `Up to ${currencySymbol}${formatAmount(max!)}`;
};

export const formatDate = (date: string): string => {
  const now = new Date();
  const postDate = new Date(date);
  const diffInMs = now.getTime() - postDate.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
};

export const formatApplicationCount = (count: number): string => {
  if (count === 0) return 'No applications yet';
  if (count === 1) return '1 application';
  if (count < 10) return `${count} applications`;
  if (count < 50) return '10+ applications';
  if (count < 100) return '50+ applications';
  return '100+ applications';
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

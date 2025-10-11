export const pageHorizantalPadding = 'm';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'How to add products?',
    answer: 'To add products, go to the menu section, tap the "+" button, fill in the product details including name, price, description, and upload an image. Make sure all required fields are completed before saving.',
  },
  {
    id: '2',
    question: 'How to edit a product?',
    answer: 'To edit a product, navigate to the menu section, find the product you want to edit, tap on it, and then tap the edit button. You can modify any details and save your changes.',
  },
  {
    id: '3',
    question: 'How to remove a product?',
    answer: 'To remove a product, go to the menu section, find the product you want to delete, tap on it, and select the delete option. Confirm the deletion to permanently remove the product.',
  },
  {
    id: '4',
    question: 'Where to get customer details',
    answer: 'Customer details can be found in the orders section. Tap on any order to view the customer information including name, contact details, and order history.',
  },
  {
    id: '5',
    question: 'How to connect with shozila?',
    answer: 'To connect with Shozila, go to the support section and select "Contact Support". You can reach out via email, phone, or live chat during business hours.',
  },
  {
    id: '6',
    question: 'How to get sales report analysis?',
    answer: 'Sales reports can be accessed from the dashboard. Navigate to the analytics section where you can view daily, weekly, monthly, and yearly sales reports with detailed breakdowns.',
  },
  {
    id: '7',
    question: 'What is sales summary?',
    answer: 'Sales summary provides an overview of your business performance including total revenue, number of orders, average order value, and growth trends over selected time periods.',
  },
  {
    id: '8',
    question: 'How to solve customer Problems?',
    answer: 'To solve customer problems, first listen to their concerns, understand the issue, and provide appropriate solutions. Use the support system to track and resolve issues efficiently.',
  },
  {
    id: '9',
    question: 'How can I reject customer product?',
    answer: 'To reject a customer product order, go to the orders section, select the specific order, and use the reject option. Provide a reason for rejection and notify the customer accordingly.',
  },
];

export const supportCategories = [
  'Technical Issue',
  'Account Problem',
  'Payment Issue',
  'Order Problem',
  'General Inquiry',
  'Feature Request',
  'Bug Report',
  'Account Verification',
  'Password Reset',
  'App Performance',
];

export const supportIssueTypes = [
  'App Not Working',
  'Login Problems',
  'Payment Failed',
  'Order Delayed',
  'Missing Items',
  'Wrong Order',
  'Refund Request',
  'Account Locked',
  'App Crashes',
  'Slow Performance',
  'Cannot Place Order',
  'Profile Issues',
  'Notification Problems',
  'Search Not Working',
  'Image Upload Issues',
];
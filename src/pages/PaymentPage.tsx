import React from 'react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';

const PaymentPage: React.FC = () => {
  const initialOptions = {
    clientId: process.env.REACT_APP_PAYPAL_CLIENT_ID ?? '',
    currency: 'INR',
    intent: 'capture',
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <h1>PayPal Integration Example</h1>
      <PayPalButtons
        style={{ layout: 'vertical' }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  currency_code: 'INR',
                  value: '1.00',
                },
              },
            ],
            intent: 'CAPTURE'
          });
        }}
        onApprove={async (data, actions) => {
          if (!actions.order) {
            console.error('Order actions are not available');
            return;
          }

          try {
            const details = await actions.order.capture();
            if (details.payer && details.payer.name) {
              alert('Transaction completed by ' + details.payer.name.given_name);
            } else {
              alert('Transaction completed, but payer details are not available.');
            }
          } catch (error) {
            console.error('Error capturing order:', error);
          }
        }}
        onError={(err) => {
          console.error('PayPal Checkout onError', err);
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PaymentPage;

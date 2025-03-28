// Gift card email templates

/**
 * Generate HTML email template for the gift card buyer
 */
export function getGiftCardCustomerEmailTemplate(giftCardData) {
  const { giftCode, amount, buyerName, recipientName, expiryDate } = giftCardData;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 20px; }
        .header img { max-width: 150px; }
        .content { background-color: #f9f9f9; padding: 20px; border-radius: 5px; }
        .footer { margin-top: 20px; font-size: 12px; text-align: center; color: #666; }
        
        /* Gift Card Styling */
        .gift-card-wrapper { margin: 30px 0; padding: 15px; border-radius: 10px; background-color: #fff; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
        .gift-card { 
          background-color: #222; 
          color: white; 
          padding: 30px 20px; 
          border-radius: 10px; 
          position: relative;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }
        .gift-card-logo { 
          position: absolute; 
          top: 20px; 
          left: 20px; 
          width: 120px; 
        }
        .gift-card-icon {
          display: block;
          width: 100px;
          height: 100px;
          margin: 50px auto 40px;
          background: linear-gradient(135deg, #1976d2, #8e24aa);
          border-radius: 10px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
          position: relative;
        }
        .gift-card-icon::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 60px;
          height: 60px;
          background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHJlY3QgeD0iMyIgeT0iOCIgd2lkdGg9IjE4IiBoZWlnaHQ9IjEyIiByeD0iMiI+PC9yZWN0PjxyZWN0IHg9IjgiIHk9IjQiIHdpZHRoPSI4IiBoZWlnaHQ9IjQiIHJ4PSIxIj48L3JlY3Q+PHBhdGggZD0iTTEyIDE2djQiPjwvcGF0aD48cGF0aCBkPSJNOCAxMnY4Ij48L3BhdGg+PHBhdGggZD0iTTE2IDEydjgiPjwvcGF0aD48L3N2Zz4=");
          background-repeat: no-repeat;
          background-position: center;
          background-size: contain;
        }
        .gift-card-label {
          position: absolute;
          top: 20px;
          right: 20px;
          font-size: 24px;
          font-weight: 300;
          color: #fff;
        }
        .gift-card-company {
          position: absolute;
          bottom: 30px;
          left: 30px;
          font-size: 18px;
          color: #ddd;
        }
        .gift-code { font-size: 20px; font-weight: bold; margin: 20px 0 10px; text-align: center; letter-spacing: 1px; }
        .gift-details { background-color: #f9f9f9; padding: 20px; margin-top: 20px; border-radius: 5px; color: #333; }
        .gift-amount { font-size: 24px; font-weight: bold; text-align: center; margin: 10px 0; color: #333; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Thank You for Your Gift Card Purchase!</h1>
        </div>
        
        <div class="content">
          <p>Dear ${buyerName},</p>
          
          <p>Thank you for purchasing a Maitri Wellness Center gift card. Your gift card details are below:</p>
          
          <div class="gift-card-wrapper">
            <div class="gift-card">
              <img class="gift-card-logo" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAMAAAAOusbgAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAMAUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////3///wvcUmQAAAA/dFJOUwABAgMEBQYHCAkKCwwODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKiwtLi8wMTIzNDU2Nzg5Ojs8PT4/QEFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaW1xdXl9gYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXp7fH1+f4CBgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0tba3uLm6u7y9vr/AwcLDxMXGx8jJysvMzc7P0NHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f5vF+xKAAAACXBIWXMAAA7EAAAOxAGVKw4bAAABWklEQVRoge2a2U4CQRBFOyAgq6CoCO67uO/7huKKG+57/P8XeA0BkhmSoamqnklO3pfOpFOV3JmkJ5kuCQkJCbGU9O2c7c/J0FkbVg33LGEsndl5JJhI57bdC0aOfLF3XmStw9Ue5QZtdywBl3uWsLsYpTOdU7XzNTi5TFCFbQ7LMPbC6pVjYGnuZUTx25TK9T5L7L0L5BbOUG7d5jV8JJR7HMzV2zxJ1xBo2lzVv1FdVlC9stgshKbGZbm7DuTmd+AHFstZEDsG34ihnFzBDzxJ86Nq8qOx/l3g/IqJQVEn4B56FFWGakXF6lOBHEBRdaDW9J7/KNDUh6S37W8EuLV0LX3vYnFTd9Mg8HlzT6FtCKrWvJFALEw/+GHfGYqKH6jAIhDIc1F1aRiIpv/ogsRiB0IgJhEDQbXmkxwIakX1mgdyoJoHuaaPDRTVAcQO/kcOAQkJCQllvAAX03DyAP6HFgAAAABJRU5ErkJggg==" alt="Maitri Logo">
              <span class="gift-card-label">Gift card</span>
              <div class="gift-card-icon"></div>
              <div class="gift-card-company">Maitri Liverpool Ltd.</div>
            </div>
          </div>
          
          <div class="gift-details">
            <p>Gift Card For: <strong>${recipientName}</strong></p>
            <div class="gift-amount">£${parseFloat(amount).toFixed(2)}</div>
            <p>Gift Code:</p>
            <div class="gift-code">${giftCode}</div>
            <p>Valid until: ${new Date(expiryDate).toLocaleDateString()}</p>
          </div>
          
          <p>The recipient will receive a notification about this gift card. They can use the code above when booking services at Maitri Wellness Center.</p>
          
          <p>If you have any questions about your gift card purchase, please contact our support team.</p>
          
          <p>Warm regards,<br>
          Maitri Wellness Center Team</p>
        </div>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} Maitri Wellness Center. All rights reserved.</p>
          <p>This is an automated email, please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate HTML email template for the gift card recipient
 */
export function getGiftCardRecipientEmailTemplate(giftCardData) {
  const { giftCode, amount, buyerName, recipientName, expiryDate } = giftCardData;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 20px; }
        .header img { max-width: 150px; }
        .content { background-color: #f9f9f9; padding: 20px; border-radius: 5px; }
        .footer { margin-top: 20px; font-size: 12px; text-align: center; color: #666; }
        
        /* Gift Card Styling */
        .gift-card-wrapper { margin: 30px 0; padding: 15px; border-radius: 10px; background-color: #fff; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
        .gift-card { 
          background-color: #222; 
          color: white; 
          padding: 30px 20px; 
          border-radius: 10px; 
          position: relative;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }
        .gift-card-logo { 
          position: absolute; 
          top: 20px; 
          left: 20px; 
          width: 120px; 
        }
        .gift-card-icon {
          display: block;
          width: 100px;
          height: 100px;
          margin: 50px auto 40px;
          background: linear-gradient(135deg, #1976d2, #8e24aa);
          border-radius: 10px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
          position: relative;
        }
        .gift-card-icon::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 60px;
          height: 60px;
          background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHJlY3QgeD0iMyIgeT0iOCIgd2lkdGg9IjE4IiBoZWlnaHQ9IjEyIiByeD0iMiI+PC9yZWN0PjxyZWN0IHg9IjgiIHk9IjQiIHdpZHRoPSI4IiBoZWlnaHQ9IjQiIHJ4PSIxIj48L3JlY3Q+PHBhdGggZD0iTTEyIDE2djQiPjwvcGF0aD48cGF0aCBkPSJNOCAxMnY4Ij48L3BhdGg+PHBhdGggZD0iTTE2IDEydjgiPjwvcGF0aD48L3N2Zz4=");
          background-repeat: no-repeat;
          background-position: center;
          background-size: contain;
        }
        .gift-card-label {
          position: absolute;
          top: 20px;
          right: 20px;
          font-size: 24px;
          font-weight: 300;
          color: #fff;
        }
        .gift-card-company {
          position: absolute;
          bottom: 30px;
          left: 30px;
          font-size: 18px;
          color: #ddd;
        }
        .gift-code { font-size: 20px; font-weight: bold; margin: 20px 0 10px; text-align: center; letter-spacing: 1px; }
        .gift-details { background-color: #f9f9f9; padding: 20px; margin-top: 20px; border-radius: 5px; color: #333; }
        .gift-amount { font-size: 24px; font-weight: bold; text-align: center; margin: 10px 0; color: #333; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>You've Received a Gift Card!</h1>
        </div>
        
        <div class="content">
          <p>Dear ${recipientName},</p>
          
          <p>${buyerName} has sent you a gift card for Maitri Wellness Center. Your gift card details are below:</p>
          
          <div class="gift-card-wrapper">
            <div class="gift-card">
              <img class="gift-card-logo" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAMAAAAOusbgAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAMAUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////3///wvcUmQAAAA/dFJOUwABAgMEBQYHCAkKCwwODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKiwtLi8wMTIzNDU2Nzg5Ojs8PT4/QEFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaW1xdXl9gYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXp7fH1+f4CBgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0tba3uLm6u7y9vr/AwcLDxMXGx8jJysvMzc7P0NHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f5vF+xKAAAACXBIWXMAAA7EAAAOxAGVKw4bAAABWklEQVRoge2a2U4CQRBFOyAgq6CoCO67uO/7huKKG+57/P8XeA0BkhmSoamqnklO3pfOpFOV3JmkJ5kuCQkJCbGU9O2c7c/J0FkbVg33LGEsndl5JJhI57bdC0aOfLF3XmStw9Ue5QZtdywBl3uWsLsYpTOdU7XzNTi5TFCFbQ7LMPbC6pVjYGnuZUTx25TK9T5L7L0L5BbOUG7d5jV8JJR7HMzV2zxJ1xBo2lzVv1FdVlC9stgshKbGZbm7DuTmd+AHFstZEDsG34ihnFzBDzxJ86Nq8qOx/l3g/IqJQVEn4B56FFWGakXF6lOBHEBRdaDW9J7/KNDUh6S37W8EuLV0LX3vYnFTd9Mg8HlzT6FtCKrWvJFALEw/+GHfGYqKH6jAIhDIc1F1aRiIpv/ogsRiB0IgJhEDQbXmkxwIakX1mgdyoJoHuaaPDRTVAcQO/kcOAQkJCQllvAAX03DyAP6HFgAAAABJRU5ErkJggg==" alt="Maitri Logo">
              <span class="gift-card-label">Gift card</span>
              <div class="gift-card-icon"></div>
              <div class="gift-card-company">Maitri Liverpool Ltd.</div>
            </div>
          </div>
          
          <div class="gift-details">
            <div class="gift-amount">£${parseFloat(amount).toFixed(2)}</div>
            <p>Gift Code:</p>
            <div class="gift-code">${giftCode}</div>
            <p>Valid until: ${new Date(expiryDate).toLocaleDateString()}</p>
          </div>
          
          <p>You can use this gift card for any services at Maitri Wellness Center. Simply provide the gift code when booking or paying for services.</p>
          
          <p>We look forward to welcoming you soon!</p>
          
          <p>Warm regards,<br>
          Maitri Wellness Center Team</p>
        </div>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} Maitri Wellness Center. All rights reserved.</p>
          <p>This is an automated email, please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate HTML email template for the admin notification
 */
export function getGiftCardAdminEmailTemplate(giftCardData) {
  const { giftCode, amount, buyerName, buyerEmail, recipientName, recipientEmail, orderDate } = giftCardData;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 20px; }
        .content { background-color: #f9f9f9; padding: 20px; border-radius: 5px; }
        .data-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .data-table th, .data-table td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
        .data-table th { background-color: #f2f2f2; }
        .footer { margin-top: 20px; font-size: 12px; text-align: center; color: #666; }
        
        /* Gift Card Styling */
        .gift-card-wrapper { margin: 30px 0; padding: 15px; border-radius: 10px; background-color: #fff; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
        .gift-card { 
          background-color: #222; 
          color: white; 
          padding: 30px 20px; 
          border-radius: 10px; 
          position: relative;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }
        .gift-card-logo { 
          position: absolute; 
          top: 20px; 
          left: 20px; 
          width: 120px; 
        }
        .gift-card-icon {
          display: block;
          width: 100px;
          height: 100px;
          margin: 50px auto 40px;
          background: linear-gradient(135deg, #1976d2, #8e24aa);
          border-radius: 10px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
          position: relative;
        }
        .gift-card-icon::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 60px;
          height: 60px;
          background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHJlY3QgeD0iMyIgeT0iOCIgd2lkdGg9IjE4IiBoZWlnaHQ9IjEyIiByeD0iMiI+PC9yZWN0PjxyZWN0IHg9IjgiIHk9IjQiIHdpZHRoPSI4IiBoZWlnaHQ9IjQiIHJ4PSIxIj48L3JlY3Q+PHBhdGggZD0iTTEyIDE2djQiPjwvcGF0aD48cGF0aCBkPSJNOCAxMnY4Ij48L3BhdGg+PHBhdGggZD0iTTE2IDEydjgiPjwvcGF0aD48L3N2Zz4=");
          background-repeat: no-repeat;
          background-position: center;
          background-size: contain;
        }
        .gift-card-label {
          position: absolute;
          top: 20px;
          right: 20px;
          font-size: 24px;
          font-weight: 300;
          color: #fff;
        }
        .gift-card-company {
          position: absolute;
          bottom: 30px;
          left: 30px;
          font-size: 18px;
          color: #ddd;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Gift Card Purchase - Admin Notification</h1>
        </div>
        
        <div class="content">
          <p>A new gift card has been purchased. Details are below:</p>
          
          <div class="gift-card-wrapper">
            <div class="gift-card">
              <img class="gift-card-logo" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAMAAAAOusbgAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAMAUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////3///wvcUmQAAAA/dFJOUwABAgMEBQYHCAkKCwwODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKiwtLi8wMTIzNDU2Nzg5Ojs8PT4/QEFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaW1xdXl9gYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXp7fH1+f4CBgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0tba3uLm6u7y9vr/AwcLDxMXGx8jJysvMzc7P0NHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f5vF+xKAAAACXBIWXMAAA7EAAAOxAGVKw4bAAABWklEQVRoge2a2U4CQRBFOyAgq6CoCO67uO/7huKKG+57/P8XeA0BkhmSoamqnklO3pfOpFOV3JmkJ5kuCQkJCbGU9O2c7c/J0FkbVg33LGEsndl5JJhI57bdC0aOfLF3XmStw9Ue5QZtdywBl3uWsLsYpTOdU7XzNTi5TFCFbQ7LMPbC6pVjYGnuZUTx25TK9T5L7L0L5BbOUG7d5jV8JJR7HMzV2zxJ1xBo2lzVv1FdVlC9stgshKbGZbm7DuTmd+AHFstZEDsG34ihnFzBDzxJ86Nq8qOx/l3g/IqJQVEn4B56FFWGakXF6lOBHEBRdaDW9J7/KNDUh6S37W8EuLV0LX3vYnFTd9Mg8HlzT6FtCKrWvJFALEw/+GHfGYqKH6jAIhDIc1F1aRiIpv/ogsRiB0IgJhEDQbXmkxwIakX1mgdyoJoHuaaPDRTVAcQO/kcOAQkJCQllvAAX03DyAP6HFgAAAABJRU5ErkJggg==" alt="Maitri Logo">
              <span class="gift-card-label">Gift card</span>
              <div class="gift-card-icon"></div>
              <div class="gift-card-company">Maitri Liverpool Ltd.</div>
            </div>
          </div>
          
          <table class="data-table">
            <tr>
              <th>Order Date:</th>
              <td>${new Date(orderDate).toLocaleString()}</td>
            </tr>
            <tr>
              <th>Gift Code:</th>
              <td>${giftCode}</td>
            </tr>
            <tr>
              <th>Amount:</th>
              <td>£${parseFloat(amount).toFixed(2)}</td>
            </tr>
            <tr>
              <th>Buyer Name:</th>
              <td>${buyerName}</td>
            </tr>
            <tr>
              <th>Buyer Email:</th>
              <td>${buyerEmail}</td>
            </tr>
            <tr>
              <th>Recipient Name:</th>
              <td>${recipientName}</td>
            </tr>
            <tr>
              <th>Recipient Email:</th>
              <td>${recipientEmail}</td>
            </tr>
          </table>
          
          <p>You can view and manage this gift card in the admin dashboard.</p>
        </div>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} Maitri Wellness Center. All rights reserved.</p>
          <p>This is an automated email notification.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate HTML email template for gift card updates
 */
export function getGiftCardUpdateEmailTemplate(giftCardData, updateType, updateDetails) {
  const { giftCode, amount, buyerName, recipientName } = giftCardData;
  
  let updateTitle, updateMessage;
  
  if (updateType === 'amount_update') {
    updateTitle = 'Gift Card Balance Updated';
    const { previousAmount, newAmount } = updateDetails;
    updateMessage = `
      <p>Your gift card balance has been updated:</p>
      <ul>
        <li>Previous Balance: £${parseFloat(previousAmount).toFixed(2)}</li>
        <li>New Balance: £${parseFloat(newAmount).toFixed(2)}</li>
      </ul>
    `;
  } else if (updateType === 'status_update') {
    updateTitle = 'Gift Card Status Changed';
    const { previousStatus, newStatus } = updateDetails;
    updateMessage = `
      <p>Your gift card status has been updated:</p>
      <ul>
        <li>Previous Status: ${previousStatus}</li>
        <li>New Status: ${newStatus}</li>
      </ul>
    `;
  } else {
    updateTitle = 'Gift Card Update';
    updateMessage = '<p>Your gift card has been updated.</p>';
  }
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 20px; }
        .header img { max-width: 150px; }
        .content { background-color: #f9f9f9; padding: 20px; border-radius: 5px; }
        .footer { margin-top: 20px; font-size: 12px; text-align: center; color: #666; }
        .update-details { background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0; }
        
        /* Gift Card Styling */
        .gift-card-wrapper { margin: 30px 0; padding: 15px; border-radius: 10px; background-color: #fff; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
        .gift-card { 
          background-color: #222; 
          color: white; 
          padding: 30px 20px; 
          border-radius: 10px; 
          position: relative;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }
        .gift-card-logo { 
          position: absolute; 
          top: 20px; 
          left: 20px; 
          width: 120px; 
        }
        .gift-card-icon {
          display: block;
          width: 100px;
          height: 100px;
          margin: 50px auto 40px;
          background: linear-gradient(135deg, #1976d2, #8e24aa);
          border-radius: 10px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
          position: relative;
        }
        .gift-card-icon::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 60px;
          height: 60px;
          background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHJlY3QgeD0iMyIgeT0iOCIgd2lkdGg9IjE4IiBoZWlnaHQ9IjEyIiByeD0iMiI+PC9yZWN0PjxyZWN0IHg9IjgiIHk9IjQiIHdpZHRoPSI4IiBoZWlnaHQ9IjQiIHJ4PSIxIj48L3JlY3Q+PHBhdGggZD0iTTEyIDE2djQiPjwvcGF0aD48cGF0aCBkPSJNOCAxMnY4Ij48L3BhdGg+PHBhdGggZD0iTTE2IDEydjgiPjwvcGF0aD48L3N2Zz4=");
          background-repeat: no-repeat;
          background-position: center;
          background-size: contain;
        }
        .gift-card-label {
          position: absolute;
          top: 20px;
          right: 20px;
          font-size: 24px;
          font-weight: 300;
          color: #fff;
        }
        .gift-card-company {
          position: absolute;
          bottom: 30px;
          left: 30px;
          font-size: 18px;
          color: #ddd;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${updateTitle}</h1>
        </div>
        
        <div class="content">
          <p>Dear ${buyerName},</p>
          
          <p>We're writing to inform you about an update to your gift card for ${recipientName}.</p>
          
          <div class="gift-card-wrapper">
            <div class="gift-card">
              <img class="gift-card-logo" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAMAAAAOusbgAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAMAUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////3///wvcUmQAAAA/dFJOUwABAgMEBQYHCAkKCwwODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKiwtLi8wMTIzNDU2Nzg5Ojs8PT4/QEFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaW1xdXl9gYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXp7fH1+f4CBgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0tba3uLm6u7y9vr/AwcLDxMXGx8jJysvMzc7P0NHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f5vF+xKAAAACXBIWXMAAA7EAAAOxAGVKw4bAAABWklEQVRoge2a2U4CQRBFOyAgq6CoCO67uO/7huKKG+57/P8XeA0BkhmSoamqnklO3pfOpFOV3JmkJ5kuCQkJCbGU9O2c7c/J0FkbVg33LGEsndl5JJhI57bdC0aOfLF3XmStw9Ue5QZtdywBl3uWsLsYpTOdU7XzNTi5TFCFbQ7LMPbC6pVjYGnuZUTx25TK9T5L7L0L5BbOUG7d5jV8JJR7HMzV2zxJ1xBo2lzVv1FdVlC9stgshKbGZbm7DuTmd+AHFstZEDsG34ihnFzBDzxJ86Nq8qOx/l3g/IqJQVEn4B56FFWGakXF6lOBHEBRdaDW9J7/KNDUh6S37W8EuLV0LX3vYnFTd9Mg8HlzT6FtCKrWvJFALEw/+GHfGYqKH6jAIhDIc1F1aRiIpv/ogsRiB0IgJhEDQbXmkxwIakX1mgdyoJoHuaaPDRTVAcQO/kcOAQkJCQllvAAX03DyAP6HFgAAAABJRU5ErkJggg==" alt="Maitri Logo">
              <span class="gift-card-label">Gift card</span>
              <div class="gift-card-icon"></div>
              <div class="gift-card-company">Maitri Liverpool Ltd.</div>
            </div>
          </div>
          
          <div class="update-details">
            <p>Current Amount: <strong>£${parseFloat(amount).toFixed(2)}</strong></p>
            <p>Gift Code: <strong>${giftCode}</strong></p>
            ${updateMessage}
          </div>
          
          <p>If you have any questions about this update, please contact our support team.</p>
          
          <p>Warm regards,<br>
          Maitri Wellness Center Team</p>
        </div>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} Maitri Wellness Center. All rights reserved.</p>
          <p>This is an automated email, please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;
} 
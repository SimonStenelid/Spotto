# Payment Flow Testing Guide

## Prerequisites

### Environment Setup
- Frontend running on `localhost:5173`
- Supabase project: `jjkdamyrulnpcwcfvegn`
- Edge functions deployed and active
- Test Stripe keys configured

### Test User Account
- Create a test user account in the app
- Ensure user is logged in
- Verify user profile exists in database

## Test Scenarios

### 1. Successful Payment Flow

#### Step 1: Initiate Payment
1. Navigate to the app (localhost:5173)
2. Log in with test user account
3. Trigger the payment modal (click "Get Full Access" or similar)
4. Verify modal shows correct pricing (59 SEK)

#### Step 2: Checkout Process
1. Click "Get Full Access" button
2. Verify redirect to Stripe checkout page
3. Check that user email is pre-filled
4. Verify correct amount and currency (59 SEK)

#### Step 3: Complete Payment
1. Use test card: `4242 4242 4242 4242`
2. Enter any future expiry date (e.g., 12/25)
3. Enter any 3-digit CVC (e.g., 123)
4. Enter any billing details
5. Click "Pay now"

#### Step 4: Verify Success
1. Should redirect to `/payment/success?session_id=...`
2. Page should show "Processing your payment..."
3. After a few seconds, should show "Payment successful!"
4. Should auto-redirect to main app after 3 seconds

#### Step 5: Verify Database Updates
1. Check `payments` table for new record
2. Check `Membership` table for activated membership
3. Verify user can now access premium features

### 2. Payment Cancellation Flow

#### Steps
1. Follow steps 1-2 from successful flow
2. On Stripe checkout page, click "Back" or close tab
3. Should redirect to `/payment/canceled`
4. Verify user-friendly cancellation message
5. Verify "Try Again" button works

### 3. Webhook Processing Test

#### Manual Webhook Test
1. Complete a payment (steps 1-3 from successful flow)
2. Check Supabase Edge function logs:
   - Go to Supabase dashboard
   - Navigate to Edge Functions > stripe-webhook
   - Check logs for payment processing
3. Verify webhook received and processed correctly

#### Webhook Failure Recovery
1. Temporarily disable webhook endpoint
2. Complete a payment
3. User should see retry attempts on success page
4. Re-enable webhook
5. Verify eventual success or fallback to manual activation

### 4. Error Scenarios

#### Invalid User
1. Modify PaymentModal to send invalid user ID
2. Attempt payment
3. Should show error message
4. Should not create Stripe session

#### Network Errors
1. Disconnect internet during payment initiation
2. Should show appropriate error message
3. Reconnect and verify retry works

#### Stripe API Errors
1. Use invalid Stripe keys (temporarily)
2. Attempt payment
3. Should show error message
4. Should not redirect to Stripe

## Expected Results

### Successful Payment
- ✅ Stripe checkout session created with user metadata
- ✅ Payment completed successfully
- ✅ Webhook processes payment automatically
- ✅ Payment recorded in `payments` table
- ✅ Membership activated in `Membership` table
- ✅ User redirected to success page
- ✅ User gains access to premium features

### Payment Cancellation
- ✅ User redirected to cancellation page
- ✅ No payment recorded
- ✅ No membership changes
- ✅ User can retry payment

### Error Handling
- ✅ Appropriate error messages shown
- ✅ No partial state changes
- ✅ User can recover from errors
- ✅ Logs available for debugging

## Monitoring and Debugging

### Supabase Logs
1. Go to Supabase dashboard
2. Navigate to Edge Functions
3. Check logs for both functions:
   - `create-checkout-session`
   - `stripe-webhook`

### Stripe Dashboard
1. Go to Stripe dashboard
2. Check Payments section for test payments
3. Check Webhooks section for delivery status
4. Review webhook logs for any failures

### Browser Console
1. Open browser developer tools
2. Check console for any JavaScript errors
3. Monitor network tab for API calls
4. Verify proper error handling

### Database Verification
1. Check `payments` table:
   ```sql
   SELECT * FROM payments ORDER BY created_at DESC LIMIT 5;
   ```

2. Check `Membership` table:
   ```sql
   SELECT * FROM "Membership" WHERE user_id = 'your-test-user-id';
   ```

## Test Data Cleanup

### After Testing
1. Remove test payment records:
   ```sql
   DELETE FROM payments WHERE stripe_session_id LIKE 'cs_test_%';
   ```

2. Reset test user membership:
   ```sql
   UPDATE "Membership" SET is_active = false WHERE user_id = 'your-test-user-id';
   ```

3. Clear Stripe test data in dashboard if needed

## Common Issues and Solutions

### Issue: Webhook not receiving events
- **Solution**: Check webhook URL in Stripe dashboard
- **URL**: Should point to your Supabase Edge function
- **Events**: Ensure `checkout.session.completed` is selected

### Issue: User not found in webhook
- **Solution**: Verify user email matches between auth and profiles table
- **Check**: User metadata is properly passed to Stripe session

### Issue: Payment recorded but membership not activated
- **Solution**: Check Membership table structure and permissions
- **Verify**: Webhook has proper database access

### Issue: CORS errors in browser
- **Solution**: Verify Edge function CORS headers
- **Check**: Frontend origin is allowed

### Issue: Authentication errors
- **Solution**: Verify user is properly logged in
- **Check**: Auth token is valid and passed correctly

## Performance Testing

### Load Testing
1. Create multiple test users
2. Initiate multiple payments simultaneously
3. Verify all payments process correctly
4. Check for any race conditions

### Timeout Testing
1. Simulate slow network conditions
2. Verify appropriate timeouts and retries
3. Test user experience during delays

## Security Testing

### Authentication
1. Attempt payment without authentication
2. Should be rejected with proper error

### Authorization
1. Attempt payment with different user's ID
2. Should be rejected with authorization error

### Webhook Security
1. Send invalid webhook signatures
2. Should be rejected by webhook handler

## Success Criteria

- ✅ All test scenarios pass
- ✅ No errors in logs
- ✅ Database updates correctly
- ✅ User experience is smooth
- ✅ Error handling works properly
- ✅ Security measures are effective
- ✅ Performance is acceptable 
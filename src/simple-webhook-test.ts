import express from 'express';

const app = express();
app.use(express.json());

// Simple health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Webhook server is running',
    endpoints: {
      slack: '/webhooks/slack (POST)',
      health: '/ (GET)'
    }
  });
});

// Simple Slack webhook endpoint for testing
app.post('/webhooks/slack', (req, res) => {
  console.log('Received Slack webhook:', req.body);
  
  const body = req.body;

  // Handle Slack verification
  if (body.type === "url_verification") {
    console.log('Responding to Slack verification with challenge:', body.challenge);
    return res.json({ challenge: body.challenge });
  }

  // For other events, just acknowledge
  console.log('Received Slack event:', body.type);
  return res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 4111;
app.listen(PORT, () => {
  console.log(`Simple webhook server running on port ${PORT}`);
  console.log(`Test endpoint: http://localhost:${PORT}/webhooks/slack`);
  console.log('');
  console.log('To test Slack verification:');
  console.log(`curl -X POST http://localhost:${PORT}/webhooks/slack -H "Content-Type: application/json" -d '{"type":"url_verification","challenge":"test-challenge-123"}'`);
});

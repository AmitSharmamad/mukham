#!/usr/bin/env node

// Simple WebSocket test for deployment events
const WebSocket = require('ws');

const wsUrl = 'ws://localhost:9099/ws/api/deployment/events/ws';
console.log('🚀 Testing WebSocket connection to:', wsUrl);

const ws = new WebSocket(wsUrl);

ws.on('open', function() {
  console.log('✅ WebSocket connected successfully');
});

ws.on('message', function(data) {
  try {
    const event = JSON.parse(data);
    console.log('📨 Received deployment event:', {
      type: event.event_type,
      deployment: event.deployment_id,
      strategy: event.metadata?.strategy_name,
      timestamp: event.timestamp,
      data: event.data
    });
  } catch (error) {
    console.error('❌ Error parsing message:', error);
    console.log('Raw message:', data.toString());
  }
});

ws.on('close', function(code, reason) {
  console.log('🔌 WebSocket connection closed');
  console.log('Close code:', code);
  console.log('Close reason:', reason.toString());
});

ws.on('error', function(error) {
  console.error('❌ WebSocket error:', error);
});

// Auto-close after 10 seconds for testing
setTimeout(() => {
  console.log('⏱️  Test completed, closing connection...');
  ws.close();
}, 10000);

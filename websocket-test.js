// WebSocket Test Script for Deployment Events
// This script can be run in the browser console to test WebSocket connectivity

function testDeploymentWebSocket() {
  const wsUrl = 'ws://localhost:9099/ws/api/deployment/events/ws';
  console.log('Testing WebSocket connection to:', wsUrl);
  
  const ws = new WebSocket(wsUrl);
  
  ws.onopen = function(event) {
    console.log('✅ WebSocket connected successfully');
    console.log('Connection event:', event);
  };
  
  ws.onmessage = function(event) {
    try {
      const data = JSON.parse(event.data);
      console.log('📨 Received deployment event:', {
        type: data.event_type,
        deployment: data.deployment_id,
        strategy: data.metadata?.strategy_name,
        timestamp: data.timestamp,
        data: data.data
      });
    } catch (error) {
      console.error('❌ Error parsing message:', error);
      console.log('Raw message:', event.data);
    }
  };
  
  ws.onclose = function(event) {
    console.log('🔌 WebSocket connection closed');
    console.log('Close code:', event.code);
    console.log('Close reason:', event.reason);
  };
  
  ws.onerror = function(error) {
    console.error('❌ WebSocket error:', error);
  };
  
  // Return WebSocket instance for manual testing
  return ws;
}

// Test function for manual execution
function testWebSocketEvents() {
  console.log('🚀 Starting WebSocket test...');
  const ws = testDeploymentWebSocket();
  
  // Auto-close after 30 seconds for testing
  setTimeout(() => {
    if (ws.readyState === WebSocket.OPEN) {
      console.log('⏰ Closing WebSocket after 30 seconds');
      ws.close(1000, 'Test completed');
    }
  }, 30000);
  
  return ws;
}

// Export for browser console usage
if (typeof window !== 'undefined') {
  window.testDeploymentWebSocket = testDeploymentWebSocket;
  window.testWebSocketEvents = testWebSocketEvents;
  console.log('📡 WebSocket test functions loaded. Run testWebSocketEvents() to start testing.');
}

module.exports = { testDeploymentWebSocket, testWebSocketEvents };

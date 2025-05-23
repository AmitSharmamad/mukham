build an integration with tradingview lightweight-charts to do the following

in the deployment page of a deployment,
create a section for candlestick chart to which the data comes from the below api

```
curl -X GET "/api/deployment/position/456/logs"
```

response:
```
[
  {
    "id": "7f8b2a9c-3d1e-4f5a-9b6c-8d7e0f1g2h3i",
    "deployment_position_id": 456,
    "results": {
        "ema": 21
    },
    "timestamp": "2025-05-23T16:30:00Z",
    "created_at": "2025-05-23T16:30:01Z"
  },
  {
    "id": "9e8d7c6b-5a4f-3e2d-1c0b-9a8b7c6d5e4f",
    "deployment_position_id": 456,
    "results": {
        "ema": 20
    },
    "timestamp": "2025-05-23T17:00:00Z",
    "created_at": "2025-05-23T17:00:01Z"
  }
]
```

now, pickup the keys in `results` property, `ema` in the above case,
and plot ema values on the chart

use `timestamp` on x-axis
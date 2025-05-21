# Scanner Module API Documentation

This document provides details on all the API endpoints required for the `/scanners` module, with examples in curl format.

## Table of Contents

- [List All Scanners](#list-all-scanners)
- [Get Scanner by ID](#get-scanner-by-id)
- [Create Scanner](#create-scanner)
- [Update Scanner](#update-scanner)
- [Delete Scanner](#delete-scanner)
- [Activate Scanner](#activate-scanner)
- [Deactivate Scanner](#deactivate-scanner)
- [Run Scanner Now](#run-scanner-now)

## List All Scanners

Retrieves a list of all scanners.

```bash
curl -X GET \
  http://localhost:3000/api/scanners \
  -H 'Content-Type: application/json'
```

### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Golden Crossover Detector",
      "description": "Detects when 50 EMA crosses above 200 EMA",
      "timeframe": "1 Hour",
      "instruments": [{"symbol": "NIFTY", "exchange": "NSE"}],
      "conditions": ["EMA(50) crosses above EMA(200)"],
      "isActive": true,
      "createdAt": "2025-05-20T10:30:00.000Z",
      "lastRunAt": "2025-05-20T10:30:00.000Z",
      "matchCount": 3
    },
    // ... more scanners
  ]
}
```

## Get Scanner by ID

Retrieves a single scanner by its ID.

```bash
curl -X GET \
  http://localhost:3000/api/scanners/{scanner_id} \
  -H 'Content-Type: application/json'
```

### Response

```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "Golden Crossover Detector",
    "description": "Detects when 50 EMA crosses above 200 EMA",
    "timeframe": "1 Hour",
    "instruments": [{"symbol": "NIFTY", "exchange": "NSE"}],
    "conditions": ["EMA(50) crosses above EMA(200)"],
    "isActive": true,
    "createdAt": "2025-05-20T10:30:00.000Z",
    "lastRunAt": "2025-05-20T10:30:00.000Z",
    "matchCount": 3
  }
}
```

## Create Scanner

Creates a new scanner.

```bash
curl -X POST \
  http://localhost:3000/api/scanners \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "New Scanner Name",
    "description": "Scanner description",
    "timeframe": "15 Minutes",
    "instruments": [{"symbol": "RELIANCE", "exchange": "NSE"}],
    "conditions": ["RSI(14) > 70"],
    "isActive": false
  }'
```

### Response

```json
{
  "success": true,
  "data": {
    "id": "4",
    "name": "New Scanner Name",
    "description": "Scanner description",
    "timeframe": "15 Minutes",
    "instruments": [{"symbol": "RELIANCE", "exchange": "NSE"}],
    "conditions": ["RSI(14) > 70"],
    "isActive": false,
    "createdAt": "2025-05-21T10:30:00.000Z",
    "matchCount": 0
  }
}
```

## Update Scanner

Updates an existing scanner.

```bash
curl -X PUT \
  http://localhost:3000/api/scanners/{scanner_id} \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Updated Scanner Name",
    "description": "Updated scanner description",
    "timeframe": "30 Minutes",
    "instruments": [
      {"symbol": "RELIANCE", "exchange": "NSE"},
      {"symbol": "TCS", "exchange": "NSE"}
    ]
  }'
```

### Response

```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "Updated Scanner Name",
    "description": "Updated scanner description",
    "timeframe": "30 Minutes",
    "instruments": [
      {"symbol": "RELIANCE", "exchange": "NSE"},
      {"symbol": "TCS", "exchange": "NSE"}
    ],
    "conditions": ["EMA(50) crosses above EMA(200)"],
    "isActive": true,
    "createdAt": "2025-05-20T10:30:00.000Z",
    "lastRunAt": "2025-05-20T10:30:00.000Z",
    "matchCount": 3
  }
}
```

## Delete Scanner

Deletes a scanner.

```bash
curl -X DELETE \
  http://localhost:3000/api/scanners/{scanner_id} \
  -H 'Content-Type: application/json'
```

### Response

```json
{
  "success": true,
  "message": "Scanner deleted successfully"
}
```

## Activate Scanner

Activates a scanner.

```bash
curl -X POST \
  http://localhost:3000/api/scanners/{scanner_id}/activate \
  -H 'Content-Type: application/json'
```

### Response

```json
{
  "success": true,
  "data": {
    "id": "2",
    "name": "RSI Oversold",
    "description": "Detects when RSI drops below 30",
    "isActive": true,
    "lastRunAt": "2025-05-21T10:30:00.000Z",
    "timeframe": "15 Minutes",
    "instruments": [{"symbol": "BANKNIFTY", "exchange": "NSE"}],
    "conditions": ["RSI(14) < 30"],
    "createdAt": "2025-05-14T10:30:00.000Z",
    "matchCount": 0
  }
}
```

## Deactivate Scanner

Deactivates a scanner.

```bash
curl -X POST \
  http://localhost:3000/api/scanners/{scanner_id}/deactivate \
  -H 'Content-Type: application/json'
```

### Response

```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "Golden Crossover Detector",
    "description": "Detects when 50 EMA crosses above 200 EMA",
    "isActive": false,
    "timeframe": "1 Hour",
    "instruments": [{"symbol": "NIFTY", "exchange": "NSE"}],
    "conditions": ["EMA(50) crosses above EMA(200)"],
    "createdAt": "2025-05-20T10:30:00.000Z",
    "lastRunAt": "2025-05-20T10:30:00.000Z",
    "matchCount": 3
  }
}
```

## Run Scanner Now

Manually runs a scanner and returns the matches.

```bash
curl -X POST \
  http://localhost:3000/api/scanners/{scanner_id}/scan \
  -H 'Content-Type: application/json'
```

### Response

```json
{
  "success": true,
  "message": "Scan completed successfully",
  "matches": [
    {
      "symbol": "NIFTY",
      "exchange": "NSE",
      "price": 22145.50,
      "matchTime": "2025-05-21T10:30:00.000Z"
    },
    {
      "symbol": "RELIANCE",
      "exchange": "NSE", 
      "price": 2560.75,
      "matchTime": "2025-05-21T10:30:00.000Z"
    }
  ],
  "matchCount": 2
}
```

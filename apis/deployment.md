create a new page `/deployment` for deployments and add the following apis to it

add this new page to the top navbar with `Deployment` title

create cards to list the deployments with the following buttons
1. Pause / Resume (switchable)
2. Stop
3. Delete

make this the same experience as scanners cards

add `Stop All` button on the top

don't add `create deployment` to this page, 
put `create deployment` behind the Deploy button in `strategy backtest results table`

1. Create a Deployment
```
curl -X POST "/api/deployment" \
  -H "Content-Type: application/json"
  -d '{
    "strategy_id": "{deployment_id}",
    "instrument_id": 123,
    "name": "<strategy name> + <instrument name>",
    "description": "<strategy description>"
  }'
```

2. Get User Deployments
```
curl -X GET "/api/deployment"
```

3. Search Deployments with Filters
```
curl -X GET "/api/deployment/search?strategy_id={deployment_id}&instrument_id=123&is_active=true&name=test"
```

4. Get Deployment by ID
```
curl -X GET "/api/deployment/{deployment_id}"
```

5. Update Deployment
```
curl -X PUT "/api/deployment/{deployment_id}" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "{deployment_id}",
    "name": "Updated Deployment Name",
    "description": "Updated deployment description"
  }'
```

6. Delete Deployment
```
curl -X DELETE "/api/deployment/{deployment_id}"
```

7. Activate Deployment
```
curl -X PUT "/api/deployment/{deployment_id}/activate"
```

8. Deactivate Deployment
```
curl -X PUT "/api/deployment/{deployment_id}/deactivate"
```

9. Get Deployments by Strategy
```
curl -X GET "/api/deployment/strategy/{deployment_id}"
```

10. Stop all Deployments
```
curl -X POST 'http://localhost:8080/api/deployment/stop-all' \
  -H 'Content-Type: application/json'
```

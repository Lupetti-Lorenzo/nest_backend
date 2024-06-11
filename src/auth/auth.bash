curl --location \
  --request POST 'https://ir7dco.logto.app/oidc/token' \
  --header 'Authorization: Basic cGxjNnNpdmRzZnRtNnV4a2NqdDZkOjdtbmxBMnpsYW9yNnNReUNHRlFxVEF3NHhueE1obEhs' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode 'grant_type=client_credentials' \
  --data-urlencode 'resource=https://ir7dco.logto.app/api' \
	--data-urlencode 'scope=all'


curl \
 -X POST https://ir7dco.logto.app/api/users \
 -H "Content-Type: application/json" \
   --header 'Authorization: Bearer eyJhbGciOiJFUzM4NCIsInR5cCI6ImF0K2p3dCIsImtpZCI6IjlpVlJoX0JNSDhPOFJJc09meHpZMHNKUVE5Wlpod2xjTTJ3ajhRMFNXWk0ifQ.eyJqdGkiOiJYRGd3eExLcFM1ME1NNW1yeDZhWHQiLCJzdWIiOiJwbGM2c2l2ZHNmdG02dXhrY2p0NmQiLCJpYXQiOjE3MTY0NTIyNjUsImV4cCI6MTcxNjQ1NTg2NSwic2NvcGUiOiJhbGwiLCJjbGllbnRfaWQiOiJwbGM2c2l2ZHNmdG02dXhrY2p0NmQiLCJpc3MiOiJodHRwczovL2lyN2Rjby5sb2d0by5hcHAvb2lkYyIsImF1ZCI6Imh0dHBzOi8vaXI3ZGNvLmxvZ3RvLmFwcC9hcGkifQ.-P0i4acL1T9xx-vXGxnWpV0FkS4epFCuo9s_4bCGt1dL1KfqFnLuiocGLQmnLAyQOOwYJRT9WZO5TEkwrIZxAdfzAyDCSIrXBtpzQdKAUBL7HdMMyuoaS8GmwZIKc1UE' \
 -d '{"primaryEmail":"davide@memumal.it","username":"davidezempo","password":"password00","name":"davide"}'


curl --location \
  --request GET 'https://ir7dco.logto.app/api/users' \
  --header 'Authorization: Bearer eyJhbGciOiJFUzM4NCIsInR5cCI6ImF0K2p3dCIsImtpZCI6IjlpVlJoX0JNSDhPOFJJc09meHpZMHNKUVE5Wlpod2xjTTJ3ajhRMFNXWk0ifQ.eyJqdGkiOiJEbFBZbC1tQ1JjZnZqTjVWamNlMVIiLCJzdWIiOiJwbGM2c2l2ZHNmdG02dXhrY2p0NmQiLCJpYXQiOjE3MTY0NTE4MDcsImV4cCI6MTcxNjQ1NTQwNywiY2xpZW50X2lkIjoicGxjNnNpdmRzZnRtNnV4a2NqdDZkIiwiaXNzIjoiaHR0cHM6Ly9pcjdkY28ubG9ndG8uYXBwL29pZGMiLCJhdWQiOiJodHRwczovL2lyN2Rjby5sb2d0by5hcHAvYXBpIn0.RDPtnOCEIyvs9-An2cRpavqwXl_KEkZsnE66r9YoRF8Sd9wuYsAwUgFshVCgoPOkXZzlcZhMOT0Gz7V_6017jYoCFxRGsrnMyY97NIXmNE0xoI2LOiEnRuX4hS43fL4z' 


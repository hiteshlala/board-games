# Board Games

A simple implementation of socket based Shogi and Go boards.

Deployed: [Shogi or Go](https://games.chobek.com/)

* No game rules implemented - these are player enforced
* Users can join a game 2 person
* Users can move any pieces

## Interactions
* User visits home page
* Has list of ongoing games and can watch play
* Has list of games awaiting someone to join and play
* User can create a game
  
## TODO
- [x] Implement Shogi
- [x] Implement Go
- [x] Improve intuitiveness of landing page
 
  
## Deploying

- when deployed in shared box add the following to the nginx `/etc/nginx/sites-enabled/defualt` file.
  ```
  server {
    listen 80;
    listen [::]:80;
    server_name games.hiteshlala.info;
    location / {
      proxy_pass http://146.190.115.5:6543;
    }
    location /websocket {
      proxy_pass http://146.190.115.5:6543;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
                  proxy_set_header Connection "upgrade";
                  proxy_read_timeout 120s;
          }
  }
  ```
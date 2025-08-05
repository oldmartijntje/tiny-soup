## changes


## sketch

We need an class for handling game logic, `_gameLogicHandler`

This class has a field which it uses to communicate with the server. BUT if you are on the server, this will just be the server logic.

It will listen to the eventhandler for the connected clients, but your own client will talk directly to it.

This way, the code will mostly be the same, but still work efficiently.

## sketch 2

when we join a lobby, we need to tell it to ofc the lobby via mqtt, but also to `GameClient`

- then `GameClient` will try to fetch a response from the server every x time to make sure we are connected. this should go through a connector class which is diff depending on client and host.
- that connector will also tell us if anything changed etc, like the gamestate, or whether we are kicked.
## changes


## sketch

We need an class for handling game logic, `_gameLogicHandler`

This class has a field which it uses to communicate with the server. BUT if you are on the server, this will just be the server logic.

It will listen to the eventhandler for the connected clients, but your own client will talk directly to it.

This way, the code will mostly be the same, but still work efficiently.
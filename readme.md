# Ocarinaverse Legacy

This is my old quick-and-dirty server for making asynchronous games of Ocarina of Time: Randomizer Multiworld possible.

## How to connect.

First things first, you need to have already completed a setup with bizhawk-co-op. See this **[link](https://github.com/TestRunnerSRL/bizhawk-co-op#setup)**
for information on how to do this.

After you've completed this, just follow these steps:

1. Download the async ROM provided to you by Phar.

   
2. Start Bizhawk and start the rom.

   
3. Go to `Tools` > `Lua Console`.

![](https://media.discordapp.net/attachments/863316364398559242/865854123928846346/unknown.png)

4. In the Lua Console window, go to `Script` > `Open Script...`
   
![](https://media.discordapp.net/attachments/863316364398559242/865854177057177630/unknown.png)

5. In the Parent directory for your BizHawk, find `bizhawk-co-op.lua` and open it.

![](https://media.discordapp.net/attachments/863316364398559242/865854268727361566/unknown.png)

6. The Bizhawk Co-op window should then pop up.

![](https://media.discordapp.net/attachments/863316364398559242/865854522777272320/unknown.png)

7. Click the first dropdown labelled `Rooms:` and find `(Custom IP)`. Select that.

![](https://media.discordapp.net/attachments/863316364398559242/865854562089566238/unknown.png)

8. Ensure the following settings are set:

    1. `Host` `async.phar.dev`
    2. `Username` < The username assigned to your player. >
    3. `Password` < The password given to you. >
    4. `Player #` Blank.
    5. `Port` `50000`
    6. `Game Script` `Ocarina of Time.lua`

![](https://media.discordapp.net/attachments/863316364398559242/865855029691547668/unknown.png)

9. Click `Join Room`.

![](https://media.discordapp.net/attachments/863316364398559242/865854849581449236/unknown.png)

10. If everything went well, you should be connected! Be sure to click `Leave Room` when you are finished! Your game may
    be laggy for a minute if you haven't connected in a while, as your emulator tries to catch up with all the events 
    that were sent to you while you were disconnected. 
    
**DO NOT DISCONNECT WHILE THIS HAPPENS** If you do, you may lose items until another player notices you're missing items
and attempts to re-sync you! **ALSO DON'T FORGET TO SAVE BEFORE RESTARTING!**

![](https://media.discordapp.net/attachments/863316364398559242/865856953032638484/unknown.png)

## Help! I get a TIMEOUT error when I try to connect!

If you get an error like this:

![](https://media.discordapp.net/attachments/863316364398559242/865857043670761472/unknown.png)

You most likely have the username wrong. It is case-sensitive and MUST match what Phar said it should be.

If you have any other issues, let Phar know.

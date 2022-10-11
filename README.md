<p align="center"><a href="https://github.com/NorthDevelopment/NorthClient"><img src="https://media.discordapp.net/attachments/984837636457918465/1000014634012647464/giphy.gif" alt="Gray shape shifter" height="120"/></a></p>
<h1 align="center">NorthClient</h1>
<p align="center">The world's easiest, most powerful Pterodactyl Client Panel.</p>

<p align="center">
<a  href="https://github.com/NorthDevelopment/NorthClient/releases"><img src="https://img.shields.io/github/v/release/NorthDevelopment/NorthClient" height="20"/></a>
<a href="https://github.com/NorthDevelopment/NorthClient/actions"><img src="https://github.com/discordjs/discord.js/actions/workflows/test.yml/badge.svg" alt="Tests status" />
<a href="https://github.com/NorthDevelopment/NorthClient/actions"><img src="https://img.shields.io/discord/984837635879104602?label=Discord" alt="Tests status" />
<a  href="https://demo.northdevelopment.ga"><img src="https://img.shields.io/github/v/tag/NorthDevelopment/NorthClient?label=Demo%20Version" height="20"/>
<a  href="https://github.com/NorthDevelopment/NorthClient/stargazers"><img src="https://img.shields.io/github/stars/NorthDevelopment/NorthClient?label=%E2%AD%90" height="20"/></a>



<p align="center"><a href="https://github.com/NorthDevelopment/NorthClient"></a><a href="#nastyox"><img src="http://randojs.com/images/dropShadow.png" width="75%"/></a></p><br/>

## :hear_no_evil:  What is NorthClient?  
<a href="https://github.com/NorthDevelopment/NorthClient" target="_blank">NorthClient</a> is a Pterodactyl client area, making it more comfortable for users to manage their servers 
<br/><br/><br/>

## :star: What Features ?
<a href="https://github.com/NorthDevelopment/NorthClient" target="_blank"> NorthClient's</a> features include:
<br/>
- Resource Management (gift, use it to create servers, edit servers)
- Coins (Join for Rewards, Buy Coins)
- Coupons (Gives resources & coins to a user)
- Servers (create, view, edit servers)
- User System (auth, regen password, etc)
- Store (buy resources with coins)
- Login System with Email and Password or Discord
- Register System with Username, Email and Password. 
- Dashboard (view resources & servers from one area)
- Join for Rewards (join discord servers for coins)
- Admin (set/add/remove coins & resources, create/revoke coupons)
- Webhook (Logs actions)
- Gift Coins (Share coins with anyone)
- Stripe API (buy coins via stripe)
- Mail Server (SMTP support)
- Linkvertise Earning
- Role Packages (get packages via roles)
- Dark-mode/White-mode
<br/><br/><br/>

## :zap:  Fast implementation  
  Use pm2:<br/>
  ```JavaScript
//Step 01:
Install pm2. (If you don't know how then look below.)

//Step 02:
Drop the files into your server and edit settings.yml.
//Step 03:
move to >>$ cd /yourlocation<< 
//Step 04: 
start the Index.js with >>$ pm2 start index.js.<< 
```
___
Or, use Pterodactyl's Panel:
```JavaScript
//Step 01:
Install The egg discord.js generic and create a server with this egg

//Step 02:
Drop the Files in your Server and Edit the settings.yml

//Note: If you need Help, feel free to join the Discord or Report the Issue on GitHub.
``` 
  
<br/><br/><br/>
## :tada:  How to install pm2:

**Step 01:**
<BR/>This is for (Debian/Ubuntu)
  ```JavaScript
---------- Install Node.js v18.x ---------- 
$ curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
$ sudo apt-get install -y nodejs

---------- Install Node.js v12.x ----------
$ curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
$ sudo apt-get install -y nodejs
  ```
___
This is for (CentOS/RHEL and Fedora)
  ```JavaScript
---------- Install Node.js v18.x ---------- 
$ curl -sL https://rpm.nodesource.com/setup_18.x | bash -

---------- Install Node.js v12.x ----------
$ curl -sL https://rpm.nodesource.com/setup_12.x | bash -
  ```

  ```JavaScript
  //Step 02:
---------- Install PM2 ---------- 
$ sudo npm i -g pm2
  ```

  ```JavaScript
&#8674; Example Start pm2
$ sudo pm2 start /var/www/html/app/server.js -i 4 
$ sudo pm2 save  (#save current process list on reboot)

//Node\\
Hot to Update:
$ sudo pm2 update	      #update PM2 package

More Commands: 
$ sudo pm2 logs 1	        #view logs for app 1
$ sudo pm2 stop 0           #stop process with ID 0
$ sudo pm2 restart all      #restart all apps
  ```
<br/><br/><br/>
## :eyes:  Preview
![unknown](https://media.discordapp.net/attachments/984837636457918466/1003336465725526047/unknown.png?width=1329&height=670)
![unknown](https://media.discordapp.net/attachments/984837636457918465/1007085112900464800/unknown.png?width=1371&height=670)
![unknown](https://user-images.githubusercontent.com/71934318/180893825-36222dd0-0f8c-47ed-a36e-19938eb2a6e4.png)
![unknown](https://media.discordapp.net/attachments/984837636457918465/1007085166562398228/unknown.png?width=1369&height=670)
<br/><br/><br/>

## :clap:  Demo
Check out our [demo](https://demo.northdevelopment.ga)<br/>
Login:<br/>
> Name: demo<br/>
> E-Mail: demo@northdevelopment.de<br/>
> Password: demo
<br/>

## Check out our [Discord Support](https://discord.gg/c2V7NKKWCT)<br/>
<br/>
<!---
## 🎖️  NorthDevelopment Team
<kbd><img src="https://avatars.githubusercontent.com/u/41525308?v=4" href="https://github.com/SirHaxe" height="64" width="64" alt="SirHaxe PNG not Loaded" border="1px" align="center"></kbd>
<kbd><img src="https://avatars.githubusercontent.com/u/71934318?v=4" href="https://github.com/SirHaxe" height="64" width="64" alt="SirHaxe PNG not Loaded" border="1px" align="center"></kbd>
<br/><br/><br/>
## :heart:  Supporters
<kbd><img src="https://avatars.githubusercontent.com/u/41525308?v=4" href="https://github.com/SirHaxe" height="64" width="64" alt="SirHaxe PNG not Loaded" border="1px" align="center"></kbd>
<kbd><img src="https://avatars.githubusercontent.com/u/71635703?v=4" href="https://github.com/SirHaxe" height="64" width="64" alt="SirHaxe PNG not Loaded" border="1px" align="center"></kbd>
<kbd><img src="https://avatars.githubusercontent.com/u/71934318?v=4" href="https://github.com/SirHaxe" height="64" width="64" alt="SirHaxe PNG not Loaded" border="1px" align="center"></kbd>
<kbd><img src="https://avatars.githubusercontent.com/u/109818191?v=4" href="https://github.com/SirHaxe" height="64" width="64" alt="SirHaxe PNG not Loaded" border="1px" align="center"></kbd>
<kbd><img src="https://avatars.githubusercontent.com/u/25795235?v=4" href="https://github.com/SirHaxe" height="64" width="64" alt="SirHaxe PNG not Loaded" border="1px" align="center"></kbd>
<kbd><img src="https://avatars.githubusercontent.com/u/91793263?v=4" href="https://github.com/SirHaxe" height="64" width="64" alt="SirHaxe PNG not Loaded" border="1px" align="center"></kbd>
<kbd><img src="https://avatars.githubusercontent.com/u/89733485?s=96&v=4" href="https://github.com/SirHaxe" height="64" width="64" alt="SirHaxe PNG not Loaded" border="1px" align="center"></kbd>
<kbd><img src="https://avatars.githubusercontent.com/u/81978700?s=96&v=4" href="https://github.com/SirHaxe" height="64" width="64" alt="SirHaxe PNG not Loaded" border="1px" align="center"></kbd>
<kbd><img src="https://avatars.githubusercontent.com/u/75165318?s=96&v=4" href="https://github.com/SirHaxe" height="64" width="64" alt="SirHaxe PNG not Loaded" border="1px" align="center"></kbd>
<kbd><img src="https://avatars.githubusercontent.com/u/71870130?s=96&v=4" href="https://github.com/SirHaxe" height="64" width="64" alt="SirHaxe PNG not Loaded" border="1px" align="center"></kbd>
<kbd><img src="https://avatars.githubusercontent.com/u/25504684?s=96&v=4" href="https://github.com/SirHaxe" height="64" width="64" alt="SirHaxe PNG not Loaded" border="1px" align="center"></kbd>
<kbd><img src="https://avatars.githubusercontent.com/u/47180141?s=96&v=4" href="https://github.com/SirHaxe" height="64" width="64" alt="SirHaxe PNG not Loaded" border="1px" align="center"></kbd>
<kbd><img src="https://avatars.githubusercontent.com/u/66245404?s=96&v=4" href="https://github.com/SirHaxe" height="64" width="64" alt="SirHaxe PNG not Loaded" border="1px" align="center"></kbd>
<kbd><img src="https://avatars.githubusercontent.com/u/47180141?s=96&v=4" href="https://github.com/SirHaxe" height="64" width="64" alt="SirHaxe PNG not Loaded" border="1px" align="center"></kbd>
<kbd><img src="https://avatars.githubusercontent.com/u/25504684?s=96&v=4" href="https://github.com/SirHaxe" height="64" width="64" alt="SirHaxe PNG not Loaded" border="1px" align="center"></kbd>
<kbd><img src="https://avatars.githubusercontent.com/u/105011285?s=96&v=4" href="https://github.com/SirHaxe" height="64" width="64" alt="SirHaxe PNG not Loaded" border="1px" align="center"></kbd>
<kbd><img src="https://avatars.githubusercontent.com/u/67504410?s=96&v=4" href="https://github.com/SirHaxe" height="64" width="64" alt="SirHaxe PNG not Loaded" border="1px" align="center"></kbd>
<kbd><img src="https://avatars.githubusercontent.com/u/49806509?s=96&v=4" href="https://github.com/SirHaxe" height="64" width="64" alt="SirHaxe PNG not Loaded" border="1px" align="center"></kbd>
<kbd><img src="https://avatars.githubusercontent.com/u/104288623?s=96&v=4" href="https://github.com/SirHaxe" height="64" width="64" alt="SirHaxe PNG not Loaded" border="1px" align="center"></kbd>
<kbd><img src="https://avatars.githubusercontent.com/u/11256682?s=96&v=4" href="https://github.com/SirHaxe" height="64" width="64" alt="SirHaxe PNG not Loaded" border="1px" align="center"></kbd>
<kbd><img src="https://avatars.githubusercontent.com/u/90916297?s=96&v=4" href="https://github.com/SirHaxe" height="64" width="64" alt="SirHaxe PNG not Loaded" border="1px" align="center"></kbd>
<kbd><img src="https://avatars.githubusercontent.com/u/26302620?s=96&v=4" href="https://github.com/SirHaxe" height="64" width="64" alt="SirHaxe PNG not Loaded" border="1px" align="center"></kbd>
<kbd><img src="https://avatars.githubusercontent.com/u/30575805?s=96&v=4" href="https://github.com/SirHaxe" height="64" width="64" alt="SirHaxe PNG not Loaded" border="1px" align="center"></kbd>
<kbd><img src="https://avatars.githubusercontent.com/u/3486188?s=96&v=4" href="https://github.com/SirHaxe" height="64" width="64" alt="SirHaxe PNG not Loaded" border="1px" align="center"></kbd>
<p align="center"><a href="https://github.com/NorthDevelopment/NorthClient"><img src="http://randojs.com/images/barsSmallTransparentBackground.gif" alt="Animated footer bars" width="100%"/></a></p>
-->
<br/>
This repository is managed under the MIT license.

© 2021-present [Votion-Development](https://github.com/Votion-Development)<br/>
© 2022-present NorthDevelopment

With Special thanks to [JamieGrimwood](https://github.com/JamieGrimwood) for Helping us with license things and [Votion-Development](https://github.com/Votion-Development/Dashactyl) for creating the base for this panel
<br/>
<p align="center"><a href="https://github.com/NorthDevelopment/NorthClient#"><img src="http://randojs.com/images/backToTopButtonTransparentBackground.png" alt="Back to top" height="29"/></a></p>


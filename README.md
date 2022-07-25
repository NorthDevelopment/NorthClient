<p align="center"><a href="https://github.com/NorthDevelopment/NorthClient"><img src="https://media.discordapp.net/attachments/984837636457918465/1000014634012647464/giphy.gif" alt="Gray shape shifter" height="120"/></a></p>
<h1 align="center">NorthClient</h1>
<p align="center">The world's easiest, most powerful Pterodactyl Client Panel.</p>

<p align="center">
<a href="https://discord.gg/c2V7NKKWCT"><img src="https://cdn8.bigcommerce.com/s-prdpfsbvbl/product_images/uploaded_images/button-discord.png" height="20"/></a>
<a href="https://github.com/NorthDevelopment/NorthClient/actions"><img src="https://github.com/discordjs/discord.js/actions/workflows/test.yml/badge.svg" alt="Tests status" /></a>

<p align="center"><a href="https://github.com/NorthDevelopment/NorthClient"></a><a href="#nastyox"><img src="http://randojs.com/images/dropShadow.png" width="75%"/></a></p><br/>

## :hear_no_evil:  What's the NorthClient?  
<a href="https://github.com/NorthDevelopment/NorthClient" target="_blank">NorthClient</a> is The best Pterodactyl Control Panel Making a free or paid host and need a way for users to sign up, earn coins, manage servers? Try out NorthClient. To get started, scroll down and follow the guide
<br/><br/><br/>

## :star: What Features ?
All features of<a href="https://github.com/NorthDevelopment/NorthClient" target="_blank">NorthClient:</a>
<br/>
- Resource Management (gift, use it to create servers, edit servers)
- Coins (Join for Rewards, Buy Coins)
- Coupons (Gives resources & coins to a user)
- Servers (create, view, edit servers)
- User System (auth, regen password, etc)
- Store (buy resources with coins)
- Dashboard (view resources & servers from one area)
- Join for Rewards (join discord servers for coins)
- Admin (set/add/remove coins & resources, create/revoke coupons)
- Webhook (Logs actions)
- Gift Coins (Share coins with anyone)
- Stripe API (buy coins via stripe)
- Mail Server (SMTP support)
- Linkvertise Earning
- Role Packages (get packages via roles)
<br/><br/><br/>

## :zap:  Fast implementation  
  Use pm2:<br/>
  ```JavaScript
//Step 01:
Install pm2. (If you don't know how then look below.)

//Step 02:
Drop the files into your server and edit settings.yml. 
Then go into the directory with >>$ cd /yourlocation<< then start the index.js with 
>>$ pm2 start index.js.<< 
```
___
Or, use Pterodactyl Panel:
```JavaScript
//Step 01:
Install The egg discord.js generic and create a server with this egg

//Step 02:
Drop the Files in ur Server and Edit the settings.yml

//Note: If u need Help just feel free to join the Discord or Report the Issue on GitHub.
``` 
  
<br/><br/><br/>
## :tada:  How to install pm2:

**Step 01:**
<BR/>This is for (Debian/Ubuntu)
  ```JavaScript
---------- Install Node.js v11.x ---------- 
$ curl -sL https://deb.nodesource.com/setup_11.x | sudo -E bash -
$ sudo apt-get install -y nodejs

---------- Install Node.js v10.x ----------
$ curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
$ sudo apt-get install -y nodejs
  ```
___
This is for (CentOS/RHEL and Fedora)
  ```JavaScript
---------- Install Node.js v11.x ---------- 
$ curl -sL https://rpm.nodesource.com/setup_11.x | bash -

---------- Install Node.js v10.x ----------
$ curl -sL https://rpm.nodesource.com/setup_10.x | bash -
  ```

**Step 02**
  ```JavaScript
---------- Install PM2 ---------- 
$ sudo npm i -g pm2
  ```

  
**&#8674; Example Start pm2**  
  ```JavaScript
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
![unknown](https://user-images.githubusercontent.com/71934318/180893151-dd16648d-c2a9-4cdc-a66c-9fb43c19e93b.png)
![unknown](https://user-images.githubusercontent.com/71934318/180893825-36222dd0-0f8c-47ed-a36e-19938eb2a6e4.png)

<br/><br/><br/>
## :warning:  Warning/Copyright
We cannot force you to keep the "made with ❤️ by Jonas.#9915" in the footer, but please consider keeping it. It helps getting more visibility to the project and so getting better. We won't do technical support for installations without the notice in the footer. And the version check in the Admin area.

<br/><br/><br/>
## :clap:  Supporte
Check out our [docs](https://docs.Northdevelopment.ga)<br/>
Check out our [Discord Support](https://discord.gg/c2V7NKKWCT)<br/>
<br/><br/><br/>
## :heart:  Supporters
<kbd><img src="https://avatars.githubusercontent.com/u/41525308?v=4" href="https://github.com/SirHaxe" height="64" width="64" alt="SirHaxe PNG not Loaded" border="1px" align="center"></kbd>
<kbd><img src="https://avatars.githubusercontent.com/u/109818191?v=4" href="https://github.com/SirHaxe" height="64" width="64" alt="SirHaxe PNG not Loaded" border="1px" align="center"></kbd>
<kbd><img src="https://avatars.githubusercontent.com/u/25795235?v=4" href="https://github.com/SirHaxe" height="64" width="64" alt="SirHaxe PNG not Loaded" border="1px" align="center"></kbd>
<p align="center"><a href="https://github.com/NorthDevelopment/NorthClient"><img src="http://randojs.com/images/barsSmallTransparentBackground.gif" alt="Animated footer bars" width="100%"/></a></p>
<br/>
<p align="center"><a href="https://github.com/NorthDevelopment/NorthClient#"><img src="http://randojs.com/images/backToTopButtonTransparentBackground.png" alt="Back to top" height="29"/></a></p>

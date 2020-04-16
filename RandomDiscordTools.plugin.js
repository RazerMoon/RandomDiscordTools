/**
 * @name RandomDiscordTools
 * @authorId 162970149857656832
 * @version 0.7.0
 * @website https://razermoon.github.io/
 * @invite TuAmzRb
 * @source https://github.com/RazerMoon/RandomDiscordTools
 */
/*@cc_on
@if (@_jscript)
	
	// Offer to self-install for clueless users that try to run this directly.
	let shell = WScript.CreateObject("WScript.Shell");
	let fs = new ActiveXObject("Scripting.FileSystemObject");
	let pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\BetterDiscord\plugins");
	let pathSelf = WScript.ScriptFullName;
	// Put the user at ease by addressing them in the first person
	shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
	if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
		shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
	} else if (!fs.FolderExists(pathPlugins)) {
		shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
	} else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
		fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
		// Show the user where to put plugins in the future
		shell.Exec("explorer " + pathPlugins);
		shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
	}
	WScript.Quit();
@else@*/

let RandomDiscordTools = (() => {
    const config = {info:
    {name:"RandomDiscordTools",authors:[{name:"RazerMoon",discord_id:"162970149857656832"}],
    version:"0.7.0",
    description:"A plugin for Bandaged BetterDiscord that has some random, potentially useful tools."},
    changelog:[
        {
            title: "New Features",
            type: "added",
            items: ["New info button again but better.",
                    "New InfoButton class.",
                    ]
        },
        {
            title: "Improvements",
            type: "improved",
            items: ["The info button now uses React instead pf DOM manipulation, credit to Strencher for inspiration.",
                    "The button now appears and reappears when you change the selection setting.",
                    "The button has it's own class for patching and logging"
                    ]
        },
    ]
    };

    return !global.ZeresPluginLibrary ? class {
        constructor() {this._config = config;}
        getName() {return config.info.name;}
        getAuthor() {return config.info.authors.map(a => a.name).join(", ");}
        getDescription() {return config.info.description;}
        getVersion() {return config.info.version;}
        load() {
            const title = "Library Missing";
            const ModalStack = BdApi.findModuleByProps("push", "update", "pop", "popWithKey");
            const TextElement = BdApi.findModuleByProps("Sizes", "Weights");
            const ConfirmationModal = BdApi.findModule(m => m.defaultProps && m.key && m.key() == "confirm-modal");
            if (!ModalStack || !ConfirmationModal || !TextElement) return BdApi.alert(title, `The library plugin needed for ${config.info.name} is missing.<br /><br /> <a href="https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js" target="_blank">Click here to download the library!</a>`);
            ModalStack.push(function(props) {
                return BdApi.React.createElement(ConfirmationModal, Object.assign({
                    header: title,
                    children: [BdApi.React.createElement(TextElement, {color: TextElement.Colors.PRIMARY, children: [`The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`]})],
                    red: false,
                    confirmText: "Download Now",
                    cancelText: "Cancel",
                    onConfirm: () => {
                        require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                            if (error) return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
                            await new Promise(r => require("fs").writeFile(require("path").join(ContentManager.pluginsFolder, "0PluginLibrary.plugin.js"), body, r));
                        });
                    }
                }, props));
            });
        }
        start() {}
        stop() {}
    } : (([Plugin, Api]) => {
        const plugin = (Plugin, Api) => {
    const {Modals, DiscordModules, Settings, WebpackModules, ReactComponents, Patcher, DiscordSelectors} = Api;
    const {SettingPanel, SettingField, Textbox, Dropdown, Switch} = Settings;
    const {React} = DiscordModules;

    /**
     * Prints details into console.
     */
    class FireLog {
        constructor(server, channel) {
            this.css = {
                group: "font-size: 200%; color: pink; ffont-weight: bold; background-color: black;",
                object: "font-size: 100%; color: pink; ffont-weight: bold; background-color: black;",
            }
            this.owner = (e) => {let l = BdApi.findModuleByProps("getUser").getUser(e); if (typeof l != 'undefined') return l.tag; else return "error"};
        }

        /**
         * Prints details about server, channel or user into console with style.
         * @param {object} server The server object
         * @param {object} channel The channel object
         * @param {object} user The user Object
         */
        log(server, channel, user) {

            console.groupCollapsed('%cRandomDiscordTools 🔥', this.css.group);

            try {
            if (typeof server.name != 'undefined') {
                try {
                    console.group("Server:", server.name);
                        console.log("Name:", server.name);
                        console.log("Server Id:", server.id);
                        console.log("Description:", server.description);
                        console.log("Owner:", this.owner(server.ownerId));
                        console.log("Owner's Id:", server.ownerId);
                        console.log("Joined At:", server.joinedAt);
                        console.log("Server Location:", server.region);
                        console.groupCollapsed("%cFull object 👇", this.css.object);
                            console.log(server);
                        console.groupEnd();
                    console.groupEnd();
                }
                catch(err) {
                console.info("No server passed");
                }
            }
            }
            catch(err) {
                console.info("No server passed")
            }   

            try {
            if (typeof channel.name != 'undefined') {
                try {
                    console.group("Channel:", channel.name);
                        console.log("Name:", channel.name);
                        console.log("Server Id:", channel.guild_id);
                        console.log("Channel Id:", channel.id);
                        console.log("Topic:", channel.topic);
                        console.groupCollapsed("%cFull object 👇", this.css.object);
                            console.log(channel);
                        console.groupEnd();
                    console.groupEnd();
                }
                catch(err) {
                    console.info("No channel passed");
                }
            }
            }
            catch(err) {
                console.info("No channel passed")
            }   

            try {
            if (typeof user.username != 'undefined') {
                try {
                    console.group("User:", user.username);
                        console.log("Name:", user.username);
                        console.log("User Id:", user.id);
                        console.log("Tag:", user.tag);
                        console.log("Created at:", user.createdAt);
                        console.groupCollapsed("%cFull object 👇", this.css.object);
                            console.log(user);
                        console.groupEnd();
                    console.groupEnd();
                }
                catch(err) {
                    console.info("No user passed");
                }
            }
            }
            catch(err) {
                console.info("No user passed")
            }
            console.groupEnd();

        }

    };

    /**
     * Creates a Changelog button React Component.
     */
    class DisplayChangelog extends React.Component {
        constructor() {
            super();
        }
        render() {
            return React.createElement(
                'div',
                {class: "flex-1O1GKY"},
                    [React.createElement(
                        'button',
                        {type: "button", id: "F_ChangelogButton", class: `button-38aScr iconWrapper-2OrFZ1 da-button lookFilled-1Gx00P ${this.props.col} sizeSmall-2cSMqn grow-q77ONN da-grow`},
                        "Changelog"
                    )]
            )
    }
    };

    /**
     * Creates the InfoButton as a React Component that can be patched into Discord without DOM manipulation.
     */
    class InfoIcon extends React.Component {
        constructor() {
            super()
            this.ToolTip = WebpackModules.getByDisplayName("Tooltip");
            this.BD = DiscordModules.ButtonData;
            this.ButtonClasses = `button-14-BFJ da-button enabled-2cQ-u7 da-enabled button-38aScr ${this.BD.ButtonLooks.BLANK} ${this.BD.ButtonColors.BRAND} grow-q77ONN da-grow`
        }
        render() {
            return React.createElement(this.ToolTip, {
                text: "Print info to console",
                position: "top",
                color: "black"
                }, e => React.createElement('button', {
                    "aria-label": "Info Button",
                    type: "button",
                    class: this.ButtonClasses
                    }, React.createElement('div', {
                        class: `contents-18-Yxp da-contents`
                        }, React.createElement("svg", {
                            width: "20",
                            height: "17",
                            viewBox: "0 0 20 20",
                            onMouseEnter: e.onMouseEnter,
                            onMouseLeave: e.onMouseLeave,
                            onClick: this.props.onClick,
                            children: React.createElement("path", {
                               d: "m10,0.564842c-5.17133,0 -9.370144,4.228447 -9.370144,9.435503s4.198814,9.435158 9.370144,9.435158c5.170987,0 9.370144,-4.228102 9.370144,-9.435503c0,-5.207056 -4.199157,-9.435503 -9.370144,-9.435503l0,0.000345zm0,2.059599c0.454389,0 0.834417,0.160939 1.156533,0.485095c0.322116,0.324363 0.481803,0.712218 0.481803,1.175642c0,0.480678 -0.159687,0.889237 -0.481803,1.207733s-0.702144,0.474467 -1.156533,0.474467c-0.448563,0 -0.834417,-0.161146 -1.156533,-0.485164c-0.322116,-0.324363 -0.492769,-0.728091 -0.492769,-1.197036c0,-0.451692 0.170653,-0.834716 0.492769,-1.1646c0.322116,-0.330229 0.707969,-0.496137 1.156533,-0.496137zm0,4.99277c0.408128,0 0.731957,0.142513 0.985195,0.420636c0.258721,0.272258 0.385511,0.613183 0.385511,1.024158l0,6.869242c0,0.410974 -0.12679,0.75121 -0.385511,1.0352c-0.253238,0.277779 -0.577067,0.420636 -0.985195,0.420636c-0.402645,0 -0.737097,-0.142858 -0.995818,-0.420636c-0.253238,-0.28399 -0.385854,-0.624226 -0.385854,-1.0352l0,-6.869242c0,-0.410974 0.132616,-0.7519 0.385854,-1.024158c0.258721,-0.278124 0.593173,-0.420636 0.995818,-0.420636z",
                               fill: "currentColor",
                               fillRule: "evenodd",
                               clipRule: "evenodd",
                })
            }))))
        }
    }

    /**
     * Takes the InfoIcon component and patches it into the AccountDetails container, also displays information when the button is pressed.
     */
    class InfoButton {
        constructor() {}

        /**
         * Patches AccountDetails
         * @param {object} ran The plugin
         */
        async patchButton(ran) {
            this.settings = ran.settings
            this.c = ran.c

            if (this.settings.gear == true) {
            const account = await ReactComponents.getComponentByName("Account", DiscordSelectors.AccountDetails.container);

            Patcher.after(account.component.prototype, "render", ({props}, _, react)=>{
                react.props.children[2].props.children.unshift(
                    React.createElement(InfoIcon, {
                            role: "switch",
                            onClick: () => this.onClick()
                    })
                );
            });
            }
            else {
                Patcher.unpatchAll();
            }
        }

        /**
         * Displays stuff based on what you entered into the settings.
         */
        onClick() {
            if (this.settings.switchserverid == false) {
                var server = this.c.getServerById(this.settings.dropserverid);
            }
            else {
                var server = this.c.getServerById(this.settings.textserverid);
            }

            if (this.settings.switchchannelid == false) {
                var channel = this.c.getChannelById(this.settings.dropchannelid);
            }
            else {
                var channel = this.c.getChannelById(this.settings.textchannelid);
            }

            if (this.settings.switchuserid == false) {
                var user = this.c.getUserById(this.settings.dropuserid);
            }
            else {
                var user = this.c.getUserById(this.settings.textuserid)
            }

            this.c.FL.log(server, channel, user);
            BdApi.findModuleByProps('playSound').playSound('ptt_start')
        }
        }

    /**
     * Class with the main plugin stuff.
     */
    return class RandomDiscordTools extends Plugin {
        constructor() {
            super();

            /**
             * Useful commands.
             */
            this.c = {
                currentChannel : BdApi.findModuleByProps('getChannelId').getChannelId,
                currentGuildId : BdApi.findModuleByProps('getGuildId').getGuildId,
                getChannelById : BdApi.findModuleByProps('getChannel').getChannel,
                getServerById  : BdApi.findModuleByProps('getGuild').getGuild,
                getUserById    : BdApi.findModuleByProps("getUser").getUser,
                userId         : BdApi.findModuleByProps('getId').getId(),
                FL             : new FireLog(),
                PB             : new InfoButton(),
            }

            /**
             * Default settings of the plugin.
             */
            this.defaultSettings = {
                textserverid   : "",
                textserverid   : "",
                dropserverid   : "",
                textchannelid  : "",
                dropchannelid  : "",
                switchchannelid: false,
                switchserverid : false,
                switchuserid   : false,
                gear           : false,
            };
        }

        /**
         * Accepts a MouseEvent from an EventListener and does stuff depending on what it is.
         * @param {MouseEvent} param0 MouseEvent from EventListener.
         */
        onClick({target}) {

            let FL = this.c.FL;

            if (target.id == "F_ChangelogButton") {
                Modals.showChangelogModal(`${this._config.info.name} has been updated!`, this.getVersion(), this._config.changelog);
            }

            if (target.classList.contains("bd-addon-header")) {
                const currentDir = BdApi.Plugins.folder;
                let filename = target.parentNode.__reactInternalInstance$.return.stateNode.props.addon.filename
                let fileDir = require("path").resolve(`${currentDir}/${filename}`)
                console.log("Opening " + filename)
                require("electron").shell.openItem(fileDir);
            }

            if (this.settings.gear == false) {
                if (target.classList.contains("wrapper-1BJsBx")) {
                    let server = this.c.getServerById(this.c.currentGuildId());
                    FL.log(server, 0, 0)
                }

                if (target.classList.contains("name-3_Dsmg")) {
                    let channel = this.c.getChannelById(this.c.currentChannel());
                    FL.log(0, channel, 0)
                }

                if (target.classList.contains("wrapper-3t9DeA")) {
                   if (target.classList.contains("avatar-SmRMf2")) return;
                   let userid = target.attributes.user_by_bdfdb.value
                   FL.log(0, 0, this.c.getUserById(userid))
                }
            }
        }
        
        /**
         * Displays an alert.
         * @param {string} e Title of alert.
         * @param {string} t Body of alert.
         */
        displayAlert(e, t) {
            let n = BdApi.findModuleByProps("push", "update", "pop", "popWithKey");
            let s = BdApi.findModuleByPrototypes("handleCancel", "handleSubmit", "handleMinorConfirm");
            if (t === 'but') {
                var t = [React.createElement('div',
                 {class: "flex-1O1GKY"},
                React.createElement('button',
                 {class:'primaryButton-2BsGPp da-primaryButton button-38aScr da-button lookFilled-1Gx00P colorBrand-3pXr91 sizeXlarge-2yFAlZ grow-q77ONN da-grow'},
                  "bruh"))]
            }

            n.push((n) => {
                let a = BdApi.React.createElement(s, Object.assign({
                    title: e,
                    body: t,
                    size: "small"
                }, n))
                return a
            })
            
        }

        /**
         * Finds the value of a cookie by its name.
         * @param {string} cname Name of cookie.
         */
        getCookie(cname) {
            var name = cname + "=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');
            for(var i = 0; i <ca.length; i++) {
              var c = ca[i];
              while (c.charAt(0) == ' ') {
                c = c.substring(1);
              }
              if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
              }
            }
            return "";
          }

        /**
         * Runs when the plugin is started.
         */
        async onStart() {

            document.addEventListener("click", this.listener = e => {this.onClick(e)});
            this.c.PB.patchButton(this)
        }

        /**
         * Runs when the plugin is stopped.
         */
        onStop() {
            document.removeEventListener("click", this.listener);
        
            Patcher.unpatchAll();
        }

        /**
         * Runs when the user clicks on the plugin settings button
         */
        getSettingsPanel() {
            let col = DiscordModules.ButtonData.ButtonColors;
            return SettingPanel.build(this.saveSettings.bind(this),
            
                // Server
            new SettingField("", "", () => {}, DisplayChangelog, {col: col.GREY}),

            new Switch("Automatic or Manual Selection", "OFF = Automatic, ON = Manual", this.settings.gear, (e) => {this.settings.gear = e; this.c.PB.patchButton(this)}),
            
            new Textbox("Server", "Put in the id of the server you want to get information about.", this.settings.textserverid, (e) => {this.settings.textserverid = e;}),
            new Dropdown("Server", "Select the id of the server you want to get information about.", this.settings.dropserverid, [
                {label: "Better Discord 2", value: "280806472928198656"},
            ], (e) => {this.settings.dropserverid = e;}),
            new Switch("Dropdown or Textbox Server Input", "OFF = Dropdown, ON = Textbox", this.settings.switchserverid, (e) => {this.settings.switchserverid = e;}),

                // Channel
            new Textbox("Channel", "Put in the id of the channel you want to get information about.", this.settings.textchannelid, (e) => {this.settings.textchannelid = e;}),
            new Dropdown("Channel", "Select the id of the channel you want to get information about.", this.settings.dropchannelid, [
                {label: "Support", value: "280806472928198656"},
                {label: "CSS and Themes", value: "334930755736174592"},
            ], (e) => {this.settings.dropchannelid = e;}),
            new Switch("Dropdown or Textbox Channel Input", "OFF = Dropdown, ON = Textbox", this.settings.switchchannelid, (e) => {this.settings.switchchannelid = e;}),

                // User
            new Textbox("User", "Put in the id of the user you want to get information about.", this.settings.textuserid, (e) => {this.settings.textuserid = e;}),
            new Dropdown("User", "Select the id of the user you want to get information about.", this.settings.dropuserid, [
                {label: "Zerebos", value: "249746236008169473"},
                {label: "Lighty", value: "239513071272329217"},
            ], (e) => {this.settings.dropuserid = e;}),
            new Switch("Dropdown or Textbox User Input", "OFF = Dropdown, ON = Textbox", this.settings.switchuserid, (e) => {this.settings.switchuserid = e;})
            );
        }

    };
};
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
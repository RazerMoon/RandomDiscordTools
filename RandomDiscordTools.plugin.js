/**
 * @name RandomDiscordTools
 * @authorId 162970149857656832
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
    version:"0.5.0",
    description:"A plugin for Bandaged BetterDiscord that has some random, potentially useful tools."},
    changelog:[
        {
            title: "New Features",
            type: "added",
            items: ["New Changelog button.",
                    "New plugin name",
                    "More settings.",
                    "Clicking on a plugin header will let you edit it!",
                    "Manual User Selection."
                    ]
        },
        {
            title: "Improvements",
            type: "improved",
            items: ["Can choose between manual and automatic id entry."]
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
    const {Modals, DiscordModules, Settings, PluginUtilities} = Api;
    const {SettingPanel, SettingField, Textbox, Dropdown, Switch} = Settings;
    const {React} = DiscordModules;

    class FireLog {
        constructor(server, channel) {
            this.css = {
                group: "font-size: 200%; color: pink; ffont-weight: bold; background-color: black;",
                object: "font-size: 100%; color: pink; ffont-weight: bold; background-color: black;",
            }
            this.owner = (e) => {let l = BdApi.findModuleByProps("getUser").getUser(e); if (typeof l != 'undefined') return l.tag; else return "error"};
        }

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

    class DisplayChangelog extends React.Component {
        constructor(props) {
            super(props);
            console.log(props)
            this.p = props
        }
        render() {
            return React.createElement(
                'div',
                {class: "flex-1O1GKY"},
                    [React.createElement(
                        'button',
                        {type: "button", id: "F_ChangelogButton", class: `button-38aScr iconWrapper-2OrFZ1 da-button lookFilled-1Gx00P ${this.p.col} sizeSmall-2cSMqn grow-q77ONN da-grow`},
                        "Changelog"
                    )]
            )
    }
}

    return class RandomDiscordTools extends Plugin {
        constructor() {
            super();

            this.c = {
                targethasClass : (e, name) => {return e.target.classList.contains(name)},
                currentChannel : BdApi.findModuleByProps('getChannelId').getChannelId,
                currentGuildId : BdApi.findModuleByProps('getGuildId').getGuildId,
                getChannelById : BdApi.findModuleByProps('getChannel').getChannel,
                getServerById  : BdApi.findModuleByProps('getGuild').getGuild,
                getUserById    : BdApi.findModuleByProps("getUser").getUser,
                userId         : BdApi.findModuleByProps('getId').getId(),
                FL             : new FireLog(),
            }

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

        onClick(e) {
            if (e.target.id == "F_ChangelogButton") {
                Modals.showChangelogModal(`${this._config.info.name} has been updated!`, this.getVersion(), this._config.changelog);
                //let window = document.querySelectorAll(".root-1gCeng")[0]
                //let old = document.querySelectorAll(".scrollerWrap-2lJEkd")[7]
                //let news = document.createElement("img")
                //news.setAttribute("src", "https://www.goodfoodireland.ie/sites/default/files/styles/provider_photo_large/public/places/photos/1404/galway%20goat%20farm%202_0.jpg?itok=iOabX7PS")
                //news.setAttribute("height", "300")
                //window.insertBefore(news, old)
                //console.log(document.querySelectorAll(".root-1gCeng"))
            }

            if (this.settings.gear == true) {
                if (this.c.targethasClass(e, "header-23xsNx")) {

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
                }
            }
            else {
                if (this.c.targethasClass(e, "wrapper-1BJsBx")) {
                    let server = this.c.getServerById(this.c.currentGuildId());
                    this.c.FL.log(server, 0, 0)
                }

                if (this.c.targethasClass(e, "name-3_Dsmg")) {
                    let channel = this.c.getChannelById(this.c.currentChannel());
                    this.c.FL.log(0, channel, 0)
                }

                if (this.c.targethasClass(e, "wrapper-3t9DeA")) {
                   if (e.target.classList.contains("avatar-SmRMf2")) return;
                   let userid = e.target.attributes.user_by_bdfdb.value
                   this.c.FL.log(0, 0, this.c.getUserById(userid))
                }

                if (this.c.targethasClass(e, "bd-addon-header")) {
                    const currentDir = BdApi.Plugins.folder;
                    let addon = e.target.parentNode.__reactInternalInstance$.return.stateNode.props.addon
                    let fileDir = require("path").resolve(`${currentDir}/${addon.filename}`)
                    console.log("Opening " + addon.filename)
                    require("electron").shell.openItem(fileDir);
                }

            }
        }
        
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

        onStart() {
            document.addEventListener("click", this.listener = e => {this.onClick(e)});
            //console.log(BdApi.alert)

            //this.displayAlert("Hello", "bu")
            //console.log(exec)

            //this.run('start "" "c:\\" ')



            //console.log(DiscordModules.ConfirmationModal)

            //console.log(DiscordClasses.Changelog)
            //console.log(ModalStack)

            //console.log(DiscordModules.ButtonData)
            //console.log(DiscordClassModules.Changelog)

            //Modals.showChangelogModal(`${this._config.info.name} has been updated!`, this.getVersion(), this._config.changelog);

            //console.log(BdApi.showConfirmationModal())

            //console.log(ReactComponents.getComponentByName("Emoji"))

            //const server = this.c.getServerById("351081433948880896");
            //console.log(BdApi.findAllModules((e) => {return e._isInitialized}))

            //console.log(DiscordModules.UserProfileModals.open("220905833431695361"));
            //React.createElement("a", {href: "https://google.com/", target: "_blank"}, "This is a link")
        }

        onStop() {
            document.removeEventListener("click", this.listener);
        }

        getSettingsPanel() {
            let col = DiscordModules.ButtonData.ButtonColors;
            return SettingPanel.build(this.saveSettings.bind(this),
            
                // Server
            new SettingField("", "", () => {}, DisplayChangelog, {col: col.GREY}),

            new Switch("Automatic or Manual Selection", "OFF = Automatic, ON = Manual", this.settings.gear, (e) => {this.settings.gear = e;}),
            
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
#!/usr/bin/env node 
const Discord = require('discord.js');
const fs = require('fs');
const config = require('./config.json');

if (config.debug) { //Debug message
    console.log('\x1b[36m%s\x1b[0m','DEBUG ENABLED');
}

require('./database_setup'); //Setup database if doesn't exist yet
const database = require('./database_cmds') //Get Datbase commands

const client = new Discord.Client();
client.commands = new Discord.Collection();





/**
 * LOAD COMMANDS
 */
fs.readdir("./commands", (err, files) => {
    if (err) throw err;
    let js_file = files.filter(f => f.split(".").pop() === "js")
    if (js_file.lenght <= 0) {
        return;
    }

    js_file.forEach((f,i)=> {
        let props = require(`./commands/${f}`);
        console.log(`${f} loaded..`);
        client.commands.set(props.help.name, props);
    })
})




/**
 * Do something upon member joining
 */
client.on('guildMemberAdd', (member) => {
    let embed = new Discord.RichEmbed()
        .setColor('#333')
        .setAuthor(member.guild.name, member.guild.iconURL)
        .setDescription(`Well hello ${member.displayName}.\nYou just joined ${member.guild.name}.\nTo get to the public section of the server you first must login at https://moderari.tk/`)
        .setFooter('For any problems try contacting a staff member.');
    member.createDM()
        .then((channel) =>  channel.send(embed))
        .catch(console.error);

    let welcome_channel = client.channels.get(config.welcome_channel);
    if (welcome_channel) {
        let embed = new Discord.RichEmbed()
        .setColor(member.displayColor)
        .setAuthor(member.user.username, member.user.avatarURL)
        .setDescription(`${member} just crossed the border.\nOur guardian has send you a message please follow its instructions..`);
        welcome_channel.send(embed);
    }
})




/**
 * MESSAGE HANDLER
 */
client.on('message', msg => {
    if (msg.author.bot) return; // Do nothing if bot

    if (msg.channel.type === 'dm') { // FOR DM's
        return console.log(`\x1b[35m`, `DM `, `\x1b[0m`,`${msg.author.username}(${msg.author}) || ${msg.content}`);
    }

    // COMMANDS
    let prefix = config.prefix;

    let msg_array = msg.content.split(" ");
    let cmd = msg_array[0];
    let args = msg_array.slice(1);

    if (cmd.substr(0,prefix.length) === prefix) { 
        // Execute file
        let command_file = client.commands.get(cmd.slice(prefix.length)); 
        if (command_file) command_file.run(client, msg, args); // Run command file if exists        
        return console.log(`\x1b[33m`, `[RUN]`, `\x1b[0m `, `${cmd}`);
    }
});







/**
 * INIT
 */
client.on('ready', () => {
    client.user.setActivity(`Exsite's Services (${config.prefix}help)`);

    console.log(`logged in as`,'\x1b[31m', `${client.user.tag}!`, `\x1b[0m`);
    console.log("\nActive servers: ") //   cyan: \x1b[36m   yellow: "\x1b[33m"

    let all_members = [];
    client.guilds.map(function(guild, k){
        if (guild.id === config.server_id) {
            if (guild.available) {
                console.log(`\x1b[32m`,`${guild.name}`,`\x1b[0m`,`[${guild.id}]`); 
            } else {
                console.log(`\x1b[31m`,`${guild.name}`,`\x1b[0m`,`[${guild.id}]`); 
            }
            database.add_server(guild);
            // database.add_server_users(guild)
            let members = guild.members.array();
            for (var i = 0; i < members.length; ++i) {
                all_members.push(members[i]);
            }
        }
    })
    database.add_server_users(all_members)
    console.log('\n\n')
});
client.login(config.token);

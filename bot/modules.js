const database = require('./database_cmds');
const Discord = require('discord.js');
const config = require('./config.json');

module.exports.create_roles = (guild) => {
    database.get_roles((rows) => {
        if (rows) {
            if (rows.length > 0) {
                for (i in rows) {
                    let role = rows[i];

                    let allowed = true;
                    let guild_roles =  guild.roles.array();
                    for (i in guild_roles) { // Check if it isn't already created
                        if (guild_roles[i].name == role.name) {
                            allowed = false;
                        }
                    }
                    if (allowed) {
                        // console.log('Creating new role '+role.name);
                        // console.log('PERMISSIONS');
                        // console.log(config.role_permissions[role.level]);
                        // console.log('PERMISSIONS');
                        switch(role.level) {
                            case -1:
                                guild.createRole({
                                    name: role.name,
                                    color: [100,50,50],
                                    position: role.level,
                                    hoist: true,
                                    permissions: config.role_permissions[role.level]
                                })
                                .then(role => console.log(`Created new role with name ${role.name} and color ${role.color}`))
                                .catch(console.error);
                            break;
                            case 0:
                                guild.createRole({
                                    name: role.name,
                                    color: [100,50,50],
                                    position: role.level,
                                    permissions: config.role_permissions[role.level]
                                })
                                .then(role => console.log(`Created new role with name ${role.name} and color ${role.color}`))
                                .catch(console.error);
                                break;
                            case 1:
                                guild.createRole({
                                    name: role.name,
                                    color: [50,80,80],
                                    position: role.level,
                                    permissions: config.role_permissions[role.level]
                                })
                                .then(role => console.log(`Created new role with name ${role.name} and color ${role.color}`))
                                .catch(console.error);
                                break;
                            case 2:
                                guild.createRole({
                                    name: role.name,
                                    color: [50,100,100],
                                    position: role.level,
                                    permissions: config.role_permissions[role.level]
                                })
                                .then(role => console.log(`Created new role with name ${role.name} and color ${role.color}`))
                                .catch(console.error);
                                break;let guild_roles =  guild.roles.array()
                            case 3:
                                guild.createRole({
                                    name: role.name,
                                    color: [50,100,50],
                                    position: role.level,
                                    permissions: config.role_permissions[role.level]
                                })
                                .then(role => console.log(`Created new role with name ${role.name} and color ${role.color}`))
                                .catch(console.error);
                                break;
                            case 4:
                                guild.createRole({
                                    name: role.name,
                                    color: [50,50,100],
                                    position: role.level,
                                    permissions: config.role_permissions[role.level]
                                })
                                .then(role => console.log(`Created new role with name ${role.name} and color ${role.color}`))
                                .catch(console.error);
                                break;
                            default:
                                guild.createRole({
                                    name: role.name,
                                    color: 'DARKER_GREY',
                                    position: 1,
                                    permissions: config.role_permissions['1']
                                })
                                .then(role => console.log(`Created new role with name ${role.name} and level ${role.level}`))
                                .catch(console.error);
                                break;
                        }
                    }
                }
                let guild_roles =  guild.roles.array();
                for (i in guild_roles) { // Check if guild roles is also in db else remove
                    // console.log(guild_roles[i].name + '\n===================================\n')
                    if (!(guild_roles[i].name == "Moderari" || guild_roles[i].name == "@everyone")) { //check if role isn't moderari or @everyone
                        let in_db = false;
                        // console.log('RUN '+ guild_roles[i].name);
                        for (x in rows) {
                            // console.log(guild_roles[i].name);
                            if (rows[x].name === guild_roles[i].name) { // Is equal to db roles
                                // console.log('RUN '+ guild_roles[i].name + '\n');
                                in_db = true;
                            }
                        }
                        if (!in_db) {
                            guild_roles[i].delete('Removing Non-DB Role')
                            .then(deleted => console.log(`Deleted role ${deleted.name}`))
                            .catch(console.error);
                        }
                    }
                }
            }
        }
    })
};

module.exports.remove_roles = (guild) => {
    let guild_roles =  guild.roles.array();
    for (i in guild_roles) {
        if (!(guild_roles[i].name == "Moderari" || guild_roles[i].name == "@everyone")) { //Don't delete moderari role
            // console.log(guild_roles[i]);
            guild_roles[i].delete('Removing all Roles')
            .then(deleted => console.log(`Deleted role ${deleted.name}`))
            .catch(console.error);
        }
    }
}
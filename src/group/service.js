const repository = require('../user/repository')

module.exports.leave = function (username) {
    const user = repository.get(username);
    if (user.group && user.group.admin && module.exports.members(user.group.name).length > 1) {
        // the user is an admin and there are other members in the group
        // then we assign a new admin
        const newAdmin = module.exports.members(user.group.name).find(member => member.username !== username);
        newAdmin.group.admin = true;
    }
    delete user.group;
    repository.save();
}

module.exports.join = function (groupName, username) {
    module.exports.leave(username);
    const user = repository.get(username);
    user.group = {
        name: groupName,
        admin: false,
    }
    if (module.exports.members(groupName).length === 1) {
        // the group was newly created, we make the user an admin
        user.group.admin = true;
    }
    repository.save();
}

/**
 * Return members of a group.
 *
 * @param groupName
 * @returns {Array}
 */
module.exports.members = function (groupName) {
    return repository.users.filter(user => user.group?.name === groupName);
}

module.exports.list = function () {
    const groups = {};
    repository.users.forEach(user => {
        if (user.group) {
            if (!groups[user.group.name]) {
                groups[user.group.name] = {
                    name: user.group.name,
                    count: 0,
                };
            }
            groups[user.group.name].count++;
        }
    });
    return groups;
}

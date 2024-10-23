const { sendLeaveMessage } = require('./sendLeaveMessage');
const { addRole } = require('./addRole');
const { getCommands } = require('./getCommands');
const { deployCommands } = require('./deploy-commands');

module.exports = {
	sendLeaveMessage,
	addRole,
	getCommands,
	deployCommands,
}

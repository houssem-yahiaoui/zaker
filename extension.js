// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
var cron = require('node-cron');
const getAya = require('./lib/quran');
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

function getQuranMessageFormat(ayaMetadata) {
	if(ayaMetadata.language === 'ar') {
		return `
			${ayaMetadata.basmalah.text}\n\n
			${ayaMetadata.foundInitialVerse.text} <${ayaMetadata.foundInitialVerse.id}
			${ayaMetadata.foundSecondVerse.text}<${ayaMetadata.foundSecondVerse.id}>\n
			${ayaMetadata.name}`;
	} else {
		return `
			${ayaMetadata.basmalah.text}\n\n
			${ayaMetadata.foundInitialVerse.text} <${ayaMetadata.foundInitialVerse.id}>\n
			${ayaMetadata.foundInitialVerse.translation} <${ayaMetadata.foundInitialVerse.id}>\n
			${ayaMetadata.foundSecondVerse.text}<${ayaMetadata.foundSecondVerse.id}>\n
			${ayaMetadata.foundSecondVerse.translation}<${ayaMetadata.foundSecondVerse.id}>\n
			${ayaMetadata.name} - ${ayaMetadata.transliteration}`;
	}
}

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {
	console.log('Congratulations, your extension "zaker" is now active!');
	vscode
		.window
		.showInformationMessage(`Zaker is active, you will get ${vscode.workspace.getConfiguration().get('general.zakerNotificationTheme')} notification each ${vscode.workspace.getConfiguration().get('general.zakerNotificationFrequency')}`, 'Show example')
		.then(async selection => {
			if(selection == "Show example") {
				let ayaMetadata = await getAya(vscode.workspace.getConfiguration());
				const msg = getQuranMessageFormat(ayaMetadata)
				vscode.window.showInformationMessage(msg, {
					modal: true
				});
			}
		});

	let timing = ""
	switch (vscode.workspace.getConfiguration().get('general.zakerNotificationFrequency')) {
		case 'Each 5 min':
			timing = "*/5 * * * *";
			break;
		case 'Each 10 min':
			timing = "*/10 * * * *";
			break;
		case 'Each 30 min':
			timing = "*/30 * * * *";
			break;
		case 'Each 1 hour':
			timing = "0 * * * *";
			break;
		case 'Each 3 hour':
			timing = "0 */3 * * *";
			break;
		case 'Each 6 hour':
			timing = "0 */6 * * *";
			break;
	}
	cron.schedule(timing, async () => {
		let ayaMetadata = await getAya(vscode.workspace.getConfiguration());
		const msg = getQuranMessageFormat(ayaMetadata)
		vscode.window.showInformationMessage(msg, {
			modal: true
		});
	});
	let showAya = vscode.commands.registerCommand('zaker.showAya', async function () {
		let ayaMetadata = await getAya(vscode.workspace.getConfiguration());
		const msg = getQuranMessageFormat(ayaMetadata)
		vscode.window.showInformationMessage(msg, {
			modal: true
		});
	});
	let showHadith = vscode.commands.registerCommand('zaker.showHadith', function () {
		vscode.window.showInformationMessage("... سيدعم البرنامح بالأحاديث النبوية قريبا")
	});

	let showDoua = vscode.commands.registerCommand('zaker.showDoua', function () {
		vscode.window.showInformationMessage("... سيدعم البرنامح بالأدعبة النبوية قريبا")
	});

	context.subscriptions.push(showAya);
	context.subscriptions.push(showHadith);
	context.subscriptions.push(showDoua);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
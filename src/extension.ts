import * as vscode from 'vscode';
import * as path from 'path';
import * as cp from 'child_process';
import { ExtensionContext, extensions, commands, workspace, l10n } from 'vscode';
import { CodeForIBMi } from '@halcyontech/vscode-ibmi-types';
import { ComponentsTreeDataProvider } from './explorer/componentsTreeDataProvider';

export let code4i: CodeForIBMi;
export let extensionContext: ExtensionContext;

let serverProcess: cp.ChildProcess | undefined;
export function activate(context: vscode.ExtensionContext) {

    extensionContext = context;
    const codeForIBMiExtension = extensions.getExtension<CodeForIBMi>('halcyontechltd.code-for-ibmi');
    if (!codeForIBMiExtension) {
        throw new Error(l10n.t("This extension requires the 'halcyontechltd.code-for-ibmi' extension to be installed and activated!"));
    }

    const startCommand = vscode.commands.registerCommand('aiSearchSimilarities.start', async () => {
        const serverPath = path.join(context.extensionPath, 'SRC', 'code_similarity.py');
        serverProcess = cp.spawn('python', [serverPath], { shell: true });

        serverProcess.stdout?.on('data', (data) => {
            console.log(`Server: ${data}`);
        });

        serverProcess.stderr?.on('data', (data) => {
            console.error(`Server Error: ${data}`);
        });

        vscode.window.showInformationMessage('Flask server started!');

        // Open the webview
        const panel = vscode.window.createWebviewPanel(
            'aiSearchSimilarities',
            'AI Search Similarities',
            vscode.ViewColumn.One,
            { enableScripts: true }
        );

        // Set a custom icon for the webview panel
        panel.iconPath = {
            light: vscode.Uri.file(path.join(context.extensionPath, 'resources', 'light', 'icon.png')),
            dark: vscode.Uri.file(path.join(context.extensionPath, 'resources', 'dark', 'icon.png'))
        };

        const webviewPath = vscode.Uri.file(
            path.join(context.extensionPath, 'SRC', 'web-views', 'code-similarity-ui.html')
        );

        panel.webview.html = (await vscode.workspace.fs.readFile(webviewPath)).toString();
    });

    context.subscriptions.push(startCommand);

    const componentsTreeDataProvider = new ComponentsTreeDataProvider();
    vscode.window.registerTreeDataProvider('componentsView', componentsTreeDataProvider);

    context.subscriptions.push(
        vscode.commands.registerCommand('componentsView.refresh', () => componentsTreeDataProvider.refresh())
    );
}

export function deactivate() {
    if (serverProcess) {
        serverProcess.kill();
    }
}
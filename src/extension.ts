import * as vscode from 'vscode';
import * as path from 'path';
import * as cp from 'child_process';
import { ExtensionContext, extensions, l10n } from 'vscode';
import { CodeForIBMi } from '@halcyontech/vscode-ibmi-types';
import { ComponentsTreeDataProvider } from './explorer/componentsTreeDataProvider';
import { AiSimilarityResultsProvider } from './explorer/aiSimilarityResultsProvider';
import axios from 'axios';

const outputChannel = vscode.window.createOutputChannel('AI-powered code similarity detection and analysis');

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

        const panel = vscode.window.createWebviewPanel(
            'aiSearchSimilarities',
            'AI Search Similarities',
            vscode.ViewColumn.One,
            { enableScripts: true }
        );
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

    const aiSimilarityResultsProvider = new AiSimilarityResultsProvider();
    vscode.window.registerTreeDataProvider('aiSimilarityResults', aiSimilarityResultsProvider);

    context.subscriptions.push(
        vscode.commands.registerCommand('aiSimilarityResults.openWebview', async (node) => {
            const panel = vscode.window.createWebviewPanel(
                'aiSimilarityResult',
                `Similarity Result: ${node.label}`,
                vscode.ViewColumn.One,
                { enableScripts: true }
            );

            const webviewPath = vscode.Uri.file(
                path.join(context.extensionPath, 'src', 'web-views', 'code-similarity-ui.html')
            );

            panel.webview.html = (await vscode.workspace.fs.readFile(webviewPath)).toString();

            panel.webview.onDidReceiveMessage(async (message) => {
                if (message.command === 'search') {
                    const sourceCode = message.sourceCode;
                    const results = await performAISearch(sourceCode);

                    panel.webview.postMessage({ command: 'displayResults', results });
                }
            });
        })
    );

    async function performAISearch(sourceCode: string): Promise<string[]> {
        try {
            const response = await axios.post('http://localhost:5000/search', { sourceCode });
            return response.data.results;
        } catch (error) {
            console.error('Error fetching AI search results:', error);
            throw new Error('Failed to fetch AI search results.');
        }
    }

    // Example command to show results in the output channel
    const disposable = vscode.commands.registerCommand('aiSimilarity.showResults', () => {
        // Example output
        outputChannel.appendLine('Similarity Results:');
        outputChannel.appendLine('1. Function A is 90% similar to Function B');
        outputChannel.appendLine('2. Function C is 85% similar to Function D');

        // Show the output channel
        outputChannel.show();
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
    if (serverProcess) {
        serverProcess.kill();
    }
}


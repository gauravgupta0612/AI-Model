import * as vscode from 'vscode';

class SimilarityResultNode {
    constructor(public readonly label: string, public readonly description: string) {}
}

export class AiSimilarityResultsProvider implements vscode.TreeDataProvider<SimilarityResultNode> {
    private _onDidChangeTreeData: vscode.EventEmitter<SimilarityResultNode | undefined | void> = new vscode.EventEmitter<SimilarityResultNode | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<SimilarityResultNode | undefined | void> = this._onDidChangeTreeData.event;

    private results: SimilarityResultNode[] = [
        new SimilarityResultNode('Result 1', 'Description of Result 1'),
        new SimilarityResultNode('Result 2', 'Description of Result 2')
    ];

    getTreeItem(element: SimilarityResultNode): vscode.TreeItem {
        const treeItem = new vscode.TreeItem(element.label, vscode.TreeItemCollapsibleState.None);
        treeItem.description = element.description;
        treeItem.command = {
            command: 'aiSimilarityResults.openWebview',
            title: 'Open Similarity Result',
            arguments: [element]
        };
        return treeItem;
    }

    getChildren(): SimilarityResultNode[] {
        return this.results;
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }
}
import * as vscode from 'vscode';

export class ComponentNode {
    constructor(public readonly label: string, public readonly children: ComponentNode[] = []) {}
}

export class ComponentsTreeDataProvider implements vscode.TreeDataProvider<ComponentNode> {
    private _onDidChangeTreeData: vscode.EventEmitter<ComponentNode | undefined | void> = new vscode.EventEmitter<ComponentNode | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<ComponentNode | undefined | void> = this._onDidChangeTreeData.event;

    private components: ComponentNode[] = [
        new ComponentNode('Component 1', [
            new ComponentNode('Subcomponent 1.1'),
            new ComponentNode('Subcomponent 1.2')
        ]),
        new ComponentNode('Component 2', [
            new ComponentNode('Subcomponent 2.1')
        ])
    ];

    getTreeItem(element: ComponentNode): vscode.TreeItem {
        const treeItem = new vscode.TreeItem(element.label, element.children.length ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None);
        return treeItem;
    }

    getChildren(element?: ComponentNode): ComponentNode[] {
        if (element) {
            return element.children;
        } else {
            return this.components;
        }
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }
}
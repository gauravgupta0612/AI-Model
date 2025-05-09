import { askPassword, Connection, PasswordHandler } from '@arcad/vscode-arcad-utils';
import vscode, { l10n } from 'vscode';
export class SecretStore implements PasswordHandler {
    constructor(readonly secrets: vscode.SecretStorage) {
    }

    public async deletePassword(connection: Connection) {
        await this.secrets.delete(connection.userAtHost());
    }

    public async getPassword(connection: Connection): Promise<string> {
        let password;
        try {
            password = await this.getPasswordFromProvider(connection) || await this.secrets.get(connection.userAtHost());
        }
        catch (error) {
        }

        return password || await this.askStorePassword(connection) || "";;
    }

    private async askStorePassword(connection: Connection): Promise<string | undefined> {
        const password = await askPassword(l10n.t("Pleaser enter {0} password.", connection.userAtHost()), l10n.t("{0} password", connection.userAtHost()));
        if (password && password.trim().length > 0) {
            this.secrets.store(connection.userAtHost(), password);
        }

        return password;
    }

    private async getPasswordFromProvider(connection: Connection) {
  
            return (await vscode.commands.executeCommand<string>(`code-for-ibmi.getPassword`, `arcadsoftware.arcad-microservices`, l10n.t("Connect to ARCAD-Transformer Microservices using IBM i credentials.")));
        }
    
}

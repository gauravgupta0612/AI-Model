import axios, { AxiosInstance } from 'axios';

class ApiClient {
    private client: AxiosInstance;

    constructor(baseURL: string) {
        this.client = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    public async getApplications(serverId: number) {
        try {
            const response = await this.client.get(`/servers/${serverId}/applications`);
            return response.data;
        } catch (error) {
            console.error('Error fetching applications:', error);
            throw error;
        }
    }

    // public async getEnvironments(serverid: number, application: string): Promise<AFSResponse<'environments', Environment[]>> {
	// 	return (await (await this.getClient()).get<AFSResponse<'environments', { name: string, description: string }[]>>(`/servers/${serverid}/environments?application=${application}`));
	// }
	// public async getVersions(serverid: number, application: string, environment: string) {
	// 	return (await (await this.getClient()).get<AFSResponse<'versions', { name: string, status: string, description: string, library: string }[]>>(`/servers/${serverid}/versions?application=${application}&environment=${environment}&status=OPENED`));
	// }
	// public async getTargetApplications(serverid: number, environment: string, version: string) {
	// 	return (await (await this.getClient()).get<AFSResponse<'applications', string[]>>(`/servers/${serverid}/applications`,
	// 		{
	// 			params: {
	// 				environment: environment,
	// 				version: version
	// 			}
	// 		}
	// 	));
	// }
	// public async getSources(serverid: number, application: string, environment: string, version: string, singular=false, component?:string, type?:string): Promise<AFSResponse<'sources', SourceMember[]>> {
	// 	return (await (await this.getClient()).get<AFSResponse<'sources', SourceMember[]>>(`/servers/${serverid}/sources`,
	// 		{
	// 			params: {
	// 				application: application,
	// 				environment: environment,
	// 				version: version,
	// 				singular,
	// 				component,
	// 				type
	// 			}
	// 		}
	// 	));
	// }

}



export default ApiClient;
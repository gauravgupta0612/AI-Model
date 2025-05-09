export interface ListResponse<T> {
    list: List<T>;
}

export interface List<T> {
    total: number;
    count: number;
    rank: number;
    items?: T[];
}

export interface Statusmessage {
    code: string;
    level1: string;
    status: string;
}

export type AFSResponse<Name extends string, Type> = {
    statusmessage: {
        code: string;
        level1: string;
        status: string;
    };
    ibmicommands: {
        concatenatedmessage: string;
        command?: string;
    };
} & {
    [name in Name]: Type;
};

export type StatusMessage = {
    status: string;
};

export interface Keyword {
    keywordid: number;
    value: string;
}

export interface KeywordResponse {
    item: Keyword[];
    statusmessage: StatusMessage;
}

export interface WebServerResponse {
    item: WebServerItem;
    statusmessage: StatusMessage;
}

export interface WebServerItem {
    webserver: Webserver[];
}

export interface WebServiceResponse {
    item: WebserviceItem;
    statusmessage: StatusMessage;
}

export interface WebserviceItem {
    webservice: Webservice[];
}

export interface Webservice {
    author: string;
    pcml: string;
    httprequestmethod: string;
    bindingobject: string;
    procedure: string;
    uri: string;
    version: string;
    serviceuserid: string;
    bindingtype: string;
    servicetype: string;
    environment: string;
    propertiesfile: string;
    moduleobject: string;
    servicedescription: string;
    application: string;
    moduletype: string;
    servicename: string;
    id: number;
    webserverid: number;
    status: string;
}

export interface Webserver {
    serverlocationdirectory: string;
    serveruserid: string;
    author: string;
    serverdescription: string;
    servername: string;
    id: number;
    serverid: number;
    status: string;
}

export interface ExternalizationEntity {
    extractionid: number;
    mocked: number;
    file: string;
    prototypetype: string;
    header: number;
    id: number;
    type: string;
    prototype: string;
    prototypefile: string;
    object: string;
    status: number;
    description: string;
    author: string;
}

export interface ApiResponse {
    externalization: ExternalizationEntity;
    statusmessage: Statusmessage;
}

export interface ExternalizationMacroAFSResponse {
    statusmessage: {
        code: string;
        level1: string;
        level2: string;
        status: string;
    };
}


export interface Version {
    library: string;
    name: string;
    description: string;
    env: string;
    status: string;
}
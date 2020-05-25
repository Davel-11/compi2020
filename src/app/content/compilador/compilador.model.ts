

export interface NodeObject {

    priority?: number;
    initialOperation?: any;
    nodeLeft?: string;
    nodeRight?: string;
    operation?: string;
    operationResult?: number;
    pendingToProcess?: string;
    nextTree?: any;
}

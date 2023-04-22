export interface ServerResponse{
    success : boolean,
    message : string
}

export interface GetExpensesResponse{
    success : boolean,
    data : Expense[]
}

export interface GetIncomesResponse{
    success : boolean,
    data : Income[]
}

export interface Expense {
    id : number,
    position : number,
    desc: string,
    date: string,
    category : string,
    amount: number
}

export interface Income {
    id : number,
    position : number,
    desc: string,
    date: string,
    source : string,
    amount: number
}

export interface SummaryResponse{
    success : boolean,
    data : Expense[],
    total : number,
    subs : number[]
    chart_data : dateAmount[]
}

export interface dateAmount{
    date : Date,
    amount:number
} 

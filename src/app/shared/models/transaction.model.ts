export class Transaction {
    constructor(
        public id: number,
        public date: Date,
        public username: string,
        public amount: number,
        public balance: number
    ) { }
}

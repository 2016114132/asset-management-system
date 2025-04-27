abstract class DatabaseModel {
    id?: number;
    created_at?: string;
    updated_at?: string;

    constructor(id?: number, created_at?: string, updated_at?: string) {
        this.id = id;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    getId():number | undefined{
        return this.id;
    }

    abstract save(): Promise<boolean>;
}

export default DatabaseModel;
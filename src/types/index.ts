export type MajorShort = {
    id: number;
    name: string;
};

export type MajorShortResponse = MajorShort[]; 

export type Student = {
    id:number;
    rut:string;
    dv:string;
    first_name:string;
    second_name:string;
    last_name:string;
    second_last_name:string;
    major:number
}

export type Major = {
    id: number;
    name: string;
    faculty: string;
    subjects: [];
}

export type Subject = {
    id:number;
    name:string;
    major: MajorShort["id"][];
    students:Student[]

}
export type Asistencia = {
    fecha: Date;
    Students:Student[];
}

export type SubjectList = Subject[]; 

export const validarId = (idParam: number): number =>{

    const id = Number(idParam);
    
    if(!id || isNaN(id) || id <=0) {
        throw new Error("Id fonecido é invalido!S");
    }
return id;
};

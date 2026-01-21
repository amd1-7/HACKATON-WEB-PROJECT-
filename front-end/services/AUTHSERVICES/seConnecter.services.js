const API_URL = `http://localhost:8080/api/auth/login`

const seConnecterServices = async (entrée)=>{
    try {
        const reponse = await fetch(API_URL,{
            method:'POST',
            headers:{
                "Content-type":"application/json"
            },
            body:JSON.stringify(entrée)
        })

        const data = await reponse.json();

        if(!reponse.ok){
            throw new Error(data.message || 'Erreur lors de la création du compte.')
        }

        return data;
    } catch (error) {
        throw error;
    }
}
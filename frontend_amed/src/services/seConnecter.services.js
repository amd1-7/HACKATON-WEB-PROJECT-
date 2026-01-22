const API_URL = `http://localhost:8080/api/auth/login`;

const connexionService = async(entrée)=>{
    try {
        const reponse = await fetch(`${API_URL}`,{
            method:'POST',
            headers:{"Content-type":"application/json"},
            body:JSON.stringify(entrée)
        })
        const data = await reponse.json()

        if(!reponse.ok){
            throw new Error(data.message || "Une erreur est survenue");
        }
        else{
            return (data);
        }
    } catch (error) {
        throw error;
    }
}

export default connexionService;
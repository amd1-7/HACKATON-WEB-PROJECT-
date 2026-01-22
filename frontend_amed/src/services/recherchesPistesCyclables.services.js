const API_URL = `http://localhost:8080/recherche/bus`

const recherchesPistesCyclablesServices = async (entrée)=>{
    try {
        const token = localStorage.getItem('TOKEN')
        const reponse = await fetch(`${API_URL}`,{
            method:'POST',
            headers:{
                "Content-type":"application/json",
                "Authorization":`Bearer ${token}`
            },
            body:JSON.stringify(entrée),
        })

        const data = await reponse.json()

        if(!reponse.ok){
            throw new Error(data.message ||'Error lors du lancement de la requète')
        }

        const dataPistesCyclables = data

        return dataPistesCyclables
    } catch (error) {
        throw error
    }
}

export default recherchesPistesCyclablesServices;
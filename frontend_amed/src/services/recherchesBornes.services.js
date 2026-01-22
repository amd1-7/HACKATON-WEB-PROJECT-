const API_URL = `http://localhost:8080/recherche/borne`

const recherchesBornesServices = async (entrée)=>{
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

        const dataBorne = data

        return dataBorne
    } catch (error) {
        throw error
    }
}

export default recherchesBornesServices;
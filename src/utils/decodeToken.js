
export const decodeToken = () => {
    const token = localStorage.getItem("token")
    if(!token){
        console.error('no token found in localStorage')
        return null;
    }
    try{
        const arrayToken = token.split('.')
        const tokenPayload = JSON.parse(atob(arrayToken[1]));
        return tokenPayload.userId;
    }
    catch(error){
        console.error(error)
    }
}
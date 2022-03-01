import jwt from 'jsonwebtoken'


export const isAuthenticated = () =>{
    const token = localStorage.getItem('access_token');
    // const refreshToken = localStorage.getItem('refresh_token');

    if(token){
        const { expire_in } = jwt.decode(token)

        return new Date(expire_in) > new Date()
    }
    return false;
}

export const getEmailFromInvitation = (token) =>{
    if(token){
        const { email } = jwt.decode(token)
        return email
    }
    return false;
}

export default function validateSignup(values) {
    let errors = {}

    //validate users name 
    if(!values.name){
        errors.name = 'El nombre es obligatorio'
    }
    // validate email
    if (!values.email){
        errors.email= 'El Email es obligatorio'
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = 'Email no válido'
    }
    // validate passwords
    if(!values.password) {
        errors.password = 'El password es obligatorio'
    } else if (values.password.length < 6) {
        errors.password = 'El password debe tener al menos 6 caractéres'
    }
    return errors
}
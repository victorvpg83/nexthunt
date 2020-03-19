export default function validateSignup(values) {
    let errors = {}

    //validate users name 
    if(!values.name){
        errors.name = 'El nombre es obligatorio'
    }
    // validate company
    if (!values.company){
        errors.company= 'La Empresa es obligatoria'
    }
    // validate URL
    if (!values.url){
        errors.url = 'La url es obligatoria'
    } else if(!/^(ftp|http|https):\/\/[^ "]+$/.test(values.url)) {
        errors.url= 'La url no es válida'
    }
    // validate description
    if(!values.description) {
        errors.description = 'Agrega descripción al producto'
    }
    
    return errors
}
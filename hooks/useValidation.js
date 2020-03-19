import React, { useState, useEffect } from 'react';


const useValidation = (initialState, validate,fn) => {

    const [values, saveValues] = useState(initialState)
    const [errors, saveErrors] = useState({})
    const [submitForm, saveSubmitForm] = useState(false)

    useEffect(()=>{
        if(submitForm) {
            const noErrors = Object.keys(errors).length === 0
            if(noErrors){
                fn() //function in component
            }
            saveSubmitForm(false)
        }
    }, [errors])


    // write form
    const handleChange = e =>{
        saveValues({
            ...values,
            [e.target.name] : e.target.value
        })
    }

    // submit function
    const handleSubmit = e =>{
        e.preventDefault()
        const errorsValidation = validate(values)
        saveErrors(errorsValidation)
        saveSubmitForm(true)
    }

    //on blur
    const handleBlur = ()=> {
        const errorsValidation = validate(values)
        saveErrors(errorsValidation)
    }

    return {
        values,
        errors,
        handleSubmit,
        handleChange,
        handleBlur
    };
};

export default useValidation;
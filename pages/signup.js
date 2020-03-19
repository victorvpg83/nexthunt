import React, { useState } from 'react'
import {css} from '@emotion/core'
import Router from 'next/router'
import  styled  from '@emotion/styled'
import  Layout  from "../components/layout/Layout"
import {Form, Field, InputSubmit, Error} from '../components/ui/Form'

import firebase from '../firebase'

//validations
import useValidation from '../hooks/useValidation'
import validateSignup from '../validation/validateSignup'

const H1 = styled.h1`
    text-align: center;
    margin-top: 5rem
`

const STATE_INITIAL = {
    name:'',
    email:'',
    password:''
}
const Signup = () => {

    const [error, saveError] = useState(false)

    const { values, errors, handleSubmit, handleChange, handleBlur} = useValidation(STATE_INITIAL, validateSignup, signup)
    const {name, email, password} = values

    async function signup(){
        try {
            await firebase.createUser(name, email, password)
            Router.push('/')
        } catch (error) {
            console.error('Hubo un error al crear el usuario ', error.message)
            saveError(error.message)

        }
    }


    return (
        <div>
            <Layout>
                <>
                    <H1
                        css={css`
                            text-align: center;
                            margin-top: 5rem;
                        `}
                    >Crear cuenta</H1>
                    <Form
                        onSubmit={handleSubmit}
                        noValidate
                    >
                        <Field>
                            <label htmlFor='name' >Nombre</label>
                            <input 
                                type='text'
                                id='name'
                                placeholder='Nombre'
                                name='name'
                                value={name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Field>
                        {errors.name && <Error> {errors.name} </Error>}
                        <Field>
                            <label htmlFor='email' >Email</label>
                            <input 
                                type='email'
                                id='email'
                                placeholder='correo@correo'
                                name='email'
                                value={email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Field>
                        {errors.email && <Error> {errors.email} </Error>}
                        <Field>
                            <label htmlFor='password' >Password</label>
                            <input 
                                type='password'
                                id='password'
                                placeholder='Password'
                                name='password'
                                value={password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Field>
                        {errors.password && <Error> {errors.password} </Error>}
                        {error && <Error> {error} </Error>}
                        <InputSubmit 
                            type='submit'
                            value='Crear cuenta'
                        />
                    </Form>
                </>
            </Layout>
        </div>
    );
};

export default Signup;
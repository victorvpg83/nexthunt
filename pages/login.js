import React, { useState } from 'react'
import {css} from '@emotion/core'
import Router from 'next/router'
import  styled  from '@emotion/styled'
import  Layout  from "../components/layout/Layout"
import {Form, Field, InputSubmit, Error} from '../components/ui/Form'

import firebase from '../firebase'

//validations
import useValidation from '../hooks/useValidation'
import validateLogin from '../validation/validateLogin'

const H1 = styled.h1`
    text-align: center;
    margin-top: 5rem
`
const STATE_INITIAL = {
    email:'',
    password:''
}

const Login= () => {

    const [error, saveError] = useState(false)

    const { values, errors, handleSubmit, handleChange, handleBlur} = useValidation(STATE_INITIAL, validateLogin, login)
    const { email, password} = values

    async function login() {
        try {
            await firebase.loginUser(email,password)
            Router.push('/')
        } catch (error) {
            console.error('Hubo un error al autenticar el usuario ', error.message)
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
                    >Iniciar Sesión</H1>
                    <Form
                        onSubmit={handleSubmit}
                        noValidate
                    >
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
                            value='Iniciar sesión'
                        />
                    </Form>
                </>
            </Layout>
        </div>
    );
}

export default Login
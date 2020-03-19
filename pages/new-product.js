import React, { useState, useContext } from 'react'
import {css} from '@emotion/core'
import Router, {useRouter} from 'next/router'
import FileUploader from 'react-firebase-file-uploader'
import  styled  from '@emotion/styled'
import  Layout  from "../components/layout/Layout"
import {Form, Field, InputSubmit, Error} from '../components/ui/Form'

import {FirebaseContext} from '../firebase'

import Error404 from '../components/layout/404'

//validations
import useValidation from '../hooks/useValidation'
import validateCreateProduct from '../validation/validateCreateProduct'

const H1 = styled.h1`
    text-align: center;
    margin-top: 5rem
`

const STATE_INITIAL = {
    name:'',
    company:'',
    // image:'',
    url:'',
    description:''
}

const NewProduct= () => {
    //image state
    const [imageName, saveName] = useState('')
    const [uploading, saveUploading] = useState('false')
    const [progress, saveProgress] = useState(0)
    const [urlImage, saveUrlImage] = useState('')

    const [error, saveError] = useState(false)

    const { values, errors, handleSubmit, handleChange, handleBlur} = useValidation(STATE_INITIAL, validateCreateProduct, createProduct)
    const {name, company, url,image, description} = values

    //hook router to redirect
    const router = useRouter()

    //context CRUD firebase
    const {user, firebase} = useContext(FirebaseContext)

    async function createProduct(){
        // user no authenticated
        if (!user){
            router.push('/login')
        }
        //create new product object
        const product = {
            name,
            company,
            url,
            urlImage,
            description,
            votes:0,
            comments: [],
            created: Date.now(),
            creator: {
                id: user.uid,
                name: user.displayName
            },
            hasVote:[]
        }

        //insert in database
        firebase.db.collection('products').add(product)

        return router.push('/')

    }
    const handleUploadStart = () => {
        saveProgress(0);
        saveUploading(true);
    }
  
    const handleProgress = progress => saveProgress({ progress });
  
    const handleUploadError = error => {
        saveUploading(error);
        console.error(error);
    };
  
    const handleUploadSuccess = name => {
        saveProgress(100);
        saveUploading(false);
        saveName(name)
        firebase
            .storage
            .ref("products")
            .child(name)
            .getDownloadURL()
            .then(url => {
              console.log(url);
              saveUrlImage(url);
            } );
    };

    return (
        <div>
            <Layout>
                {!user ? <Error404 /> : (
                    <>
                    <H1
                        css={css`
                            text-align: center;
                            margin-top: 5rem;
                        `}
                    >Nuevo Producto</H1>
                    <Form
                        onSubmit={handleSubmit}
                        noValidate
                    >
                    <fieldset>
                        <legend>Información general</legend>
                    
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
                            <label htmlFor='company' >Empresa</label>
                            <input 
                                type='text'
                                id='company'
                                placeholder='Empresa'
                                name='company'
                                value={company}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Field>
                        {errors.company && <Error> {errors.company} </Error>}
                        <Field>
                            <label htmlFor='image' >Imagen</label>
                            <FileUploader
                                accept='image/*' 
                                id='image'
                                name='image'
                                randomizeFilename
                                storageRef={firebase.storage.ref("products")}
                                onUploadStart={handleUploadStart}
                                onUploadError={handleUploadError}
                                onUploadSuccess={handleUploadSuccess}
                                onProgress={handleProgress}
                            />
                        </Field>
                        <Field>
                            <label htmlFor='url' >URL</label>
                            <input 
                                type='url'
                                id='url'
                                name='url'
                                placeholder='URL del producto'
                                value={url}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Field>
                        {errors.url && <Error> {errors.url} </Error>}
                    </fieldset>
                    <fieldset>
                        <legend>Sobre tu producto</legend>
                        <Field>
                            <label htmlFor='description' >Descripción</label>
                            <textarea 
                                id='description'
                                name='description'
                                value={description}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Field>
                        {errors.description && <Error> {errors.description} </Error>}
                    </fieldset>

                        {error && <Error> {error} </Error>}
                        <InputSubmit 
                            type='submit'
                            value='Crear producto'
                        />
                    </Form>
                </>
                )}
                
            </Layout>
        </div>
    );
};

export default NewProduct
import React, { useEffect, useState, useContext } from 'react'
import { useRouter } from 'next/router'
import styled from '@emotion/styled'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { es } from 'date-fns/locale'

import Layout from '../../components/layout/Layout'
import { FirebaseContext } from '../../firebase'
import Error404 from '../../components/layout/404'
import { Field, InputSubmit } from '../../components/ui/Form'
import Button from '../../components/ui/Button'

const H1 = styled.h1`
    text-align: center;
    margin-top: 5rem;
`
const H2 = styled.h2`
    margin: 2rem 0;
`
const Li = styled.li`
    border: 1px solid #e1e1e1;
    padding: 2rem;
`
const Span = styled.span`
    font-weight: bold;
`
const Votes = styled.p`
    text-align: center;
`
const DivVotes = styled.div`
    margin-top: 5rem;
`
const ContainerProduct = styled.div`
   @media (min-width:768px) {
        display: grid;
        grid-template-columns: 2fr 1fr;
        column-gap: 2rem;
   }
`;
const CreatorProduct = styled.p`
    padding: .5rem 2rem;
    background-color: #DA552F;
    color: #fff;
    text-transform: uppercase;
    font-weight: bold;
    display: inline-block;
    text-align: center;
    `

const Product = () => {

    // compnent state
    const [product, saveProduct] = useState({})
    const [error, saveError] = useState(false)
    const [comment, saveComment] = useState({})
    const [consultDB, saveConsultDB] = useState(true)
    //routing to obtain actual id
    const router = useRouter()
    const { query:{ id } } = router

    //firebase Context
    const { firebase, user } = useContext(FirebaseContext)

    useEffect(()=>{
        if (id && consultDB) {
            const obtainProduct = async () => {
                const productQuery = await firebase.db.collection('products').doc(id)
                const product = await productQuery.get()
                if (product.exists) {
                    saveProduct( product.data() )
                    saveConsultDB( false )
                } else {
                    saveError( true )
                    saveConsultDB( false )
                }
            }
            obtainProduct()
        }
    }, [id])

    if (Object.keys(product).length === 0 && !error ) return 'Cargando...'

    const { comments, created, description, company, name, url, urlImage, votes, creator, hasVote } = product

    //admin votes
    const voteProduct = () => {
        if(!user) {
            return router.push('/login')
        }
        //obtain and add vote
        const newTotal = votes + 1

        //verify if user has vote
        if(hasVote.includes(user.uid)) return

        //save id users has vote
        const newUserVote = [...hasVote, user.uid]

        console.log(newTotal)
        //update DB
        firebase.db.collection('products').doc(id).update({
            votes: newTotal,
            hasVote: newUserVote 
        })
        //update state
        saveProduct({
            ...product,
            votes: newTotal
        })
        saveConsultDB(true) // new vote, consult DB
    }

    //functios to create comments
    const commentChange = e => {
        saveComment({
            ...comment,
            [e.target.name] : e.target.value
        })
    }

    // identify creators product
    const isCreator = id =>{
        if (creator.id == id) {
            return true
        }
    } 

    const addComment = e=> {
        e.preventDefault()
        if(!user) {
            return router.push('/login')
        }
        // extra info to comment
        comment.userId = user.uid
        comment.userName = user.displayName

        //copy comment and add to array
        const newComments = [...comments, comment]

        // Update DB
        firebase.db.collection('products').doc(id).update({
            comments: newComments
        })
        // update state
        saveProduct({
            ...product,
            comments: newComments
        })

        saveConsultDB(true) // new comment, consult DB

    }

    //fuction to review user and creator is the same
    const canDelete = () => {
        if(!user) return false

        if (creator.id === user.uid) {
            return true
        }
    }
    // delete product from db
    const deleteProduct = async ()=> {

        if(!user) {
            return router.push('/login')
        } 
        if (creator.id !== user.uid) {
            return router.push('/')
        }
        try {
            await firebase.db.collection('products').doc(id).delete()
            router.push('/')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Layout>
            <>
                {error ? <Error404 /> : (
                    <div className='contenedor'>
                        <H1>{ name }</H1>
                        <ContainerProduct>
                            <div>
                                <p>Publicado hace: {formatDistanceToNow(new Date(created),{locale: es} )} </p>
                                <p>Por: {creator.name} de {company} </p>
                                <img src={ urlImage } />
                                <p> { description } </p>
                                {user && (
                                    <>
                                        <h2>Agrega tu comentario</h2>
                                        <form
                                            onSubmit={addComment}
                                        >
                                            <Field>
                                                <input 
                                                    type='text'
                                                    name='message'
                                                    onChange={commentChange}
                                                />
                                            </Field>
                                            <InputSubmit 
                                                type='submit'
                                                value='Agregar comentario'
                                            />
                                        </form>
                                    </>
                                )}
                                <H2>Comentarios</H2>

                                {comments.length === 0? 'No hay comentarios' : (
                                    <ul>
                                        {comments.map((comment, i) =>(
                                            <Li
                                                key={`${ comment.userId }-${i}`}
                                            >
                                                <p> {comment.message} </p>
                                                <p> Escrito por: <Span>{comment.userName}</Span> </p>
                                                { isCreator(comment.userId) && <CreatorProduct>Creador</CreatorProduct> }
                                            </Li>
                                        ))}
                                    </ul>
                                ) }

                            </div>
                            <aside>
                                <Button
                                    target='_blank'
                                    bgColor='true'
                                    href={url}
                                >Visitar URL</Button>

                                <DivVotes>
                                    <Votes> {votes} Votos </Votes>
                                    {user && ( 
                                    <Button
                                        onClick={voteProduct}
                                    >Votar</Button> )}
                                </DivVotes>
                            </aside>
                        </ContainerProduct>
                        { canDelete() && 
                            <Button
                                onClick={deleteProduct}
                            >Eliminar Producto</Button> }
                    </div>
                )}
                
            </>
        </Layout>
    );
};

export default Product;
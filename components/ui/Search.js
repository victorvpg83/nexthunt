import React, { useState } from 'react'
import styled from '@emotion/styled';
import Router from 'next/router';

const InputText = styled.input`
    border: 1px solid var(--grey3);
    padding: 1rem;
    min-width: 300px;
`
const InputSubmit = styled.button`
    height: 3rem;
    width: 3rem;
    display: block;
    background-size: 4rem;
    background-image: url('/static/img/buscar.png');
    background-repeat: no-repeat;
    position: absolute;
    right: 1rem;
    top: 1px;
    background-color: white;
    border: none;
    text-indent: -9999px;
    &:hover {
        cursor: pointer;
    }
`
const FormCss =styled.form`
    position: relative;
`

const Search = () => {

    const [search, saveSearch] = useState('')

    const searchProduct = e => {
        e.preventDefault()
        
        if(search.trim() ==='') return
        // redirect to /search
        Router.push({
            pathname:'/search',
            query: { q : search }
        })
    }

    return (
        <FormCss
            onSubmit={searchProduct}
        >
            <InputText
                type='text'
                placeholder='Buscar producto'
                onChange={ e => saveSearch(e.target.value) }
            />
            <InputSubmit type='submit'>Buscar</InputSubmit>
        </FormCss>
    )
}

export default Search